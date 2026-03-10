<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Canopy Guidelines

This document describes **recommended project organization and coding conventions** when building games with **Canopy Engine**.

Canopy does not enforce a specific project structure, but following these guidelines helps projects remain:

* scalable
* easy to navigate
* easier to maintain
* easier for teams to collaborate on

The recommended architecture combines:

* **shared infrastructure (`core`)**
* **feature-based gameplay code**
* **feature-aligned assets**

---

# Architectural Principles

Canopy projects should follow three core principles.

## 1. Organize by feature

Gameplay code should be grouped by **feature**, not by technical type.

Good examples:

```
player
combat
inventory
enemies
ui
```

Avoid global folders like:

```
nodes/
systems/
behaviors/
```

These scatter related code across the project.

---

## 2. Keep features self-contained

A feature should contain everything required to implement it:

* nodes
* scenes
* behaviors
* systems
* signals
* configuration
* assets

Self-contained features are easier to:

* understand
* refactor
* move
* delete

---

## 3. Separate shared infrastructure

Some code does not belong to a gameplay feature.

Examples:

* application bootstrap
* debug tools
* configuration
* shared utilities

These belong in a **core package**.

---

# Recommended Project Structure

The following layout works well for most Canopy projects while respecting **JVM conventions (`src/main/resources`)**.

```text
my-game/
├─ build.gradle.kts
├─ settings.gradle.kts
│
├─ src/
│  └─ main/
│     ├─ kotlin/
│     │  └─ com/example/game/
│     │
│     │     ├─ core/
│     │     │  ├─ app/
│     │     │  ├─ config/
│     │     │  └─ debug/
│     │     │
│     │     ├─ features/
│     │     │  ├─ player/
│     │     │  ├─ enemies/
│     │     │  ├─ combat/
│     │     │  ├─ inventory/
│     │     │  └─ ui/
│     │     │
│     │     └─ levels/
│     │        ├─ forest/
│     │        ├─ dungeon/
│     │        └─ town/
│     │
│     └─ resources/
│        ├─ features/
│        │  ├─ player/
│        │  ├─ enemies/
│        │  ├─ combat/
│        │  ├─ inventory/
│        │  └─ ui/
│        │
│        └─ shared/
│           ├─ fonts/
│           ├─ debug/
│           └─ ui/
```

This structure provides:

* clear separation of **core infrastructure**
* feature-oriented **gameplay logic**
* **feature-aligned assets**

---

# Core Package

The `core` package contains **shared infrastructure** used throughout the project.

Example:

```
core/
 ├─ app/
 ├─ config/
 ├─ debug/
 └─ util/
```

Typical responsibilities include:

* application startup
* debugging tools
* shared helpers
* configuration systems

Avoid placing gameplay features inside `core`.

---

# Feature Packages

Gameplay logic lives inside `features/`.

Each feature represents a **distinct gameplay domain**.

Example:

```
features/player/
```

Features may include:

| Component | Purpose                   |
| --------- | ------------------------- |
| nodes     | gameplay entities         |
| scenes    | reusable node hierarchies |
| behaviors | modular gameplay logic    |
| systems   | tree systems              |
| signals   | reactive state            |
| data      | configuration             |

Example:

```
features/player/
├─ Player.kt
├─ PlayerScene.kt
├─ PlayerController.kt
├─ Move.kt
├─ Jump.kt
├─ PlayerInventorySystem.kt
└─ PlayerHealthSignal.kt
```

---

# Organizing Large Features

Large features can be organized internally.

Example:

```
features/player/
├─ nodes/
│  └─ Player.kt
├─ scenes/
│  └─ PlayerScene.kt
├─ controllers/
│  └─ PlayerController.kt
├─ behaviors/
│  ├─ Move.kt
│  └─ Jump.kt
├─ systems/
│  └─ PlayerInventorySystem.kt
├─ signals/
│  └─ PlayerHealthSignal.kt
└─ data/
```

This keeps the feature structured without breaking the **feature boundary**.

---

# Level Organization

Levels represent playable areas or world regions.

Example:

```
levels/
├─ forest/
│  └─ ForestScene.kt
├─ dungeon/
│  └─ DungeonScene.kt
└─ town/
   └─ TownScene.kt
```

