<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Dependency lookups

Declare a dependency when a property should find its value when read. Global lookups use the application's registry;
node lookups use the declaring node's hierarchy. Both resolve again on every read on the engine thread.

## Global managers anywhere

This complete example distinguishes immediate helpers from property delegates with import aliases:

```kotlin
import io.canopy.engine.core.managers.Manager
import io.canopy.engine.core.managers.ManagersRegistry
import io.canopy.engine.core.managers.manager as getManager
import io.canopy.engine.core.managers.managerOrNull as getManagerOrNull
import io.canopy.engine.core.queries.manager
import io.canopy.engine.core.queries.managerOrNull

interface Scores : Manager {
    val total: Int
}

class GameScores : Scores {
    override val total = 10
}

class ScoreDisplay {
    val scores by manager<Scores>()
    val optionalScores by managerOrNull<Scores>()
}

fun lookupExample() {
    val display = ScoreDisplay()
    check(getManagerOrNull<Scores>() == null)
    check(display.optionalScores == null)
    ManagersRegistry.register(GameScores())
    check(display.scores.total == 10)
    check(getManager<Scores>() === display.scores)
    ManagersRegistry.unregister(Scores::class)
    check(display.optionalScores == null)
}
```

Run the function in an isolated registry on the engine thread. In a running application, register custom managers in
its manager configuration rather than resetting the global registry. Delegates also work in objects, top-level/local
properties, nodes and behaviors without a node. They remain usable through a destroyed node facade because the lookup
reads global services, not node state.

| API and import | Result |
| --- | --- |
| `core.managers.manager<T>()` | Immediate current service; absence throws IllegalStateException |
| `core.managers.managerOrNull<T>()` | Immediate current service, or null for absence |
| `ManagersRegistry.getManager(T::class)` | Explicit-class required lookup |
| `ManagersRegistry.getManagerOrNull(T::class)` | Explicit-class nullable lookup |
| `core.queries.manager<T>()` | Global property delegate; required absence throws NoSuchElementException |
| `core.queries.managerOrNull<T>()` | Global property delegate; missing registration reads as null |
| `core.managers.lazyManager<T>()` | Lazy value caching the first successful lookup |

Both immediate and delegated manager queries accept concrete types and compatible manager interfaces. Ambiguous
lookups throw even when optional. Optional access never suppresses failures. A nullable delegate can return null now
and a service after registration; it does not permanently cache the missing result. A lazy manager does cache a
successful result and will not follow later replacement.

## Node and context dependencies

```kotlin
import io.canopy.engine.core.flows.Context
import io.canopy.engine.core.managers.ManagersRegistry
import io.canopy.engine.core.managers.SceneManager
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.core.queries.ancestor
import io.canopy.engine.core.queries.childOrNull
import io.canopy.engine.core.queries.context
import io.canopy.engine.core.queries.contextOrNull
import io.canopy.engine.core.queries.group
import io.canopy.engine.core.queries.tree

class Rules(val difficulty: Int)

class Actor(name: String) : Node<Actor>(name) {
    val scope by ancestor<Context>()
    val attachment by childOrNull<Actor>()
    val firstActor by tree<Actor>()
    val allies by group<Actor>("allies")
    val rules by context<Rules>()
    val label by contextOrNull<String>("label")
}

fun nodeLookupExample() {
    val scenes = SceneManager()
    ManagersRegistry.register(scenes)
    val scope = Context("Level")
    scope.provide<Rules> { Rules(2) }
    scope.provide("label") { "forest" }
    val actor = Actor("Player")
    actor.addGroup("allies")
    scope.addChild(actor)
    check(actor.rules.difficulty == 2) // Context lookup works before entry.
    scenes.currScene = scope
    check(actor.firstActor === actor)
    check(actor.allies == listOf(actor))
    check(actor.label == "forest")
}
```

The example requires an isolated registry without an existing SceneManager; a running application supplies one already.
Behaviors use their constructor-supplied node for these queries. Ordinary objects cannot delegate a node query.

| Factory | Selection | Optional counterpart |
| --- | --- | --- |
| `ancestor<T>()` | Nearest matching actual ancestor, excluding owner | `ancestorOrNull<T>()` |
| `child<T>()` | First matching direct child in insertion order, through transparent wrappers | `childOrNull<T>()` |
| `tree<T>()` | First entered match in preorder from owner's hierarchy root, including root | `treeOrNull<T>()` |
| `group<T>(name)` | Fresh typed snapshot of entered group members in owner's manager | Empty list for absence |
| `context<T>()` | Nearest provider registered under exactly T | `contextOrNull<T>()` |
| `context<T>(key)` | Nearest string/ContextKey provider with compatible value | `contextOrNull<T>(key)` |

Node type matching includes subclasses. Typed context registration matches the exact declared type. Typed and keyed
providers are independent, and a nearest provider returning null still shadows outer scopes. Wrong keyed value types
and provider failures throw even for optional queries.

Read subtree-dependent properties after the required nodes exist, usually in onReady or later. A declaration itself
performs no lookup. Valid detached nodes can read hierarchy and context; tree reads have no match and groups are empty
until entry. Destroyed owners reject all node queries, including optional and group reads.

## Utilities outside a node

Use direct managers for application services, `inject<T>()` for an existing InjectionManager provider, and
`treeSystem<T>()` for an existing SceneManager system. Injection and system helpers are required lookups; they have no
new nullable variants in this change. None needs an implicit current node.

Resource acquisition has ownership rather than dependency semantics: use ResourceManager.acquire(key), retain its
AssetLease, and close it explicitly. Node asset delegates retain their automatic entry-resource ownership and cannot
be used on arbitrary objects. Command argument delegates already support ordinary command objects, but reads are
valid only during command execution.

## Types and migration

Dependency is now a sealed shared base without getValue. Manager factories return final GlobalDependency; hierarchy,
group and context factories return final NodeDependency. Keep the inferred type in `val value by factory<T>()`.
If helper functions return descriptors, declare the appropriate concrete return type so Kotlin can find its operator.
Recompile existing consumers: JVM factory return types changed. There is no automatic scene fallback for globals,
no lookup subscription, and no callable dependency descriptor API.

Continue with [Managers and injection](managers/managers.md), [Contexts](flows/contexts.md),
[Nodes](nodes/nodes.md), [Resources](../data/assets-and-resources.md), and
[Dependency design](../../../engine-details/dependencies.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
