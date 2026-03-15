<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Behaviors

Behaviors allows you to attach **custom logic to your nodes**.

While nodes define the **structure of a scene**, behaviors implement the **logic associated with those nodes**.

Examples of behavior logic include:

* player movement
* enemy AI
* camera control
* gameplay interactions

> [!IMPORTANT]
> Each node in Canopy can contain up to **one behavior**.

---

# Quick Example

```kotlin
Player("player") {

    behavior(PlayerController())

}
```

`PlayerController` defines how the player behaves during the game.

---

📌 **Diagram — Node and Behavior Relationship**

```text
<!-- DIAGRAM: node-behavior-relationship -->
```

---

# Mental Model

Nodes represent **entities**, while behaviors represent **logic**.

```text
Player Node
   │
   ▼
PlayerController Behavior
```

This separation keeps node structures simple while allowing logic to be implemented independently.

---

# Creating a Behavior

Behaviors are created by extending the `Behavior` class.

Example:

```kotlin
class PlayerController : Behavior<Player>() {

    override fun onUpdate(delta: Float) {
        node.move()
    }

}
```

The behavior receives the node it is attached to through the `node` property.

This allows the behavior to interact with the node's data and functions.

---

# Attaching a Behavior

A behavior is attached to a node using the `behavior()` function.

Example:

```kotlin
Player("player") {

    behavior(PlayerController())

}
```

Each node can have **exactly one behavior**.

---

📌 **Diagram — Node with Behavior**

```text
<!-- DIAGRAM: node-with-behavior -->
```

---

# Inline Behaviors

For simple logic, behaviors can be defined inline using the DSL.

Example:

```kotlin
EmptyNode("example") {

    behavior(
        onReady = {
            println("Node ready")
        },

        onUpdate = {
            println("Updating node")
        }
    )

}
```

Inline behaviors are useful for **small or temporary logic**.

---

# Behavior Lifecycle

Behaviors follow the lifecycle of their node.

| Method            | Description                                     |
| ----------------- | ----------------------------------------------- |
| `onEnterTree`     | called when the node enters the scene tree      |
| `onReady`         | called when the node and its children are ready |
| `onUpdate`        | called every frame                              |
| `onPhysicsUpdate` | called during physics updates                   |
| `onExitTree`      | called when the node leaves the scene tree      |

Example:

```kotlin
override fun onReady() {
    println("Node ready")
}
```

These lifecycle hooks allow behaviors to react to runtime events.

---

📌 **Diagram — Behavior Lifecycle**

```text
<!-- DIAGRAM: behavior-lifecycle -->
```

---

# Behavior Responsibilities

Behaviors are responsible for **local node logic**.

Examples:

| Behavior           | Purpose                 |
| ------------------ | ----------------------- |
| `PlayerController` | handle player input     |
| `EnemyAI`          | control enemy behavior  |
| `CameraController` | control camera movement |
| `WeaponSystem`     | manage weapon actions   |

Each behavior focuses on **a single node's responsibilities**.

---

# Behaviors vs Tree Systems

Behaviors operate on **individual nodes**, while tree systems operate on **multiple nodes globally**.

| Feature        | Behavior     | Tree System      |
| -------------- | ------------ | ---------------- |
| Scope          | single node  | many nodes       |
| Responsibility | node logic   | global logic     |
| Example        | player input | enemy AI manager |

Both systems work together to structure gameplay logic.

---

📌 **Diagram — Behaviors vs Tree Systems**

```text
<!-- DIAGRAM: behaviors-vs-tree-systems -->
```

---

# Best Practices

### Keep behaviors focused

Each behavior should represent a single responsibility.

---

### Separate structure from logic

Nodes define structure, behaviors define behavior.

---

### Use tree systems for global logic

If logic affects many nodes, it may belong in a tree system.

---

# Summary

Behaviors define the **runtime logic of nodes**.

```text
Node
  │
  ▼
Behavior
```

Key ideas:

* each node has a single behavior
* behaviors implement gameplay logic
* lifecycle methods control runtime execution

Together with **nodes** and **tree systems**, behaviors form the core gameplay architecture of Canopy.

---