Level packages typically contain:

* environment scenes
* environment nodes
* level configuration

---

# Asset Organization

Assets should follow the same **feature-based structure** as code.

Because JVM projects expect resources under `src/main/resources`, assets should live there while remaining feature-aligned.

Example:

```
resources/
├─ features/
│  ├─ player/
│  │  ├─ textures/
│  │  ├─ animations/
│  │  ├─ audio/
│  │  └─ data/
│  │
│  ├─ enemies/
│  │  ├─ textures/
│  │  └─ audio/
│  │
│  ├─ combat/
│  │  ├─ effects/
│  │  └─ audio/
│  │
│  └─ ui/
│     ├─ textures/
│     └─ themes/
│
└─ shared/
   ├─ fonts/
   ├─ debug/
   └─ ui/
```

Feature-aligned assets make it easier to:

* understand a feature in isolation
* move or refactor features
* avoid large global asset folders

Use `shared/` only for assets reused across multiple features.

---

# Node Design Guidelines

Nodes represent **entities or structural components** in the scene.

Examples:

```
Player
Enemy
Projectile
HealthBar
InventoryPanel
```

Nodes should manage:

* structure
* state
* interaction with behaviors

Avoid placing large gameplay systems directly inside nodes.

---

# Behavior Naming

Behaviors should be named based on their **responsibility**.

Two naming styles are recommended.

## Controllers

Use `Controller` for behaviors that drive the main logic of an entity.

Examples:

```
PlayerController
EnemyAIController
CameraController
```

Controllers typically:

* process input or AI
* coordinate other behaviors
* manage entity state

---

## Capability Behaviors

Smaller reusable behaviors should use **short action or capability names**.

Examples:

```
Move
Jump
Dash
Attack
Patrol
FollowTarget
RotateTowardsTarget
```

Example usage:

```kotlin
Player("player") {

    behavior(PlayerController())

    behavior(Move())
    behavior(Jump())

}
```

This keeps behavior names concise and readable.

---

# Use Signals for Reactive State

Signals should represent **values that change over time**.

Examples:

* health
* stamina
* score
* simulation state

Example:

```kotlin
player.health.connect {
    healthBar.update(it)
}
```

Reactive systems reduce unnecessary polling.

---

# Use Tree Systems for Cross-Tree Logic

Some logic applies across many nodes.

Examples:

* combat resolution
* AI updates
* physics
* rendering

These should be implemented as **Tree Systems**.

Example:

```kotlin
class CombatSystem : TreeSystem(
    UpdatePhase.FramePost,
    Damageable::class
)
```

Tree systems should live inside the feature they belong to.

Example:

```
features/combat/CombatSystem.kt
```

---

# Prefer Contexts to Global State

Avoid relying heavily on global singletons.

Instead use **Contexts** to provide scoped dependencies.

Examples:

* simulation configuration
* UI themes
* gameplay rules
* level parameters

Contexts reduce coupling between systems.

---

# Naming Conventions

Consistent naming improves readability.

### Nodes

Use **PascalCase**.

```
Player
EnemySpawner
InventoryPanel
```

### Controllers

Suffix with `Controller`.

```
PlayerController
EnemyAIController
CameraController
```

### Systems

Suffix with `System`.

```
CombatSystem
DamageSystem
InventorySystem
```

### Signals

Suffix with `Signal`.

```
HealthSignal
ScoreSignal
EnergySignal
```

---

# Scaling Large Projects

Large games may benefit from splitting the project into multiple modules.

Example:

```
my-game/
├─ game-core/
├─ game-client/
├─ game-tools/
└─ game-server/
```

Benefits:

* faster builds
* clearer boundaries
* improved dependency management

---

# Summary

The recommended architecture for Canopy projects is:

**Core infrastructure + feature-based gameplay code + feature-aligned assets.**

Key principles:

* organize gameplay by **feature**
* keep features **self-contained**
* place shared infrastructure in **core**
* align assets with the features that own them
* use **Controllers** for entity brains
* use **short capability behaviors** for modular logic
* implement cross-tree logic as **Tree Systems**

Following these guidelines helps Canopy projects remain **maintainable and scalable** as they grow.
