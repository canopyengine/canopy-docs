# TOML

```kotlin
import io.canopy.engine.data.parsers.Toml
import kotlinx.serialization.Serializable

@Serializable
data class SimulationConfig(val rabbits: Int = 5, val foxes: Int = 2)

val config = Toml.fromString<SimulationConfig>("rabbits = 7\nfoxes = 3")
val encoded = Toml.toString(config)
```

The wrapper uses tomlkt and kotlinx.serialization. Defaults are
`classDiscriminator = "type"`, `ignoreUnknownKeys = true`, and
`explicitNulls = false`. An optional SerializersModule and the final config
lambda customize the codec. Decoding and encoding errors propagate.

`fromFile<T>(entry)` reads an AssetEntry; `toFile(value, writableEntry)` overwrites
a WritableAssetEntry. `buildToml(module, config)` creates a configured codec.
TOML is useful for configuration; it is not the SaveManager file format, which
is JSON. See [assets](assets-and-resources.md) and [serialization](parsing-and-serialization.md).
