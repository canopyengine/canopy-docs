<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# ID registries

An **ID Registry** gives authored content a stable name. Your inventory can
refer to `game:sword` without putting the entire sword definition into every
save file or every object that uses it.

---

# Mental Model

An ID registry acts like a **lookup table**.

```text
ID
 │
 ▼
Registry
 │
 ▼
Runtime Object
```

📌 **Diagram — Registry Lookup**

<!-- DIAGRAM: id-registry-lookup -->

Example:

```text
item:sword
enemy:goblin
biome:desert
```

Each identifier maps to a specific data object.


---

# Working with the Current API

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


---

# Best Practices

### Use stable identifiers

Identifiers should not change once content is released.

---

### Avoid hardcoded references

Systems should use registry lookups rather than direct object references.

---

### Use namespaces

Namespacing helps prevent identifier collisions in large projects.

---

### Keep registries focused

Create separate registries for different types of content.

Example:

```
ItemRegistry
EnemyRegistry
BiomeRegistry
```


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
