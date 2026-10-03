# Data overview

Canopy 0.1.0-dev2 supplies synchronous file handles, JSON/TOML serialization,
ID registries and modular JSON saves. The full API overview is in
[data systems](data.md).

Use [assets](assets-and-resources.md) to access configuration, then
[parsers](parsing-and-serialization.md) to decode it. Provide values through
Context or managers. Keep persisted payloads separate from runtime nodes.
There is no YAML parser, automatic content importer, hot reload or supported
texture/audio loader in the enabled engine platforms.
