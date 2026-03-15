<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Events and Signals

Canopy provides a **reactive programming system** through **Events** and **Signals**.

These tools allow systems to **react to changes without tight coupling**.

Instead of constantly checking values (polling), systems can **subscribe to changes and respond automatically**.

Reactive systems help create:

* cleaner architectures
* less boilerplate
* better separation of concerns
* more responsive systems

---

# Quick Example

### Event

```kotlin
val playerDied = event()

playerDied.connect {
    println("Player died")
}

playerDied.emit()
```

---

### Signal

```kotlin
val gold = signal(0)

gold.connect {
    println("Gold updated: $it")
}

gold.value = 10
```

---

# Rule of Thumb

**Events represent things that happen.
Signals represent values that change.**

Examples:

| Situation      | Use    |
| -------------- | ------ |
| Player died    | Event  |
| Enemy spawned  | Event  |
| Item picked up | Event  |
| Player health  | Signal |
| Gold amount    | Signal |
| Score          | Signal |

---

# Why Reactive Systems Matter

Without events or signals, systems often rely on **polling**.

Example:

```kotlin
while(true) {
    updateGoldUI(Inventory.gold)
}
```

Problems with polling:

* unnecessary CPU usage
* duplicated logic
* complex update loops
* harder maintenance

Reactive systems instead **react only when something changes**.

[event](markdown/manuals/concepts/core/assets/signals-img2.png)

---

# Events

Events implement the **Observer Pattern**.

| Role       | Description        |
| ---------- | ------------------ |
| Publisher  | emits events       |
| Subscriber | listens for events |

When an event is emitted, all subscribers are notified.

---

[event emit](markdown/manuals/concepts/core/assets/signals-img1.png)

---

# Mental Model (Events)

Events represent **momentary actions**.

```
Enemy dies
     │
     ▼
enemyDied.emit()
     │
     ▼
Subscribers react
```

Events **do not store state**.

They simply notify listeners that something happened.

---

# Creating and Using Events

### Create an event

Events define the callback signature.

```kotlin
val noArgEvent = event()
// () -> Unit

val oneArgEvent: OneArgEvent<Int> = event()
// (Int) -> Unit

val twoArgsEvent = event<Int, Int>()
// (Int, Int) -> Unit
```

---

### Subscribe to an event

```kotlin
noArgEvent.connect {
    println("Event triggered")
}
```

Operator syntax is also supported:

```kotlin
noArgEvent connect {
    println("Lambda subscriber")
}
```

---

### Emit an event

```kotlin
noArgEvent.emit()

oneArgEvent.emit(5)

twoArgsEvent.emit(3, 5)
```

All subscribers receive the event immediately.

---

# Signals

Signals are a **specialized form of events that also store state**.

A signal represents **a value that notifies subscribers when it changes**.

Signals are conceptually similar to reactive signals used in frameworks like:

* Angular
* Preact
* SolidJS

---

# Mental Model (Signals)

Signals combine **state and change notification**.

```
gold.value = 10
       │
       ▼
Signal updates value
       │
       ▼
Subscribers react
```

Signals automatically notify listeners when the value changes.

---

# Using Signals

### Create a signal

Signals require an initial value.

```kotlin
val gold = signal(0)
```

Alternative syntax:

```kotlin
val gold = 0.asSignal()
```

---

### Subscribe to a signal

```kotlin
gold.connect { value ->
    println("Gold updated: $value")
}
```

---

### Update the value

```kotlin
gold.value = 10
```

When the value changes:

* the signal updates its internal state
* all subscribers are notified automatically

No manual emission is required.

---

# Reading Signal Values

The current value of a signal can be read using `.value`.

```kotlin
println("Gold: ${gold.value}")
```

---

# Updating with `.update`

For derived calculations:

```kotlin
hpPercentage.update {
    if (hp.value >= 0) hp.value / 100 else 0
}
```

---

# Events vs Signals

Events represent **actions**.

```
buttonClicked.emit()
```

Signals represent **state over time**.

```
health.value = 80
```

| Events             | Signals                 |
| ------------------ | ----------------------- |
| No stored value    | Stores current value    |
| Triggered manually | Triggered automatically |
| Represents actions | Represents state        |

---

# Signals and Kotlin Flows

Signals can integrate with Kotlin **Flows**.

```kotlin
gold.flow.collect {
    println("Value: $it")
}
```

This allows signals to work naturally with **coroutines and reactive pipelines**.

---

# Disconnecting Subscribers

Subscribers can disconnect from events or signals.

```kotlin
val connection = gold.connect(callback)

connection.disconnect()
```

Canopy can automatically clean up connections when nodes leave the tree.

This prevents:

* memory leaks
* callbacks to destroyed nodes
* dangling references

---

# When to Use Each

### Use events when something happens

Examples:

* player died
* enemy spawned
* level completed
* item picked up

---

### Use signals for changing state

Examples:

* player health
* gold amount
* score
* simulation time

---

# Best Practices

### Prefer signals for state

Signals prevent synchronization issues between variables and events.

---

### Use events for discrete actions

Events represent **something that happened**, not ongoing state.

---

### Avoid polling

Reactive systems should respond to events rather than constantly checking values.

---

# Event/Signals API Cheat Sheet

| Concept        | Example                                       |
| -------------- | --------------------------------------------- |
| Event          | `val enemySpawned = event<Enemy>()`           |
| Emit           | `enemySpawned.emit(enemy)`                    |
| Signal         | `val gold = signal(0)`                        |
| Update         | `gold.value = 10`                             |
| Subscribe      | `gold.connect { }`                            |

---

# Summary

Events and Signals enable **reactive programming** in Canopy.

They allow systems to:

* communicate without tight coupling
* react automatically to changes
* eliminate polling logic
* build scalable architectures

**Events represent actions.
Signals represent state.**

Together they form the foundation for building **responsive and maintainable game systems**.
