<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Behaviors

A **behavior** is the set of rules you give a node. It can move a character,
respond to a key or change a value as time passes. The node is the thing; the
behavior is what it does.

> [!IMPORTANT]
> Each node has **one behavior slot**. Attaching another behavior replaces the
> previous one; compose related logic within that behavior.

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

# Working with the Current API

`Behavior<N>` supplies logic for a node. Each node has one behavior slot;
attaching another replaces it rather than adding a list of behaviors.

```kotlin
import io.canopy.engine.core.nodes.behavior
import io.canopy.engine.core.nodes.types.empty.EmptyNode2D
import io.canopy.engine.math.Vector2

val mover = EmptyNode2D("Mover") {
    behavior(
        onReady = { position = Vector2.Zero },
        onUpdate = { delta -> position = position + Vector2(delta, 0f) },
    )
}
```

In the example, `onReady` chooses the starting position. `onUpdate` runs as the
game updates. `delta` is the number of seconds since the previous frame; adding
it to the horizontal position moves the node at one unit per second. The node
does not draw a character by itself; this example demonstrates a changing position.

Each named function is a **callback**: code the engine calls at the right moment.
`onReady` is useful for setup; `onUpdate` is useful for work that repeats.

### Callback reference

The lambda helper accepts `onEnterTree`, `onReady`, `onExitTree`, `onUpdate`,
`onPhysicsUpdate`, and `onInput`. Lambdas use the concrete node as receiver;
delta is in seconds. Physics callbacks are fixed-step lifecycle dispatch, not
an automatic collision engine.

Frame, physics and input callbacks obey their node's `processMode`; the default
inherited mode pauses with the application. `Always` and `WhenPaused` callbacks
receive real elapsed seconds while paused. Entry, ready and exit are unaffected.
See [pause-aware nodes](nodes.md#pause-aware-processing) for subtree overrides.

For reuse, subclass `Behavior<MyNode>(node)` and install it with
`node.attachBehavior { MyBehavior(it) }` or `node += { MyBehavior(it) }`.
The protected `node` reference is nullable in the base class.

Replacing a behavior on an entered node exits the old behavior and enters the
new one. Replacement does not automatically invoke `onReady()`.
Connections and effects created in managed behavior callbacks automatically
belong to the node and clean up on exit. Create resources in `onEnterTree` when
they must be recreated after reusable detachment or scene-manager re-entry.
Use explicit owners outside managed callbacks. See
[events and signals](../flows/events-and-signals.md) for lifetime rules.


---

## Typed dependencies

Behaviors use the same [typed query factories](nodes.md#typed-dependency-queries)
as nodes. Node queries resolve against the node supplied to the behavior constructor;
global manager queries resolve independently of that node:

```kotlin
import io.canopy.engine.core.nodes.Behavior
import io.canopy.engine.core.nodes.attachBehavior
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.engine.core.queries.childOrNull

class Controller(node: EmptyNode) : Behavior<EmptyNode>(node) {
    val target by childOrNull<EmptyNode>()

    override fun onReady() {
        target?.addGroup("targets")
    }
}

val actor = EmptyNode("Actor")
actor.attachBehavior { Controller(it) }
```

A behavior constructed without a node has no node-query owner: optional node dependencies
return null, required dependencies throw `NoSuchElementException`, and group
queries return an empty list. Attaching a behavior does not replace its
constructor-supplied node. Reads against a destroyed node throw
`NodeDestroyedException` for node dependencies. Global manager delegates work without a
node and also through a destroyed owner. All query reads are confined to the game thread.
See [dependency lookups](../dependencies.md) for explicit imports and required/nullable access.

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

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
