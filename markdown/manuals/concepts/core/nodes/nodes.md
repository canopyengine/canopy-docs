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
The built guard prevents rebuilding on a later entry; do not assume an exited
instance is a fresh reusable scene.

Use `addChild`, `removeChild` and `reparent(child, newParent)` for hierarchy
operations. `queueFree()` currently removes a node from its parent immediately;
it is not a deferred destruction queue. `asPrefab()` suppresses automatic
lifecycle on runtime attachment; it does not clone the node.

Groups use `addGroup`, `removeGroup`, `updateGroups` and the read-only `groups`
set. SceneManager can broadcast via `signalGroup`; there is no
`withGroups`/`findNodesInGroup` API in the current engine.

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
