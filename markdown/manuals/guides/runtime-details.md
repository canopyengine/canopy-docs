# Runtime details: state, updates and cleanup

Canopy connects a world of nodes to a platform that runs and presents it. Start
with the runtime path below; you do not need to understand compiler internals to
write your first game. This guide describes the current terminal/headless engine,
not a promise of desktop, physics or audio support.

For a gentler introduction, read [Understanding Canopy](understanding-canopy.md).
This reference keeps the detailed rules for debugging and reusable game systems.

Follow [installation](../getting-started/installation.md) and the runnable
[first project](../getting-started/first-project.md), then return here to understand
why each part exists. Examples below are fragments, not separate runnable projects.

## Which part does what?

| Part | Responsibility | Example in an ecosystem game |
| --- | --- | --- |
| Platform host | Start the application, supply frames/input/size, present output | Terminal host |
| App and EngineLoop | Coordinate entry, frames, fixed updates, pause and shutdown | Run the simulation |
| Managers | Provide application services and dispatch | Scenes, screens, input, UI |
| Screen | Own a user-facing stage and its transition callbacks | Simulation or title screen |
| Scene | A node hierarchy installed in the scene manager | World and its overlay |
| Node | Identity, hierarchy, state and lifecycle | Rabbit, world, status panel |
| Behavior | Attach local lifecycle/update logic | Update one node |
| TreeSystem | Apply one rule across matching node types | Process all rabbits' needs |
| Signal / computed / effect | Publish state, derive state, react to changes | Population and status |
| Declarative UI | Retain elements, update bindings and arrange layout | Status and buttons |

Managers are services, not another entity hierarchy. Contexts and dependency
lookups let a node find services or values without passing everything through
constructors; a lookup is not itself reactive. See [managers](../concepts/core/managers/managers.md),
[contexts](../concepts/core/flows/contexts.md) and [dependencies](../concepts/core/dependencies.md).

```text
Platform host
    → App / EngineLoop
        → managers and active screen
            → scene tree: nodes, behaviors, matching TreeSystems
            → UI binding/layout work
        → platform presentation
```

This is a responsibility diagram, not the exact callback ordering for every
manager. Fixed updates happen before the frame update; systems choose
PhysicsPre/PhysicsPost or FramePre/FramePost around scene traversal.

## Follow one rabbit through the runtime

1. Application entry initializes services and, when configured, enters the chosen screen.
2. A screen or the application entry callback installs a world hierarchy using
   `asSceneRoot()`. Screens are optional; the starter installs its scene directly.
3. Nodes enter the tree. Entry hooks can establish subscriptions and effects;
   TreeSystems register nodes whose own types match their requirements.
4. The host supplies elapsed seconds. EngineLoop runs fixed updates and then
   a frame update. Node process modes decide which callbacks remain eligible
   when the application is paused.
5. Simulation rules change world state. A death calls `rabbit.queueFree()`;
   that schedules permanent destruction rather than promising immediate cleanup.
6. The simulation publishes selected signal values, such as population.
   Effects respond synchronously; UI observers schedule binding/structure work.
7. UI layout uses the current available size and the host presents a frame.
8. Destruction releases memberships and owned resources. Application shutdown
   attempts teardown; a lifecycle failure can propagate through `AppHandle.join()`.

An ecosystem **day phase** is a gameplay rule. It is not automatically one engine
frame or one fixed update: choose when to advance simulation ticks explicitly.

For detailed dispatch contracts read [application](../concepts/app/application.md),
[screens](../concepts/app/screens.md), [scenes](../concepts/core/nodes/scenes.md),
[behaviors](../concepts/core/nodes/behaviors.md) and [TreeSystems](../concepts/core/nodes/tree-systems.md).
A parent containing a rabbit does not qualify for a rabbit system.

## Storage is not change notification

```kotlin
class Rabbit : Node<Rabbit>("Rabbit") {
    var energy = 100
    val displayedEnergy = signal(owner = this, value = 100)
}
```

With the compiler plugin, `energy` is guarded node storage: it stays available
while the node is valid and is released on destruction. It does not notify
observers. The signal additionally publishes unequal replacement values:

```kotlin
rabbit.energy -= 1
rabbit.displayedEnergy.update { rabbit.energy }
```

The explicit owner matters here: constructor property initializers are not the
new node's managed initialization callback. Automatic property storage does not
transfer ownership of objects placed inside a property.

```kotlin
Text("Energy: ${rabbit.displayedEnergy()}") // Tracks a signal read.
Text("Energy: ${rabbit.energy}")           // No reactive dependency.
```

The second expression can show its initial value without updating on later writes.
A constant label needs no signal. A button's action reads state when clicked; it
is not an observed expression that must rerun when that state changes. Currently
these distinctions are the developer's responsibility; do not assume a diagnostic
protects every nonreactive read.

A computed value caches a derivation and tracks its inputs. An effect performs
work immediately and reruns when tracked inputs change. Keep computed derivations
pure. Effects are synchronous, so expensive work can delay the simulation.
Mutation inside a signal's existing object does not automatically notify: replace
values instead. See [events and reactive state](../concepts/core/flows/events-and-signals.md).

