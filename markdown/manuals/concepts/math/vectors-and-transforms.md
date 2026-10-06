<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Vectors and 2D transforms

Vector2 holds two immutable Float components. Arithmetic produces a value you can share safely, compare by components,
or use as a map key. Changing a position means assigning the returned vector.

```kotlin
import io.canopy.engine.math.Vector2

fun move(position: Vector2, velocity: Vector2, deltaSeconds: Float): Vector2 =
    position + velocity * deltaSeconds

fun unitDirection(direction: Vector2): Vector2 = direction.nor()
```

add(x, y), scl(scalar), scl(x, y), plus and times return vectors. len reports Euclidean length and nor normalizes a
nonzero vector; zero remains zero. An expression such as position.add(1f, 0f) has no lasting effect if you discard it.

## Node transforms

Node2D and EmptyNode2D store local position, scale and rotation. Rotation uses radians; position units are defined by your
application. Assign vectors or copy with changed components:

```kotlin
import io.canopy.engine.core.nodes.types.empty.EmptyNode2D
import io.canopy.engine.math.Vector2

fun moveRight(node: EmptyNode2D, distance: Float) {
    node.position = node.position + Vector2(distance, 0f)
    node.position = node.position.copy(y = 8f)
}
```

Do not assign node.position.x or node.scale.y. Transform state uses the same destruction guards as other node properties.

GlobalPosition adds the immediate 2D parent's globalPosition, globalScale multiplies scales component-wise, and
globalRotation adds rotations. Values are recomputed on read, so local changes and reparenting take effect immediately.
The current implementation does not rotate/scale a child's positional offset. A non-Node2D immediate parent, including a
Context wrapper, ends composition. Account for this when arranging hierarchy; do not assume full matrix transforms.

See [Nodes](../core/nodes/nodes.md), [Transform design](../../../engine-details/math-and-transforms.md) and
[Input vectors](../input/input.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
