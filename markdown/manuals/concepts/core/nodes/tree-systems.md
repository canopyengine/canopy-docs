<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Tree systems

**Tree Systems** handle work that spans multiple nodes: movement rules,
simulation updates or application-defined processing across a scene.
A phase and priority decide when that work runs; node types decide what it can
process.

---

# Mental Model

Tree systems maintain registered matches from the scene tree and process those nodes during their update phase.

```text
Scene Tree
   │
   ├─ Player
   ├─ Enemy
   ├─ Projectile
   └─ Camera
        │
        ▼
Tree System
        │
        ▼
Processes matching nodes
```

📌 **Diagram — Tree System Processing**

<!-- DIAGRAM: tree-system-processing -->


The node names show possible application roles. The current example below uses
EmptyNode2D, which is available in the enabled engine.

---

# Working with the Current API

`TreeSystem` in `io.canopy.engine.core.nodes` processes matching scene nodes
within an update phase. Lower priority numbers run first.

```kotlin
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.core.nodes.TreeSystem
import io.canopy.engine.core.nodes.types.empty.EmptyNode2D
import io.canopy.engine.math.Vector2

class MoveSystem : TreeSystem(
    UpdatePhase.FramePost,
    0,
    EmptyNode2D::class,
) {
    override fun processNode(node: Node<*>, delta: Float) {
        val mover = node as? EmptyNode2D ?: return
        mover.position = mover.position + Vector2(delta, 0f)
    }
}
```

Phases are `FramePre`, `FramePost`, `PhysicsPre`, and `PhysicsPost`.
Systems can be registered before or after building a scene. SceneManager indexes registration by
assignable node types; TreeSystem's own acceptance check also recognizes direct
children with exact required types. This is not a general descendant/component
query, and an empty required-type list matches nothing.

Registration initializes the system before supplying existing scene nodes.
Removal releases matches before `onUnregister`; node registration is idempotent.

Hooks are `onRegister`, `onUnregister`, `onNodeAdded`, `onNodeRemoved`,
`beforeProcess`, `processNode`, and `afterProcess`. Tick order is before, matched
nodes, then after. Matching nodes are copied for processing, so callback removal
can still leave a node in the current tick's snapshot. Exceptions are logged and
re-thrown. Snapshots do not provide thread safety.

System registration/removal semantics are described in [SceneManager](scene-manager.md).


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
