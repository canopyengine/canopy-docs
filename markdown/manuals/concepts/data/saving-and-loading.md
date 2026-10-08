<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Saving and loading

Saving lets a player return to their progress, a simulation resume its state,
or settings survive the next launch. Canopy's **SaveManager** coordinates small
**Save Modules**, each responsible for one piece of persisted data.

---

# Mental Model

The save system coordinates multiple independent save modules.

```text
SaveManager
     │
     ├─ PlayerStatsModule
     ├─ InventoryModule
     └─ WorldStateModule
```

Each module handles:

* producing its save data
* applying loaded data back into the game

📌 **Diagram — Save Architecture**

<!-- DIAGRAM: save-system-modules -->


---

# Working with the Current API

Import `SaveManager`, `SaveModule`, and `registerSaveModule` from
`io.canopy.engine.data.saving`. Register SaveManager before registering modules.

SaveManager accepts destination names paired with `(slot: Int) -> WritableAssetEntry`
resolver functions. Provide backend-specific writable entries for each slot;
generic AssetEntry has no `child()` method. Classpath resources are not writable saves.

```kotlin
import io.canopy.engine.data.saving.registerSaveModule
import kotlinx.serialization.Serializable

@Serializable
data class PlayerSave(val health: Int)

var health = 100

fun registerPlayerSave() {
    registerSaveModule<PlayerSave>(
        destination = "profile",
        id = "player.stats",
        onSave = { PlayerSave(health) },
        onLoad = { health = it.health },
    )
}
```

Each module has a stable ID, serializer, onSave and onLoad functions. The reified
helper finds the serializer; an overload accepts `serializer = PlayerSave.serializer()`.
Module IDs must be unique per destination; registration rejects duplicates.

`save("profile", slot = 0)` writes a JSON object keyed by module IDs.
`load("profile", slot = 0)` decodes available keys, records their payloads and
invokes module callbacks. Missing destinations, empty registries and missing
save files currently return without error; parse/write/callback errors propagate.
Missing files and module keys preserve previously loaded payloads. There is no transactional rollback, atomic file
replacement, automatic schema migration or encryption.

`saveAll(slot)` and `loadAll(slot)` process every destination. `loadData(destination,
PlayerSave::class)` returns the first loaded payload of the exact class or fails.
Registration order selects among multiple loaded payloads of the same class; lookup does not use module IDs.
Unloaded modules have no payload: even `Unit` data becomes available only after a successful decode.
Saving alone does not populate this loaded-data cache. `cleanModules(destination)` discards registrations and cached data.

Module IDs must be stable and unique within each destination. Registration rejects a distinct module with an existing
ID with `IllegalArgumentException`; the same ID is allowed in another destination. Applications that previously relied
on duplicate IDs must assign unique IDs or remove existing registrations with `cleanModules` before rebuilding them.
Re-registering the same or equal module resets its loaded-data cache while retaining the original module callbacks.

Use [assets](assets-and-resources.md) for entry contracts and
[JSON](json.md) for serialization. Save data values and stable content IDs;
resolve IDs explicitly through your registry after loading.


---

# Best Practices

### Split data into modules

Avoid storing everything in a single save structure.

Modules keep save logic independent.

---

### Use stable module IDs

Module IDs must remain stable so older save files remain compatible.

---

### Save data, not engine objects

Persist structured data instead of runtime objects.

---

### Keep modules focused

Each module should handle **one logical piece of state**.

Examples:

* `player.stats`
* `inventory`
* `quest.progress`
* `world.time`


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
