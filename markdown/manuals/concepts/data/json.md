# JSON

```kotlin
import io.canopy.engine.data.parsers.Json
import kotlinx.serialization.Serializable

@Serializable
data class PlayerData(val health: Int = 100)

val data = Json.fromString<PlayerData>("""{"health":80}""")
val encoded = Json.toString(data)
```

The wrapper defaults to `classDiscriminator = "type"`, `ignoreUnknownKeys = true`
and pretty printing with a two-space indent. Pass a configuration lambda to
override them, for example `Json.fromString<PlayerData>(text) { ignoreUnknownKeys = false }`.
Use `Json` from Canopy's parser package rather than accidentally importing the
kotlinx.serialization `Json` class with the same name.

`fromFile<T>(entry)` reads a backend-neutral AssetEntry. `toFile(data, entry)`
requires a WritableAssetEntry and overwrites it. `rawParseFile(entry)` expects
an object root and returns a JsonObject. `encodeJsonElement` and
`decodeJsonElement` accept explicit serializers; they use the library Json
singleton rather than the configurable `buildJson` codec.

Serialization errors propagate. Unknown fields being ignored does not validate
health ranges or other application rules. See [serialization](parsing-and-serialization.md).
