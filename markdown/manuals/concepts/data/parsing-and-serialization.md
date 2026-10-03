# Parsing and serialization

Canopy's `Json` and `Toml` helpers are in `io.canopy.engine.data.parsers` and
use kotlinx.serialization. Apply the Kotlin serialization plugin matching your
Kotlin compiler and annotate payload types with `@Serializable`.

Both codecs expose `fromString<T>`, `fromFile<T>`, `toString(value)` and
`toFile(value, writableEntry)`. File decoding reads `AssetEntry.readText()`;
file encoding overwrites a WritableAssetEntry. Errors propagate to the caller.

The optional `SerializersModule` supplies custom or polymorphic serializers.
The final configuration lambda overrides Canopy defaults. Explicitly validate
game-specific constraints after decoding; the parsers do not implement content
schemas or migrations for you.

See [JSON defaults and examples](json.md), [TOML defaults and examples](toml.md),
[assets](assets-and-resources.md), and [modular saves](saving-and-loading.md).
