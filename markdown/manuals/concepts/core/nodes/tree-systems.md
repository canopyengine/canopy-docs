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
Systems can be registered before or after building a scene. A node matches when
its own type is assignable to at least one required type, including subclasses.
The same rule applies to direct `system.register(node)` calls and SceneManager
registration/backfilling. Matching multiple required types registers a node only
once; an empty required-type list matches nothing.

A matching child never qualifies a nonmatching parent. Adding or removing children
does not change the parent's eligibility; matching children participate as their
own nodes when registered in the scene.

**Migration:** direct registration previously accepted some nonmatching parents
because they contained a child with an exact required type. Register the matching
child instead, or require the parent's own type explicitly if the system is meant
to process parents.

Registration initializes the system before supplying existing scene nodes.
Removal releases matches before `onUnregister`; node registration is idempotent.
Matches also register generic node-removal cleanup, including nodes registered
directly through `system.register(node)`. Explicit unregistration releases this
lifetime registration. Destroyed nodes are rejected by public registration and unregistration. Permanent
destruction invalidates gameplay state before removal hooks run. Use immutable
`node.exitMetadata` or previously registered cleanup actions during destruction;
reading gameplay properties or context then throws `NodeDestroyedException`.
Reusable detachment keeps nodes valid.

Hooks are `onRegister`, `onUnregister`, `onNodeAdded`, `onNodeRemoved`,
`beforeProcess`, `processNode`, and `afterProcess`. Tick order is before, matched
nodes, then after. Matching snapshots are cached until membership changes. Each dispatch checks
membership and validity, so nodes removed earlier in a tick are skipped; new
matches start on the next snapshot. Exceptions retain engine diagnostics and their
original causes. Snapshots do not provide thread safety.

`processNode` checks each matched node's `canProcess()` immediately before
invocation. Inactive nodes remain registered, so resuming needs no registration
changes. Each match uses its own node's processing mode.

`beforeProcess` and `afterProcess` continue in **all four phases**, including
physics phases during pause, with real deltas. These system-wide hooks support
input delivery, rendering and work for eligible nodes; pause is a node processing
policy, not a system lifecycle transition. Hooks that update gameplay directly
must check `SceneManager.isPaused`, or apply `canProcess()` when iterating
`matchingNodes` themselves. Rendering can intentionally keep inactive nodes
visible. Match snapshots do not filter the retained `matchingNodes` list.

System registration/removal semantics are described in [SceneManager](scene-manager.md).


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
