<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Contexts

Contexts allow nodes to **share data across a subtree** without relying on global managers or manually passing dependencies 
through the node hierarchy.

They provide **scoped dependency sharing**, making systems easier to reuse and compose.

> [!NOTE]
> Contexts are conceptually similar to **[React Contexts](https://react.dev/learn/passing-data-deeply-with-context)**.

> [!WARNING]
> Contexts are still under development and may evolve in future versions.

---

# Quick Example

```kotlin
enum class GameKey(override val key: String) : ContextKey {
    DIFFICULTY("difficulty")
}

Context {
    provide(GameKey.DIFFICULTY) { "hard" }
}

val difficulty = fromContext<String>(GameKey.DIFFICULTY)
```

Main API:

| Function                 | Description                               |
| ------------------------ | ----------------------------------------- |
| `provide(key) { value }` | registers a value in the current context  |
| `fromContext(key)`       | resolves a value from the nearest context |
| `fromContextOrNull(key)` | nullable version of `fromContext`         |

---

# Why Contexts Exist

Many systems require access to shared data defined higher in the scene tree.

Without contexts, developers typically rely on one of two patterns.

---

## Global Managers

A common approach is to create singleton managers:

```
GameStateManager
```

While convenient, this introduces several problems:

* everything can access the manager
* lifetime becomes global
* systems become tightly coupled
* scenes become harder to reuse

---

## Prop Drilling

Another approach is manually passing data through the node hierarchy.

[prop-drilling](markdown/manuals/concepts/core/assets/context-img1.png)

Each node forwards the data to the next node.

This leads to:

* boilerplate code
* tight coupling
* fragile hierarchies

---

Contexts solve these issues by providing **scoped dependency sharing**.

---

# Mental Model

Contexts behave like **value providers attached to the node tree**.

[context](markdown/manuals/concepts/core/assets/context-img2.png)

Example:

```
Root
 └ Context (difficulty = normal)
      ├ Enemy
      └ Context (difficulty = hard)
           └ Boss
```

Resolving `difficulty`:

| Node  | Value      |
| ----- | ---------- |
| Enemy | `"normal"` |
| Boss  | `"hard"`   |

Context resolution always returns the **closest provider in the node tree**.

---

# Context Keys

Contexts use **keys** to identify provided values.

Although raw strings are supported, it is recommended to use **typed keys implementing `ContextKey`**.

```kotlin
interface ContextKey {
    val key: String
}
```

A common pattern is defining keys using enums.

```kotlin
enum class SimulationKey(override val key: String) : ContextKey {
    WEATHER("weather"),
    TIME("time"),
    DIFFICULTY("difficulty")
}
```

Benefits of typed keys:

* compile-time safety
* refactor safety
* clearer intent
* avoidance of string typos

---

## Raw String Keys

Contexts also accept raw strings:

```kotlin
provide("weather") { weather }

val weather = fromContext<String>("weather")
```

This can be convenient for quick experiments but is **not recommended for larger systems**.

---

# Creating a Context

To create a context, use the `Context` node.

Inside it, call `provide()` to expose values to the subtree.

```kotlin
Context {

    provide(SimulationKey.WEATHER) { weather }

    EmptyNode("inside-context")

}
```

Nodes inside this subtree can resolve the provided value.

> [!NOTE]
> `provide()` uses a lambda so the context captures the **reference to the data**, not a snapshot.
> This ensures `fromContext()` always returns the latest value.

---

# Accessing Context Data

Nodes retrieve values using `fromContext()`.

```kotlin
val weather = fromContext<String>(SimulationKey.WEATHER)
```

`fromContext()` searches **up the node tree** until it finds a matching provider.

If no value is found, an exception is thrown.

---

## Nullable Lookup

Use `fromContextOrNull()` if the value may not exist.

```kotlin
val weather = fromContextOrNull<String>(SimulationKey.WEATHER)
```

---

# Context Nesting

Contexts can be **nested**, allowing different branches of the tree to access different data.

```kotlin
enum class ExampleKey(override val key: String) : ContextKey {
    DATA("data"),
    OTHER_DATA("otherData")
}

Context {

    provide(ExampleKey.DATA) { "data" }

    Node("receives-data")

    Context {

        provide(ExampleKey.OTHER_DATA) { "other data" }

        Node("nested-node")

    }

}
```

Result:

* `receives-data` resolves `DATA`
* `nested-node` resolves both `DATA` and `OTHER_DATA`

---

# Context Shadowing

When contexts are nested, a child context can **override values provided by a parent context**.

This behavior is called **context shadowing**.

Example:

```kotlin
enum class GameKey(override val key: String) : ContextKey {
    DIFFICULTY("difficulty")
}

EmptyNode("root") {

    Context {
        provide(GameKey.DIFFICULTY) { "normal" }

        Context {
            provide(GameKey.DIFFICULTY) { "hard" }

            EmptyNode("enemy")
        }
    }

}
```

Inside `enemy`:

```kotlin
val difficulty = fromContext<String>(GameKey.DIFFICULTY)
```

Result:

```
"hard"
```

The **closest context provider takes precedence**.

---

# Common Patterns

Contexts are commonly used for **localized configuration and services**.

---

## Simulation Context

```kotlin
enum class SimulationKey(override val key: String) : ContextKey {
    WEATHER("weather"),
    TIME("time")
}

Context {
    provide(SimulationKey.WEATHER) { weather }
    provide(SimulationKey.TIME) { simulationTime }
}
```

---

## UI Theme Context

```kotlin
enum class UIKey(override val key: String) : ContextKey {
    THEME("theme")
}

Context {
    provide(UIKey.THEME) { Theme.Dark }
}
```

---

## Service Injection

Contexts can also provide lightweight services.

```kotlin
enum class ServiceKey(override val key: String) : ContextKey {
    EVENT_BUS("eventBus")
}

Context {
    provide(ServiceKey.EVENT_BUS) { eventBus }
}
```

This allows **dependency injection scoped to a subtree**.

---

# Contexts vs Managers

| Use Contexts When             | Use Managers When                |
| ----------------------------- | -------------------------------- |
| data belongs to a subtree     | data is global                   |
| lifetime is temporary         | lifetime spans the entire game   |
| systems should be decoupled   | systems are core engine services |
| scenes should remain reusable | global access is expected        |

Examples:

**Contexts**

* simulation state
* level configuration
* UI themes
* local services

**Managers**

* asset manager
* scene manager
* audio manager
* input manager

---

# Best Practices

### Prefer typed keys

Use enums implementing `ContextKey` instead of raw strings.

### Keep contexts focused

Contexts should represent clear logical scopes such as:

* simulation
* UI layer
* level
* gameplay system

### Prefer structured values

Instead of many keys:

```
provide(WORLD)
provide(TIME)
provide(WEATHER)
```

Prefer grouping related data:

```
provide(SIMULATION_STATE)
```

### Shadow intentionally

Avoid accidental overrides by using clear keys.

---

# Summary

Contexts allow nodes to:

* share data across a subtree
* avoid global state
* reduce coupling between systems
* improve scene modularity

They enable **cleaner and more scalable architectures**, especially in complex scene trees.
