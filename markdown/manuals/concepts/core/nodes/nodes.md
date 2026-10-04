<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Nodes

The **Node System** is Canopy's structural foundation: a scene starts with a
root, then grows through children and their own subtrees. You can read the shape
of your world directly in its Kotlin DSL.

A node can represent a character, an inventory, a simulation controller or a
group of related objects. The structure is yours to compose.

---

# Rule of Thumb

**Nodes define structure.
Behaviors define logic.**

Nodes describe what exists in the game world and how it is organized.


---

# Mental Model

A scene is a **tree of nodes**.

Each node can have children, forming a hierarchy.

This hierarchy is one of the main ways games are structured in Canopy.

📌 **Diagram — Scene Node Hierarchy**

```text
Root
└── Player
    └── Inventory
```

The names above describe application roles. An `EmptyNode` can hold the
structure while you attach the behavior that makes each role useful.


---

# Working with the Current API

`Node<N : Node<N>>` in `io.canopy.engine.core.nodes` represents hierarchy and an
optional behavior. The enabled engine provides `EmptyNode` and `EmptyNode2D`
under `io.canopy.engine.core.nodes.types.empty`.

```kotlin
import io.canopy.engine.core.nodes.types.empty.EmptyNode

val root = EmptyNode("Root") {
    EmptyNode("Player") {
        EmptyNode("Inventory")
    }
}.asSceneRoot()
```

Constructing a node inside an active node DSL automatically attaches it to the
current parent. The DSL body executes during tree entry, not at construction.
Sibling names must be unique. `children` returns a map snapshot; `parent`,
`name` and `path` describe hierarchy. Paths change after rename or reparenting.
`getNode<T>(path)` and `node.get<T>(path)` resolve typed paths; transparent
contexts are skipped by lookup. Do not assume failed lookup returns null.

## Custom node and lifecycle

```kotlin
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.core.nodes.behavior

class Counter(name: String, block: Counter.() -> Unit = {}) :
    Node<Counter>(name, block = block) {
    var ticks by nodeProperty(0)

    override fun nodeInit() {
        behavior(onUpdate = { ticks += 1 })
    }
}
```

`buildTree()` enters the tree and readies it. Initial entry runs `nodeInit()`
and the DSL once, then behavior entry and child entry. Ready traversal visits
children before the parent behavior. Frame and physics callbacks traverse the
tree. Exit visits children before the parent's behavior.
Entry after removal runs behavior entry again without rebuilding the DSL or
children. Put subscriptions that need to be recreated in `onEnterTree`. A freed
instance cannot enter the tree again.

Use `addChild`, `removeChild` and `reparent(child, newParent)` for hierarchy
operations. `removeChild` exits and cleans up the subtree immediately, detaches
its root, and preserves descendants and context provider definitions for reuse.
Permanent destruction clears context providers. Exit callbacks run once per
entry, children before parents. Cleanup and manager unregistration still finish
if a callback throws; the first error is rethrown with later errors suppressed.
Reparenting inside an entered tree preserves contexts and subscriptions while
updating paths and indexes. Crossing an entered/detached boundary runs exit/entry
and recreates entry resources.

`queueFree()` requests permanent destruction after the next complete frame or
physics traversal, including a traversal that fails. The subtree stays attached
and may receive callbacks until that boundary. Requests are idempotent;
`isQueuedForDeletion` becomes true immediately, then false when `isFreed` becomes
true. Active roots and detached nodes can be queued. Queuing overlapping subtrees
cleans each node once. A freed node cannot be attached again.

`onRemoval { cleanup() }` registers a generic resource cleanup callback for the
next tree exit; its returned function cancels that registration without running
it. Each registration runs once. Destroyed nodes reject new registrations with `NodeDestroyedException`. Events, signals, effects and tree-system matches use this lifetime
mechanism without requiring Node to depend on their implementation.
`asPrefab()` suppresses automatic lifecycle on runtime attachment; it does not
clone the node.

Groups use `addGroup`, `removeGroup`, `updateGroups` and the read-only `groups`
set. SceneManager can broadcast via `signalGroup`; there is no
`withGroups`/`findNodesInGroup` API in the current engine.

## Typed dependency queries

Import the factories from `io.canopy.engine.core.queries` to declare read-only
dependencies in a node or behavior. Resolution happens when the property is
read, so declarations do not depend on constructor-time tree membership.

