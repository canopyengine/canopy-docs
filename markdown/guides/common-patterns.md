<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Common Patterns

This page demonstrates common patterns used when building games with **Canopy Engine**.

These patterns show how to combine:

* nodes
* behaviors
* controllers
* signals
* tree systems
* contexts

to implement common gameplay systems.

---

# Player Entity Pattern

A player entity typically consists of:

* a node representing the player
* a **controller** for input and decision logic
* smaller behaviors for reusable actions

---

📌 **Player Structure**

```text
Player
 ├─ Sprite
 ├─ Collider
 ├─ PlayerController
 ├─ Move
 └─ Jump
```

---

### Example

```kotlin
class Player(name: String = "player") : Node<Player>(name) {

    override fun create() {

        Sprite2D("sprite")

        Collider("collider")

        behavior(PlayerController())

        behavior(Move())

        behavior(Jump())
    }

}
```

---

### Controller Example

```kotlin
class PlayerController(node: Player) : Behavior<Player>(node) {

    override fun onUpdate(delta: Float) {
        // handle player input
    }

}
```

The controller acts as the **brain of the entity**, coordinating actions and input.

---

# Enemy AI Pattern

Enemies usually follow a similar structure but are driven by **AI controllers**.

---

📌 **Enemy Structure**

```text
Enemy
 ├─ Sprite
 ├─ Collider
 ├─ EnemyAIController
 ├─ Patrol
 └─ Attack
```

---

### Example

```kotlin
class Enemy(name: String = "enemy") : Node<Enemy>(name) {

    override fun create() {

        Sprite2D("sprite")

        Collider("collider")

        behavior(EnemyAIController())

        behavior(Patrol())

        behavior(Attack())

    }

}
```

The AI controller decides **when to patrol, chase, or attack**.

---

# UI Update Pattern (Signals)

Signals are commonly used to connect gameplay state with UI.

This avoids polling and keeps UI updates reactive.

---

📌 **Signal Flow**

```text
Player Health Signal
        │
        ▼
HealthBar listens
        │
        ▼
UI updates automatically
```

---

### Example

Player health signal:

```kotlin
val health = signal(100)
```

UI subscription:

```kotlin
health.connect {
    healthBar.update(it)
}
```

Whenever the signal changes, the UI updates automatically.

---

# Global System Pattern (Tree Systems)

Some gameplay logic applies to **many entities** across the scene.

These systems are implemented as **Tree Systems**.

Examples:

* combat
* AI processing
* physics
* rendering

---

📌 **Tree System Pattern**

```text
Scene Tree
   ├─ Player
   ├─ Enemy
   └─ Projectile

CombatSystem processes all Damageable nodes
```

---

### Example

```kotlin
class CombatSystem : TreeSystem(
    UpdatePhase.FramePost,
    Damageable::class
)
```

This system automatically processes every node implementing `Damageable`.

---

# Shared Gameplay Rules Pattern (Contexts)

Contexts are useful when multiple nodes need access to shared data.

Examples:

* difficulty settings
* level rules
* simulation parameters

---

📌 **Context Scope**

```text
Context(GameRules)
  │
  ├─ Player
  ├─ Enemy
  └─ UI
```

All nodes inside the context can resolve the shared data.

---

### Example

```kotlin
Context {

    provide("gameRules") { rules }

    Player()

    Enemy()

}
```

Nodes can access the data when needed.

---

# Level Composition Pattern

Scenes can be composed from reusable node hierarchies.

---

📌 **Level Structure**

```text
Level Scene
 ├─ PlayerSpawn
 ├─ EnemySpawner
 ├─ Environment
 └─ UI
```

---

### Example

```kotlin
EmptyNode("level") {

    Player()

    EnemySpawner()

    Environment()

    UI()

}
```

This pattern makes it easy to **reuse scenes across multiple levels**.

---

# Entity Composition Pattern

Entities should be built using **small reusable behaviors** rather than large monolithic classes.

Example:

---

📌 **Composable Entity**

```text
Player
 ├─ PlayerController
 ├─ Move
 ├─ Jump
 └─ Dash
```

---

### Example

```kotlin
Player("player") {

    behavior(PlayerController())

    behavior(Move())

    behavior(Jump())

    behavior(Dash())

}
```

This keeps gameplay logic modular and reusable.

---

# Typical Game Architecture

Combining all these patterns produces a structure similar to this:

---

📌 **Typical Game Structure**

```text
Application
 └─ GameScreen
     └─ Scene
         ├─ Player
         │   ├─ PlayerController
         │   ├─ Move
         │   └─ Jump
         │
         ├─ Enemy
         │   └─ EnemyAIController
         │
         ├─ UI
         │   └─ HealthBar
         │
         └─ Environment
```

Global systems such as:

* RenderSystem
* CombatSystem
* PhysicsSystem

operate across the scene.

---

# Summary

These patterns represent common ways to structure gameplay logic in Canopy.

| Pattern            | Purpose                            |
| ------------------ | ---------------------------------- |
| Player Entity      | player character logic             |
| Enemy AI           | enemy behavior and decision making |
| UI Signals         | reactive UI updates                |
| Tree Systems       | global gameplay logic              |
| Contexts           | shared scoped data                 |
| Level Composition  | reusable scenes                    |
| Entity Composition | modular gameplay behaviors         |

Using these patterns will help keep your project **modular, scalable, and maintainable** as it grows.