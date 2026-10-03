<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# TOML

**TOML** keeps configuration approachable: a few named settings can describe a
world's initial population or the rules of a simulation. Canopy's `Toml` helper
uses Kotlin serialization so those settings arrive as typed values.

---

# Working with the Current API

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


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