```kotlin
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.engine.core.queries.ancestor
import io.canopy.engine.core.queries.childOrNull
import io.canopy.engine.core.queries.group
import io.canopy.engine.core.queries.tree

class Actor(name: String) : Node<Actor>(name) {
    val container by ancestor<EmptyNode>()
    val attachment by childOrNull<EmptyNode>()
    val firstActor by tree<Actor>()
    val allies by group<Actor>("allies")
}
```

| Factory | Selection |
| --- | --- |
| `ancestor<T>()` | Nearest assignable ancestor, excluding the owner; includes actual context ancestors |
| `child<T>()` | First assignable direct child in insertion order; searches through transparent context wrappers |
| `tree<T>()` | First entered assignable node in preorder from the owner's hierarchy root, including the root |
| `group<T>(name)` | Snapshot of assignable entered members in the owner's scene manager, in registration order |
| `context<T>()` | Nearest context providing the exact declared type with `provide<T>` |
| `context<T>(key)` | Nearest context providing an existing string or `ContextKey` |
| `manager<T>()` | Current assignable global manager registration |

Use `ancestorOrNull`, `childOrNull`, `treeOrNull`, `contextOrNull`, and
`managerOrNull` for optional dependencies. Required queries throw
`NoSuchElementException` with the property, query and owner when missing.
Groups return an empty list for missing groups. Ambiguity between node matches
is resolved by the ordering above; manager lookup keeps the registry's existing
ambiguity rules.

Every read runs on the game thread and resolves again, observing reparenting,
membership changes, provider updates and manager replacement. Delegates retain
only query metadata, never owners or resolved dependencies. A destroyed owner
throws `NodeDestroyedException`, including for optional and group queries.
Valid detached nodes can resolve hierarchy, context and managers; tree queries
return no match and group queries return an empty list until the owner enters.
Tree lookup follows the owner's root rather than an unrelated current scene.
Group scope is the owning manager, which can include other entered hierarchies.
Returned snapshots and values retained by application code keep their normal
Kotlin lifetimes; retaining a result does not make later access safe after
destruction.

Existing `getNode`, keyed context access and direct manager access remain
available. The query manager factory is an explicit import; alias the direct
helper when both forms are needed:

```kotlin
import io.canopy.engine.core.managers.SceneManager
import io.canopy.engine.core.managers.manager as directManager
import io.canopy.engine.core.queries.manager

class Services(name: String) : Node<Services>(name) {
    val scenes by manager<SceneManager>()
    fun immediateScenes(): SceneManager = directManager<SceneManager>()
}
```

