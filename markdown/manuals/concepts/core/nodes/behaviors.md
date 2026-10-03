# Behaviors

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

For reuse, subclass `Behavior<MyNode>(node)` and install it with
`node.attachBehavior { MyBehavior(it) }` or `node += { MyBehavior(it) }`.
The protected `node` reference is nullable in the base class.

Replacing a behavior on an entered node exits the old behavior and enters the
new one. Replacement does not automatically invoke `onReady()`.
Retain event callbacks/effects as owned fields and disconnect/dispose them during
exit. See [events and signals](../flows/events-and-signals.md) for lifetime rules.
