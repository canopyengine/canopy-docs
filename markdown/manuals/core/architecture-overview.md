<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Architecture Overview

Canopy is built around a **hierarchical scene system combined with modular gameplay logic and reactive state**.

A Canopy game is composed of several layers working together:

* Application
* Screens
* Scenes
* Nodes
* Behaviors
* Tree Systems
* Signals
* Contexts

Understanding how these pieces interact will make the rest of the engine much easier to learn.

---

# Mental Model in 30 Seconds

If you only remember one thing about Canopy, remember this structure:

```text
Application
    │
    ▼
Screen
    │
    ▼
Scene
    │
    ▼
Node Tree
    │
    ├─ Nodes
    ├─ Behaviors
    └─ Signals
    │
    ▼
Tree Systems process nodes
```

Or even shorter:

```
App → Screen → Scene → Nodes → Behaviors → Systems
```

---

📌 **Conceptual Diagram**

```text
Application
  │
  ▼
Screen
  │
  ▼
Scene Root
  │
  ▼
Node Tree
  │
  ├─ Player
  │   ├─ PlayerController
  │   └─ Move
  │
  ├─ Enemy
  │   └─ EnemyAIController
  │
  └─ UI
      └─ HealthBar
```

---

# Application

The **Application** is the root of the game.

It is created using the **app builder DSL**.

Example:

```kotlin
fun main() = desktopApp {

    sceneManager {
        +RenderSystem()
    }

    screens {
        start(GameScreen())
    }

}.launch()
```

The application is responsible for:

* configuring managers
* registering global systems
* defining screens
* launching the runtime

---

📌 **Startup Flow**

```text
main()
   │
   ▼
desktopApp { configuration }
   │
   ▼
launch()
   │
   ▼
Application running
```

---

# Screens

Screens represent **high-level application states**.

Examples include:

* main menu
* gameplay
* pause menu
* settings

A screen typically:

* creates the scene
* advances the scene manager
* manages screen resources

---

📌 **Screen Layer**

```text
Application
   │
   ├─ MainMenuScreen
   ├─ GameScreen
   └─ SettingsScreen
```

Only **one screen is active at a time**.

---

# Scenes

A **scene** defines the **structure of nodes** that make up part of the game.

Scenes are simply **node trees**.

Example:

```
Scene
 └─ Root
     ├─ Player
     ├─ Enemy
     └─ UI
```

Scenes are usually created inside a screen:

```kotlin
override fun setup() {

    EmptyNode("root") {

        Player()

    }.asSceneRoot()

}
```

---

# Nodes

Nodes represent **entities or structural components** in the scene.

Examples:

```
Player
Enemy
Projectile
Camera
HealthBar
InventoryPanel
```

Nodes can contain:

* child nodes
* behaviors
* signals
* references to other nodes

---

📌 **Node Tree Example**

```
Root
 ├─ Player
 │   ├─ Sprite
 │   └─ Collider
 │
 └─ UI
     └─ HealthBar
```

---

# Behaviors

Behaviors attach **logic** to nodes.

They allow gameplay functionality to be written in a **modular and reusable way**.

Example:

```kotlin
Player("player") {

    behavior(PlayerController())

    behavior(Move())

}
```

Two naming styles are recommended.

---

## Controllers

Controllers represent the **main logic driver of an entity**.

Examples:

```
PlayerController
EnemyAIController
CameraController
```

Controllers usually manage:

* input
* AI decisions
* entity state

---

## Capability Behaviors

Smaller behaviors implement reusable capabilities.

Examples:

```
Move
Jump
Attack
Dash
FollowTarget
```

---

📌 **Behavior Attachment**

```
Player Node
  │
  ├─ PlayerController
  ├─ Move
  └─ Jump
```

---

# Tree Systems

Some logic applies to **many nodes across the scene**.

These are implemented using **Tree Systems**.

Examples:

* rendering
* physics
* combat
* AI updates

Example:

```kotlin
class CombatSystem : TreeSystem(
    UpdatePhase.FramePost,
    Damageable::class
)
```

---

📌 **System Processing**

```
Scene Tree
   │
   ▼
TreeSystem scans nodes
   │
   ├─ Player
   ├─ Enemy
   └─ Projectile
```

---

# Signals

Signals represent **reactive state**.

They notify listeners whenever their value changes.

Example:

```kotlin
val health = signal(100)

health.connect {
    println("Health changed: $it")
}
```

Signals are useful for:

* UI updates
* gameplay state
* reactive systems

---

📌 **Signal Flow**

```
Health Signal
     │
     ▼
Value changes
     │
     ▼
Subscribers notified
```

---

# Contexts

Contexts allow nodes to **share scoped dependencies** across a subtree.

Instead of using global state, contexts provide values to nodes within a specific scope.

Example:

```kotlin
Context {

    provide("rules") { gameRules }

    Player()

}
```

---

📌 **Context Scope**

```
Context
  │
  ├─ Player
  ├─ Enemy
  └─ UI
```

---

# Example Game Architecture

Below is a simplified structure of a small game.

---

📌 **Game Structure**

```
Application
 └─ GameScreen
     └─ Scene Root
         ├─ Player
         │   ├─ Sprite
         │   ├─ Collider
         │   ├─ PlayerController
         │   └─ Move
         │
         ├─ Enemy
         │   └─ EnemyAIController
         │
         └─ UI
             └─ HealthBar
```

Global systems such as **RenderSystem** and **CombatSystem** process the scene.

---

# Runtime Flow

Each frame of the game follows this general flow:

---

📌 **Frame Execution**

```
Application running
      │
      ▼
Active Screen
      │
      ▼
Scene Root
      │
      ▼
Node Tree updates
      │
      ├─ Behaviors run
      ├─ Signals update
      │
      ▼
Tree Systems process nodes
```

---

# When to Use What

A common question when designing gameplay systems is **where logic should live**.

This guide helps you choose the right component.

| Use this        | When                                            |
| --------------- | ----------------------------------------------- |
| **Node**        | you need a game entity or structural component  |
| **Controller**  | an entity needs a main logic driver             |
| **Behavior**    | you want reusable gameplay capabilities         |
| **Tree System** | logic must process many nodes globally          |
| **Signal**      | a value should notify listeners when it changes |
| **Context**     | data should be shared within a subtree          |

---

### Example Decisions

**Player movement**

```
Behavior → Move
```

**Enemy AI**

```
Controller → EnemyAIController
```

**Combat resolution**

```
TreeSystem → CombatSystem
```

**Player health updates UI**

```
Signal → health
```

**Game rules shared across a level**

```
Context → GameRulesContext
```

---

# Summary

Canopy organizes gameplay around **scenes, nodes, and modular systems**.

The core architecture can be summarized as:

```
Application
   ↓
Screen
   ↓
Scene
   ↓
Node Tree
   ↓
Behaviors + Signals
   ↓
Tree Systems
```

This layered design allows Canopy projects to scale from **small prototypes to complex games** while keeping systems modular and easy to maintain.