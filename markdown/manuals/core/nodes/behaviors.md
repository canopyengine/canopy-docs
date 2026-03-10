<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Behaviors

**Behaviors** allow you to attach modular logic to nodes.

Instead of placing all gameplay logic directly inside node classes, behaviors allow logic to be separated into reusable
components.

This makes gameplay systems:

- easier to maintain
- easier to reuse
- easier to compose

Behaviors are commonly used to implement things like:

- player controllers
- movement systems
- AI logic
- gameplay abilities

---

# Concept

A node represents **structure**, while behaviors represent **logic**.

📌 **Node Composition**

```text
Player Node
   │
   ├─ Sprite
   ├─ Collider
   │
   └─ Behaviors
       ├─ PlayerController
       ├─ Move
       └─ Jump
````

This approach keeps node classes small while allowing complex behavior to be composed from multiple modules.

---

# Creating a Behavior

Behaviors are created by extending the `Behavior` class.

Example:

```kotlin
class PlayerController(
    node: Player
) : Behavior<Player>(node) {

    override fun onUpdate(delta: Float) {
        // Handle player input
    }

}
```

The behavior receives the node it is attached to, allowing it to interact with that node.

---

# Attaching Behaviors

Behaviors can be attached to nodes using the `behavior()` function.

Example:

```kotlin
Player("player") {

    behavior(PlayerController())

    behavior(Move())

}
```

Each behavior runs independently but operates on the same node.

---

📌 **Behavior Execution**

```text
Node
 │
 ▼
Behaviors
 │
 ├─ PlayerController
 ├─ Move
 └─ Jump
```

Each behavior can respond to lifecycle events.

---

# Behavior Lifecycle

Behaviors follow a lifecycle similar to nodes.

| Method            | Description                                     |
| ----------------- | ----------------------------------------------- |
| `onEnterTree`     | called when the node enters the scene tree      |
| `onExitTree`      | called when the node leaves the scene tree      |
| `onReady`         | called when the node and its children are ready |
| `onUpdate`        | called on frame updates                         |
| `onPhysicsUpdate` | called on physics ticks                         |

Example:

```kotlin
override fun onReady() {
    logger.info("Player ready")
}

override fun onUpdate(delta: Float) {
    // update logic
}
```

---

# Creating Behaviors Inline

For small behaviors, you can create them inline using the `behavior()` DSL.

Example:

```kotlin
EmptyNode("example") {

    behavior(
        onReady = {
            println("Node is ready")
        },
        onUpdate = {
            // update logic
        }
    )

}
```

This is useful for simple logic that does not need a dedicated class.

---

# Controllers vs Capability Behaviors

Two common types of behaviors exist.

---

## Controllers

Controllers act as the **primary logic driver** of a node.

Examples:

```
PlayerController
EnemyAIController
CameraController
```

Controllers typically handle:

* input
* AI decision making
* entity state

---

## Capability Behaviors

Capability behaviors represent **reusable gameplay actions**.

Examples:

```
Move
Jump
Dash
FollowTarget
Attack
```

These behaviors can be reused across multiple nodes.

---

📌 **Example Composition**

```text
Player
 ├─ PlayerController
 ├─ Move
 ├─ Jump
 └─ Dash
```

This modular design keeps gameplay systems flexible.

---

# When to Use Behaviors

Use behaviors when:

* logic should be **reusable**
* nodes should remain **lightweight**
* functionality should be **modular**

Avoid placing large amounts of logic directly inside node classes when that logic could be separated.

---

# When Not to Use Behaviors

Behaviors are not intended for **global systems**.

If logic needs to operate across many nodes in the scene, consider using **Tree Systems** instead.

Example:

```
CombatSystem
PhysicsSystem
RenderSystem
```

Tree systems process nodes globally, while behaviors operate on individual nodes.

---

# Example

A simple player node using behaviors:

```kotlin
Player("player") {

    behavior(PlayerController())

    behavior(Move())

    behavior(Jump())

}
```

Each behavior adds functionality while keeping the node definition clean.

---

# Summary

Behaviors allow nodes to be extended with modular gameplay logic.

```text
Node
   │
   ▼
Behaviors
   │
   ├─ Controllers
   └─ Capabilities
```

This design promotes:

* modular gameplay systems
* reusable logic
* clean node definitions