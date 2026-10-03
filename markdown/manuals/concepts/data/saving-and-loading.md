# Saving and loading

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
Module IDs must be unique per destination; the caller must enforce this.

`save("profile", slot = 0)` writes a JSON object keyed by module IDs.
`load("profile", slot = 0)` decodes available keys, records their payloads and
invokes module callbacks. Missing destinations, empty registries and missing
save files currently return without error; parse/write/callback errors propagate.
Missing module keys are skipped. There is no transactional rollback, atomic file
replacement, automatic schema migration or encryption.

`saveAll(slot)` and `loadAll(slot)` process every destination. `loadData(destination,
PlayerSave::class)` returns the first loaded payload of the exact class or fails.
It is not keyed by module ID; multiple modules with the same payload class can
be ambiguous. `cleanModules(destination)` discards registrations and cached data.

Use [assets](assets-and-resources.md) for entry contracts and
[JSON](json.md) for serialization. Save data values and stable content IDs;
resolve IDs explicitly through your registry after loading.
