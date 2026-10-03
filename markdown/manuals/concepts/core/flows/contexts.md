# Contexts

`Context`, `ContextKey`, `fromContext`, `fromContextOrNull`, `lazyFromContext`,
and nullable lazy variants are in `io.canopy.engine.core.flows`.
Context is a transparent node providing values to its subtree.

```kotlin
import io.canopy.engine.core.flows.Context
import io.canopy.engine.core.flows.fromContext
import io.canopy.engine.core.nodes.behavior
import io.canopy.engine.core.nodes.types.empty.EmptyNode

val root = EmptyNode("Root") {
    Context {
        provide("difficulty") { 3 }
        EmptyNode("Game") {
            behavior(onReady = {
                val difficulty = fromContext<Int>("difficulty")
                check(difficulty == 3)
            })
        }
    }
}
```

Construction attaches contexts and children through the active node DSL.
Lookup starts at the receiving node and walks parents. The closest provider key
wins. Providers run on lookup; values are not automatically memoized or reactive.
Lazy variants cache the first resolved result through Kotlin `lazy`.

`fromContextOrNull` returns null for a missing key. `fromContext` throws
`NoSuchElementException` for missing/null results. An existing null-returning
provider does not fall through to an outer provider. A wrong requested type can
cause a cast error: raw string keys are not runtime type checking.

Prefer an enum implementing `ContextKey` with `override val key: String` for
shared keys. Context nodes have generated names and are skipped during node path
search. Context is distinct from [global managers](../managers/managers.md);
its values belong to a subtree. Access contexts on the lifecycle thread.
