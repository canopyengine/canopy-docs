<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Behaviors

Behaviors let you attach **custom logic to your nodes**. A controller can react
to input, move a character or update a simulation value while the node keeps
its place in the scene hierarchy.

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