## Detachment, destruction and ownership

```kotlin
world.removeChild(rabbit) // Detach for reuse; rabbit remains valid.
world.addChild(rabbit)    // Reattach it.
rabbit.queueFree()       // Schedule permanent destruction.
```

Detachment removes active tree participation. It does not destroy properties or
implicitly queue deletion. Keep a reference and arrange eventual reattachment or
destruction. Losing a reference is not a substitute for deterministic cleanup;
garbage collection does not run Canopy's destruction contract.

| Resource | Detach / tree exit | Permanent destruction |
| --- | --- | --- |
| Guarded properties and child hierarchy | Retained | Released / subtree destroyed |
| Node-owned signals and outgoing events | Retained | Disposed |
| Node-owned subscription handles | Disconnected | Remaining cleanup attempted |
| Node-owned effects and computed values | Disposed | Remaining cleanup attempted |
| Declarative UI observers | Suspended; resume on reentry | Disposed |
| Explicitly shared resources (`owner = null`) | Not owned by this node | Caller must dispose |

An effect created once in initialization does **not** automatically recreate
itself after exit. Establish entry-scoped observers in an entry hook when a node
must support reuse:

```kotlin
EmptyNode("Monitor") {
    val population = signal(12)
    behavior(onEnterTree = {
        effect {
            val current = population()
            // React to the current population for this tree entry.
        }
    })
}
```

The initializer owns the signal; each entry owns a new effect. When detached,
the effect stops while the signal survives. On reentry, the entry callback runs
again. This does not require manually retaining every entry-owned effect.

Ownership is captured when a resource is created in a managed node callback, or
when an explicit owner is supplied. Event listener execution and effect/computed
bodies do not open ambient node ownership scopes, including the first effect run.
Give nested resources explicit owners instead of relying on the effect's owner.
Use `onRemoval` for entry-scoped cleanup and `onDestroy` for permanent resources.
See [node lifecycle and ownership](../concepts/core/nodes/nodes.md).

## Input, commands and UI are connected, but distinct

Input converts host events into keys/actions. Focus decides which interactive
surface receives input. Commands parse and execute user intentions such as
`pause` or `inspect`; the prompt edits command text.

`prompt.open()` activates command editing, and `prompt.close()` releases it.
`show()` and `hide()` control rendering visibility instead. While an open prompt
captures gameplay keys, the simulation continues unless pause-on-open is enabled.
Explicit pause/resume is a separate application operation.

UI declarations describe retained elements. Signal reads in supported property
expressions create bindings; `if`/`when` containing declarations create structural
regions. When a condition changes, omitted elements are destroyed and newly
selected elements are created. Hiding an element instead preserves it and its
layout space. Use keyed declarations for repeated children; do not imperatively
edit a declaratively managed hierarchy.

Containers arrange children using available space. The terminal supplies its new
cell dimensions after a resize, and layout uses those bounds. Responsive layout
is not a guarantee that the host terminal window can be locked against resizing.

Read [input](../concepts/input/input.md), [commands](../concepts/app/command-prompts.md)
and [UI/layout](../concepts/app/declarative-ui.md) together for an interactive overlay.

## Supporting services: learn them when the game needs them

- **Assets/resources** resolve content and manage resource access. They do not
  automatically define a persistence schema. Read [assets](../concepts/data/assets-and-resources.md)
  and [content pipeline](../concepts/data/content-pipeline.md).
- **Saving/parsing** serialize explicit data models through modules/destinations.
  Duplicate module IDs in a destination are rejected; missing data preserves
  previously loaded values. Save a rabbit snapshot, not its compiler-generated
  physical storage. Read [saving](../concepts/data/saving-and-loading.md) and
  [serialization](../concepts/data/parsing-and-serialization.md).
- **Logging** reports diagnostics. In the proposed alpha.2 fix, terminal/headless
  hosts default to file-only managed logging; custom core hosts can choose a policy. Read [logging](../concepts/logging/logging.md).
- **Vectors/transforms** use immutable values; assign arithmetic results back.
  They are not a collision/physics implementation. Read [math](../concepts/math/vectors-and-transforms.md).

## What the compiler contributes

The compiler turns supported ordinary node properties into guarded storage,
validates definitions, transforms reactive UI expressions and guards fallible
node construction. It does not make every property reactive or dispose every
object stored on a node. Physical payload fields disappear, so field reflection
and field-based serializers need separate data models. Unsupported forms receive
compiler diagnostics rather than silently bypassing lifetime rules.

Use matching engine/compiler/Gradle-plugin artifacts. Start with the public
manuals; read [compiler and platform tooling](../../engine-details/integration-and-tooling.md)
when extending tooling or investigating generated behavior.

## A practical reading route

1. Run the first project and change a visible label.
2. Read nodes, behaviors and TreeSystems; add one simulation rule.
3. Read reactive state and the lifecycle table; publish one UI value.
4. Read input, commands and UI; add one command and test resizing.
5. Read saving/assets only when persistent data or external content is needed.
6. Use architecture references when changing the engine itself.

The goal is to understand one complete path before learning every service.
