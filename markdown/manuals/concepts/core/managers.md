<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Managers

Managers are **globally accessible services** used to coordinate engine-wide functionality.

Unlike **nodes**, **behaviors**, or **tree systems**, managers do **not belong to the scene tree**.
Instead, they provide shared services that can be accessed from anywhere in the application.

Managers are typically responsible for systems such as:

* scene control
* asset loading
* save management
* global configuration
* shared registries

---

# Mental Model

Managers live at the **application level**, above the scene tree.

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
```

📌 **Diagram — Engine Architecture**

<!-- DIAGRAM: managers-architecture -->

Managers coordinate services used across the engine while the **scene tree handles gameplay structure**.

---

# What Managers Are For

Managers are best suited for systems that must be:

* **shared globally**
* **independent of the active scene**
* **accessible from multiple parts of the engine**

Typical examples include:

* loading assets used across many scenes
* saving and loading game progress
* controlling the active scene
* managing shared configuration

If a system only needs to process nodes inside the scene tree, it should usually be implemented as a **Tree System** instead.

---

# Managers vs Other Systems

Managers serve a different role from the rest of the runtime architecture.

| System           | Responsibility                         |
| ---------------- | -------------------------------------- |
| **Nodes**        | represent entities and scene structure |
| **Behaviors**    | add logic to individual nodes          |
| **Tree Systems** | process groups of nodes globally       |
| **Managers**     | provide global services                |

```text
Managers      → application-level services
Tree Systems  → scene-level processing
Behaviors     → per-node logic
Nodes         → scene structure
```

📌 **Diagram — Runtime Roles**

<!-- DIAGRAM: runtime-system-roles -->

---

# Accessing Managers

Managers can be retrieved using the `manager()` utility.

```kotlin
val sceneManager = manager<SceneManager>()
```

This returns the registered instance of the requested manager.

Managers can be accessed from:

* screens
* nodes
* behaviors
* tree systems
* other managers

---

# Lazy Access

For frequently used managers, lazy access can be used.

```kotlin
val sceneManager by lazyManager<SceneManager>()
```

The lookup happens only when the manager is first accessed.

---

# Built-In Managers

Canopy provides several built-in managers.

| Manager         | Responsibility                             |
| --------------- | ------------------------------------------ |
| `SceneManager`  | controls the active scene and tree systems |
| `AssetsManager` | loads files and assets                     |
| `SaveManager`   | coordinates save and load operations       |

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

Once registered, managers become globally accessible through `manager()`.

---

# Creating Custom Managers

Applications can define their own managers for shared services.

Common examples include:

* quest tracking
* localization
* analytics
* gameplay registries
* global game state

A custom manager should represent a **global service**, not gameplay structure.

---

# Example Custom Manager

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

# When to Use a Manager

Create a manager when a system must:

* outlive individual scenes
* be shared across multiple systems
* exist independently from the scene tree
* behave as a service rather than gameplay structure

Good examples include:

* save systems
* localization
* global configuration
* content registries

---

# When Not to Use a Manager

Managers should **not** be used for scene-specific gameplay logic.

Avoid managers for systems such as:

* player movement
* enemy AI
* level-specific gameplay rules
* UI component behavior

These are better implemented as:

* **nodes**
* **behaviors**
* **tree systems**
* **contexts**

---

# Design Guidelines

Good managers should be:

* **focused**
* **globally relevant**
* **independent of scene structure**
* **easy to reason about**

Avoid turning managers into large **“god objects”** that control unrelated systems.

A useful guideline is:

> A manager should provide one clear global service.

---

# Summary

Managers provide **application-level services** used throughout the engine.

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

They coordinate global functionality while the **scene tree handles gameplay structure**.

---

# Related Topics

* **Nodes** — entities and scene structure
* **Behaviors** — modular logic attached to nodes
* **Tree Systems** — global scene processing
* **Scene Manager** — controlling the active scene
* **Data Systems** — loading and managing game content
