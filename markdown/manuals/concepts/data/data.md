# Data systems

Canopy 0.1.0-dev2 includes data APIs in the `:engine` module:

| Package | API |
| --- | --- |
| `io.canopy.engine.data.assets` | AssetEntry, WritableAssetEntry, AssetsManager, FileSource |
| `io.canopy.engine.data.parsers` | Json and Toml helpers |
| `io.canopy.engine.data.registry` | IdRegistry |
| `io.canopy.engine.data.core.registry` | IdEntry (current package exception) |
| `io.canopy.engine.data.saving` | SaveManager, SaveModule, registerSaveModule |

Assets are backend-specific file handles. Parsers convert text into serializable
Kotlin values. Registries resolve stable IDs; saves coordinate independent JSON
payloads. These are synchronous utilities, not a background streaming or hot
reload pipeline.

- [Assets](assets-and-resources.md)
- [Serialization](parsing-and-serialization.md)
- [JSON](json.md) and [TOML](toml.md)
- [ID registries](id-registry.md)
- [Saving](saving-and-loading.md)
- [Content pipeline](content-pipeline.md)
