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
    var ticks = 0

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
`reparent` moves a subtree without exit/entry callbacks or resource cleanup,
retaining its contexts and subscriptions while updating paths and indexes.

`queueFree()` requests permanent destruction after the next complete frame or
physics traversal, including a traversal that fails. The subtree stays attached
and may receive callbacks until that boundary. Requests are idempotent;
`isQueuedForDeletion` becomes true immediately, then false when `isFreed` becomes
true. Active roots and detached nodes can be queued. Queuing overlapping subtrees
cleans each node once. A freed node cannot be attached again.

`onRemoval { cleanup() }` registers a generic resource cleanup callback for the
next tree exit; its returned function cancels that registration without running
it. Each registration runs once. Cleanup registered for a freed node runs
immediately. Events, signals, effects and tree-system matches use this lifetime
mechanism without requiring Node to depend on their implementation.
`asPrefab()` suppresses automatic lifecycle on runtime attachment; it does not
clone the node.

Groups use `addGroup`, `removeGroup`, `updateGroups` and the read-only `groups`
set. SceneManager can broadcast via `signalGroup`; there is no
`withGroups`/`findNodesInGroup` API in the current engine.

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

Engine dispatch skips inactive node overrides as well as behaviors, but keeps
traversing their children. Overrides of `nodeUpdate`, `nodePhysicsUpdate` and
`nodeInput` should call `super` to retain child and behavior traversal. Calling
an override directly is ordinary Kotlin invocation; use the engine dispatch
for eligibility filtering.

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
