<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Managers

Managers are **globally accessible services** used to coordinate engine-wide functionality.

Unlike nodes, behaviors, or tree systems, managers do **not belong to the scene tree**.  
Instead, they provide shared functionality that can be accessed from anywhere in the application.

Managers are useful for systems such as:

- scene control
- asset loading
- save management
- global configuration
- shared registries

---

# Concept

Managers live at the **application level**, outside the node tree.

📌 **High-Level Architecture**

```text
Application
   │
   ├─ Managers
   │   ├─ SceneManager
   │   ├─ AssetsManager
   │   └─ SaveManager
   │
   ▼
Scene Tree
   ├─ Nodes
   ├─ Behaviors
   └─ Tree Systems
````

Managers provide services that the rest of the engine can access when needed.

---

# What Managers Are For

Managers are best used for systems that must be:

* shared globally
* independent of the active scene
* accessible from many parts of the engine

Typical examples:

* loading assets used by many scenes
* saving and loading player progress
* tracking the active scene
* storing shared configuration

If a system only needs to process nodes inside the scene tree, prefer **Tree Systems** instead.

---

# Managers vs Other Systems

Managers fill a different role from the rest of the runtime architecture.

| System       | Purpose                          |
| ------------ | -------------------------------- |
| Nodes        | represent entities and structure |
| Behaviors    | attach logic to individual nodes |
| Tree Systems | process groups of nodes globally |
| Managers     | provide global services          |

📌 **System Roles**

```text
Managers      → global services
Tree Systems  → global scene processing
Behaviors     → per-node logic
Nodes         → scene structure
```

---

# Accessing Managers

Managers can be retrieved using the `manager()` utility.

Example:

```kotlin
val sceneManager = manager<SceneManager>()
```

This returns the registered instance of the requested manager.

Because managers are global services, they can be accessed from:

* screens
* nodes
* behaviors
* tree systems
* other managers

---

# Lazy Access

If a manager is used frequently, it can be retrieved lazily.

```kotlin
val sceneManager by lazyManager<SceneManager>()
```

This delays the lookup until the manager is first needed.

---

# Built-In Managers

Canopy provides several built-in managers.

| Manager         | Responsibility                             |
| --------------- | ------------------------------------------ |
| `SceneManager`  | controls the active scene and tree systems |
| `AssetsManager` | loads assets and files                     |
| `SaveManager`   | handles save/load operations               |

These managers are part of the engine runtime and are typically available during application execution.

---

# Registering Managers

Managers are usually registered during application setup.

Example:

```kotlin
fun main() = desktopApp {

    sceneManager {
        +RenderSystem()
    }

}.launch()
```

Once registered, managers become available globally through `manager()`.

---

# Creating Custom Managers

Applications can also define their own managers.

Custom managers are useful for shared systems such as:

* quest tracking
* localization
* analytics
* gameplay registries
* global game state

A custom manager should represent a **global service**, not scene-specific logic.

---

## Example

```kotlin
class QuestManager {
    private val completedQuests = mutableSetOf<String>()

    fun complete(id: String) {
        completedQuests += id
    }

    fun isCompleted(id: String): Boolean {
        return id in completedQuests
    }
}
```

Once registered, it can be accessed anywhere:

```kotlin
val questManager = manager<QuestManager>()

questManager.complete("intro_quest")
```

---

# When to Create a Custom Manager

Create a custom manager when a system must:

* outlive individual scenes
* be shared across multiple systems
* not belong to a node tree
* act as a service rather than gameplay structure

Good examples:

* save slot tracking
* localization
* content registries
* achievement tracking

Avoid using managers for systems that should instead be:

* attached to a node
* processed as a tree system
* scoped to a subtree via contexts

---

# When Not to Use a Manager

Do **not** use a manager when logic is:

* scene-local
* entity-specific
* better expressed as a behavior
* only needed inside a subtree

Examples of systems that usually should **not** be managers:

* player movement
* enemy AI
* per-level gameplay rules
* UI widget behavior

These fit better as:

* nodes
* behaviors
* tree systems
* contexts

---

# Design Guidelines

Good managers should be:

* focused
* easy to reason about
* globally relevant
* independent of scene structure

Try to avoid turning managers into large “god objects” that own too many unrelated responsibilities.

A good rule is:

> A manager should provide one clear global service.

---

# Summary

Managers provide **global services** used across the application.

📌 **Manager Role**

```text
Application
   │
   ▼
Managers
   │
   ├─ SceneManager
   ├─ AssetsManager
   ├─ SaveManager
   └─ Custom Managers
```

Use managers for systems that must exist outside the scene tree and remain accessible throughout the lifetime of the application.