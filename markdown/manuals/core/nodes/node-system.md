<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Node System

The **Node System** is the core architecture used to build games in Canopy.

Everything in the game world is represented as **nodes arranged in a tree**.

Examples of things represented by nodes include:

- characters
- UI elements
- environment objects
- cameras
- particle effects

Nodes are combined into **scenes**, which define the structure of a part of the game.

---

# Scenes and Nodes

A **scene** is simply a **tree of nodes**.

Nodes represent individual elements, while the scene defines how those elements are organized.

---

📌 **Diagram suggestion**

```text
Scene
 └─ Root Node
     ├─ Player
     │   ├─ Sprite
     │   └─ Collider
     │
     ├─ Enemy
     │   └─ Sprite
     │
     └─ UI
         └─ HealthBar
````

---

## Comparison With Other Engines

| Engine | Equivalent          |
| ------ | ------------------- |
| Unity  | GameObjects         |
| Unreal | Actors / Components |
| Godot  | Nodes               |

Canopy’s model is most similar to **Godot’s node tree architecture**, where scenes are composed of nodes arranged in a hierarchy.

---

# Creating Nodes

Nodes are created using a **Kotlin DSL**.

Example:

```kotlin
EmptyNode("root") {

    Sprite2D("playerSprite")

    Collider("playerCollider")

}
```

The lambda defines the **children of the node**, building the tree structure.

---

📌 **Diagram suggestion**

```text
EmptyNode("root")
    │
    ├─ Sprite2D("playerSprite")
    └─ Collider("playerCollider")
```

---

# Scene Roots

Every scene has a **root node**.

The root defines the entire node tree processed by the engine.

Example:

```kotlin
EmptyNode("root") {

    Sprite2D("logo")

}.asSceneRoot()
```

`asSceneRoot()` tells the **Scene Manager** that this node should become the active scene.

See the **Scene Manager** documentation for more details.

---

📌 **Diagram suggestion**

```text
SceneManager
     │
     ▼
Scene Root
     │
     ▼
Node Tree
```

---

# Node Lifecycle

Nodes go through several lifecycle stages.

These lifecycle methods allow logic to run at specific moments.

| Method              | Description                             |
| ------------------- | --------------------------------------- |
| `create`            | node structure initialization           |
| `nodeEnterTree`     | node added to the scene tree            |
| `nodeReady`         | node and its children fully initialized |
| `nodeUpdate`        | called every frame                      |
| `nodePhysicsUpdate` | called every physics tick               |
| `nodeExitTree`      | node removed from the tree              |

---

📌 **Diagram suggestion**

```text
create
  │
  ▼
enterTree
  │
  ▼
ready
  │
  ▼
update loop
  │
  ▼
exitTree
```

---

# Node Paths

Every node has a **unique path** inside the tree.

Example:

```text
Root
 ├─ Player
 │   └─ Sprite
 └─ UI
     └─ HealthBar
```

Paths:

```
/Root/Player
/Root/Player/Sprite
/Root/UI/HealthBar
```

Paths allow nodes to be resolved dynamically.

See **Node References** for safer ways to access nodes.

---

# Groups

Nodes can belong to **groups**, which allow systems to query collections of nodes.

Example:

```kotlin
Enemy("enemy") {
    withGroups("enemies")
}
```

Query example:

```kotlin
val enemies = tree.findNodesInGroup("enemies")
```

---

📌 **Diagram suggestion**

```text
Scene Tree
 ├─ Enemy (group: enemies)
 ├─ Enemy (group: enemies)
 └─ Player

Query → enemies
```

---

# Related Systems

The node system works together with several other core systems:

* **Behaviors** — attach modular gameplay logic to nodes
* **Tree Systems** — process nodes globally
* **Scene Manager** — controls the active scene

These systems together form the core runtime architecture of Canopy.

---

📌 **Diagram suggestion**

```text
SceneManager
     │
     ▼
Scene Root
     │
     ▼
Node Tree
     │
     ├─ Nodes
     ├─ Behaviors
     └─ Signals
     │
     ▼
Tree Systems
```

---

# Summary

The Node System provides the structural foundation of the engine.

Key ideas:

* **Nodes** represent entities
* **Scenes** organize nodes in a tree
* **Lifecycle methods** define execution stages
* **Paths and groups** help locate nodes

Other systems such as **Behaviors**, **Tree Systems**, and the **Scene Manager** build on top of this structure.
