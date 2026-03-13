# Node System

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

The **Node System** is the structural foundation of Canopy.

Everything in a Canopy game is represented as a **node in a tree**.

Examples of nodes include:

* characters
* UI elements
* environment objects
* cameras
* particle effects

Nodes are organized into **scenes**, which define the structure of part of the game.

---

# Quick Example

```kotlin
EmptyNode("root") {

    Sprite2D("playerSprite")

    Collider("playerCollider")

}
```

This creates a node with two children.

📌 **Diagram — Simple Node Tree**

<!-- DIAGRAM: simple-node-tree -->

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

<!-- DIAGRAM: scene-node-hierarchy -->

---

# Scenes and Nodes

A **scene** is simply a node tree.

The scene defines how nodes are arranged and related to one another.

For example, a scene might contain:

* a player
* enemies
* UI
* world objects

Scenes are built by composing smaller nodes into a larger hierarchy.

---

## Comparison With Other Engines

| Engine | Equivalent          |
| ------ | ------------------- |
| Unity  | GameObjects         |
| Unreal | Actors / Components |
| Godot  | Nodes               |

Canopy is closest to **Godot’s node tree model**, where scenes are composed from hierarchical nodes.

---

# Creating Nodes

Nodes are created using a **Kotlin DSL**.

```kotlin
EmptyNode("root") {

    Sprite2D("playerSprite")

    Collider("playerCollider")

}
```

The lambda defines the node’s children.

This makes scene structure easy to read and write.

📌 **Diagram — Creating Nodes with the DSL**

<!-- DIAGRAM: node-dsl-structure -->

---

# Scene Roots

Every scene has a **root node**.

The root node is the entry point of the scene tree processed by the engine.

```kotlin
EmptyNode("root") {

    Sprite2D("logo")

}.asSceneRoot()
```

`asSceneRoot()` marks the node as the root of the active scene.

See the **Scene Manager** documentation for details on scene loading and switching.

📌 **Diagram — Scene Root Flow**

<!-- DIAGRAM: scene-root-flow -->

---

# Node Lifecycle

Nodes go through a series of lifecycle stages during runtime.

These hooks allow logic to run at specific moments.

| Method              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `create`            | initializes the node structure                  |
| `nodeEnterTree`     | called when the node enters the tree            |
| `nodeReady`         | called when the node and its children are ready |
| `nodeUpdate`        | called every frame                              |
| `nodePhysicsUpdate` | called every physics tick                       |
| `nodeExitTree`      | called when the node leaves the tree            |

📌 **Diagram — Node Lifecycle**

<!-- DIAGRAM: node-lifecycle -->

Lifecycle hooks are useful for initialization, per-frame updates, and cleanup.

---

# Node Paths

Every node has a **unique path** inside the scene tree.

For example, a tree like this:

```text
Root
 ├─ Player
 │   └─ Sprite
 └─ UI
     └─ HealthBar
```

produces paths such as:

```text
/Root/Player
/Root/Player/Sprite
/Root/UI/HealthBar
```

Paths allow nodes to be identified dynamically within the tree.

---

# Groups

Nodes can belong to **groups**.

Groups make it possible to query multiple related nodes at once.

Example:

```kotlin
Enemy("enemy") {
    withGroups("enemies")
}
```

Querying a group:

```kotlin
val enemies = tree.findNodesInGroup("enemies")
```

Groups are useful for systems that need to work with collections of nodes.

📌 **Diagram — Node Groups**

<!-- DIAGRAM: node-groups -->

---

# Related Systems

The node system works together with several other core systems.

**Behaviors**
Define node-level logic.

**Tree Systems**
Process many nodes globally.

**Scene Manager**
Controls the active scene.

Together, these systems form the core runtime architecture of Canopy.

📌 **Diagram — Node System in Engine Architecture**

<!-- DIAGRAM: node-system-architecture -->

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

# Summary

The Node System provides the structural foundation of Canopy.

Key ideas:

* **Nodes** represent entities and objects
* **Scenes** organize nodes into trees
* **Lifecycle methods** define execution stages
* **Paths and groups** help identify and query nodes

Other systems such as **Behaviors**, **Tree Systems**, and the **Scene Manager** build on top of this structure.