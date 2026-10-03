# ID registries

`IdRegistry` is in `io.canopy.engine.data.registry`. The current `IdEntry`
interface retains the package `io.canopy.engine.data.core.registry`.

```kotlin
import io.canopy.engine.data.core.registry.IdEntry
import io.canopy.engine.data.registry.IdRegistry
import kotlinx.serialization.Serializable

@Serializable
data class Item(
    override val domain: String,
    override val name: String,
    val damage: Int,
) : IdEntry

val items = IdRegistry<Item>()
items.loadRegistry(listOf(Item("game", "sword", 10)))
val sword = items.map["game:sword"]
val selection = items.mapIds<Item>(listOf("game:sword"))
```

IdEntry derives `id` as `domain:name`; the registry keys its mutable `map` with
that string. There is no registry bracket operator; use `registry.map[id]`.
`nEntries()` counts entries and `addItemsToRegistry(list)` rejects duplicate IDs.
An error partway through a list can leave earlier entries inserted.

An optional AssetEntry source must exist. `loadRegistry<T>()` without explicit
items recursively collects `.json` files if the source is a directory; each file
must decode to a **list** of entries. It does not accept one object per file.

`mapIds<T>(ids, updateHandler)` resolves entries or throws for missing/wrong-type
IDs, then applies the handler to the stored instances. It returns references,
not clones; modifying them can change registry content. Namespacing is a
convention; the interface does not validate domain/name strings.