`NodeRef` is absent from the current engine. This API does not recreate that
older type or alter explicit facade references and path lookups.
See [typed context providers](../flows/contexts.md#typed-providers-and-dependencies)
and [behavior dependencies](behaviors.md#typed-dependencies).

## Compiler-enforced custom state

Keep uppercase, class-named construction and concrete Kotlin receivers:

```kotlin
class EnemyNode(name: String, block: EnemyNode.() -> Unit = {}) :
    Node<EnemyNode>(name, block = block) {
    var health by nodeProperty(100)

    override fun onUpdate(delta: Float) {
        if (health <= 0) queueFree()
    }
}

val game = EmptyNode("Game") {
    EnemyNode("Enemy") { health = 150 }
}
scenes.currScene = game
val enemy: EnemyNode = game.getNode("Enemy")
enemy.queueFree()
// After the frame/physics boundary:
check(!enemy.isValid)
check(game.getNodeOrNull<EnemyNode>("Enemy") == null)
// enemy.health, enemy.name and game.addChild(enemy) throw NodeDestroyedException.
```

The required [Gradle plugin](../../../getting-started/installation.md) rejects
unmanaged instance backing fields, including immutable and constructor properties,
`lateinit`, `lazy`, arbitrary delegates and exposed JVM fields. Use the final,
engine-controlled `NodeProperty` delegate returned by `nodeProperty(initial)`
for mutable state, or the final `Dependency` delegate for runtime queries.
Computed properties and static/companion declarations are allowed. Runtime class
validation catches unsafe Java, precompiled and missing-plugin classes before
engine registration and throws `InvalidNodeDefinitionException`.

The facade weakly references private engine state. Retaining a destroyed facade
does not retain its property values, hierarchy, providers or cleanup closures.
The JVM can collect released state when no application-owned references remain.
External application objects, reflection and arbitrary user code cannot be
revoked by the engine. Immutable identity, validity and deletion status remain
inspectable after destruction; gameplay access through engine APIs fails.

## Explicit resource ownership

Register jobs before starting them. Cancellation is cooperative: a coroutine must
observe cancellation to stop its own work. Register exclusive resource disposal
separately from reusable tree exit:

```kotlin
fun ownResources(node: Node<*>, job: kotlinx.coroutines.Job, resource: AutoCloseable) {
    node.onRemoval(job)
    node.onDestroy { resource.close() }
}
```

Both registrations return cancellation functions and execute at most once.
`onRemoval` runs at tree exit; `onDestroy` runs only for permanent destruction.
Capture resources in registered cleanup actions instead of reading disposed node
properties from exit hooks. Protected `onExitTree` can inspect immutable
`exitMetadata` including identity, name, path and destruction status.

Destruction invalidates the entire subtree before disposal, then attempts child
exit, all owned cleanup, manager/system/group/index removal and permanent resource
release even if callbacks fail. Canopy exceptions carry immutable diagnostic
values: node identity, type, last path, lifecycle state, operation and phase.
Original causes and later suppressed failures remain available. JVM errors and
coroutine cancellation preserve their original types.

## Pause-aware processing

`Node.processMode` controls frame updates, fixed physics updates, input callbacks
and `TreeSystem.processNode`. Import `io.canopy.engine.core.nodes.ProcessMode`.

| Mode | Processing |
| --- | --- |
| `Inherit` (default) | Nearest explicit ancestor mode; an inherited root is `Pausable` |
| `Pausable` | While the application is running |
| `WhenPaused` | While the application is paused |
| `Always` | Both states |
| `Disabled` | Neither state |

```kotlin
import io.canopy.engine.core.nodes.ProcessMode
import io.canopy.engine.core.nodes.behavior
import io.canopy.engine.core.nodes.types.empty.EmptyNode

val scene = EmptyNode("World") {
    EmptyNode("Gameplay") // Pauses automatically with app.pause().
    EmptyNode("PauseMenu") {
        processMode = ProcessMode.WhenPaused
        behavior(onUpdate = { delta -> /* animate the menu with real elapsed seconds */ })
    }
    EmptyNode("Overlay") { processMode = ProcessMode.Always }
}
```

Call `app.pause()` and `app.resume()` to change application state. An explicit
mode overrides an inactive ancestor, including `Disabled`, so independent menu
or overlay descendants remain reachable. Inheritance follows actual parent
links, including context wrappers. Mode changes and reparenting take effect at
the next callback dispatch; no cached eligibility needs invalidation.
`node.canProcess()` queries the current application state, or pass a boolean
explicitly to test eligibility for another pause state.

Engine dispatch skips inactive gameplay hooks and behaviors while traversing
eligible descendants. Override protected `onUpdate`, `onPhysicsUpdate` and
`onInput` hooks. Engine entrypoints `nodeUpdate`, `nodePhysicsUpdate`, `nodeInput`
and lifecycle traversal are final, so a hook cannot accidentally prevent child
cleanup by omitting a `super` call. Custom update hooks run before descendants;
behaviors run after descendants, preserving the existing traversal contract.

Tree entry, ready, exit, resize and signal/event subscriptions continue normally.
Signals and direct input polling are independent of node callback eligibility.
Keep mode edits and hierarchy changes on the engine thread.

## Immutable 2D transforms

`Vector2` has immutable `x` and `y`. Arithmetic, `add`, `scl`, and `nor` return
values. Always retain results when changing a node:

```kotlin
import io.canopy.engine.core.nodes.types.empty.EmptyNode2D
import io.canopy.engine.math.Vector2

val node = EmptyNode2D("Player")
node.position = Vector2(10f, 20f)
node.position = node.position + Vector2(1f, 0f)
node.scale = node.scale.scl(2f)
```

`Vector2.Zero` is safely shared and immutable. Global position adds parent
positions, global scale multiplies scales, and global rotation adds radians.
Inheritance follows consecutive `Node2D` parents; a non-2D parent stops it.
Parent scale and rotation do not transform position. Reads do not mutate local
values, and recompute the hierarchy on each read. Trees belong to the serialized
engine lifecycle thread.


---

# Best Practices

### Think in hierarchies

Design your game structure as a tree of related nodes.

### Keep nodes focused

Each node should represent a clear concept or entity.

### Use scenes to organize structure

Scenes are best used to group related nodes into reusable hierarchies.

### Use behaviors for logic

Keep node structure and runtime logic separate.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
