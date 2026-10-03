# Tree systems

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
Register systems before building a scene. SceneManager indexes registration by
assignable node types; TreeSystem's own acceptance check also recognizes direct
children with exact required types. This is not a general descendant/component
query, and an empty required-type list matches nothing.

Hooks are `onRegister`, `onUnregister`, `onNodeAdded`, `onNodeRemoved`,
`beforeProcess`, `processNode`, and `afterProcess`. Tick order is before, matched
nodes, then after. Matching nodes are copied for processing, so callback removal
can still leave a node in the current tick's snapshot. Exceptions are logged and
re-thrown. Snapshots do not provide thread safety.

System registration/removal semantics are described in [SceneManager](scene-manager.md).
