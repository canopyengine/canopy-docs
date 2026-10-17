<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Vectors and 2D transforms

Vector2 holds two mutable Float components. Arithmetic returns a vector without changing the operands.
Copy a vector when its components need to change independently of another owner; keep map keys unchanged after insertion.

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

fun moveRight(node: EmptyNode2D<*>, distance: Float) {
    node.position = node.position + Vector2(distance, 0f)
    node.position = node.position.copy(y = 8f)
}
```

Local components such as `node.position.x` can also be edited. Access to a node's transform property uses the same
destruction guards as other node properties; a previously obtained vector is an ordinary mutable value.
Treat the shared `Vector2.Zero` as a constant and copy it for independent mutable state.

GlobalPosition adds the immediate 2D parent's globalPosition, globalScale multiplies scales component-wise, and
globalRotation adds rotations. Global vectors are defensive copies, recomputed on read, so local changes and reparenting take effect immediately.
The current implementation does not rotate/scale a child's positional offset. A non-Node2D immediate parent, including a
Context wrapper, ends composition. Account for this when arranging hierarchy; do not assume full matrix transforms.

See [Nodes](../core/nodes/nodes.md), [Transform design](../../../engine-details/math-and-transforms.md) and
[Input vectors](../input/input.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
