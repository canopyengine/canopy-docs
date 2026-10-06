<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Immutable vectors and transforms

Vector2 is an immutable value: x/y are val properties, equality is structural, and arithmetic returns values. Shared
Zero cannot be mutated. add, scl and nor return results callers must retain; normalization returns the original zero
vector when its length is zero. There is no mutable-vector pooling or hidden component update.

Node2D stores local position, scale and rotation through nodeProperty, retaining the node lifetime guards. Rotation is
radians and position units are application-defined. Global values are computed on read, not cached: position adds the
immediate Node2D parent's global position; scale multiplies component-wise; rotation adds parent rotation.

The current implementation does not rotate or scale a child's positional offset. A non-Node2D immediate parent ends
transform composition, including a Context wrapper. This is a simple hierarchy composition contract, not a full affine
matrix transform. Caching or expanding that behavior would require separate design and regressions.

Vector2Tests verifies value arithmetic and immutability. Node tests cover guarded transform access and hierarchy behavior.
See [Vectors and transforms](../manuals/concepts/math/vectors-and-transforms.md) and
[Node state](nodes-and-scenes.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
