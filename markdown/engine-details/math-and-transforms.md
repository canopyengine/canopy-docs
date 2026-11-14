<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Vectors and transforms

Vector2 has mutable x/y components and structural equality. Arithmetic, add and scl return vectors without changing
operands. Normalization returns a new value for nonzero length and the original vector for zero length.
Treat the shared Zero value as a constant; copy it before using it as independent mutable state.
There is no vector pooling.

Node2D stores local position, scale and rotation through nodeProperty, retaining the node lifetime guards. Rotation is
radians and position units are application-defined. Global vectors are defensive copies computed on read, not cached: position adds the
immediate Node2D parent's global position; scale multiplies component-wise; rotation adds parent rotation.

The current implementation does not rotate or scale a child's positional offset. A non-Node2D immediate parent ends
transform composition, including a Context wrapper. This is a simple hierarchy composition contract, not a full affine
matrix transform. Caching or expanding that behavior would require separate design and regressions.

Vector2Tests verifies arithmetic does not change its operands. Node tests cover guarded transform access and hierarchy behavior.
See [Vectors and transforms](../manuals/concepts/math/vectors-and-transforms.md) and
[Node state](nodes-and-scenes.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
