<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Parsing and serialization

**Parsing** turns authored text into data your game can use. **Serialization**
turns values back into a format that can be stored or exchanged. Together they
connect human-editable files to the Kotlin objects that drive your application.

---

# Mental Model

Data conversion works in both directions.

```text
Structured Data
      │
      ▼
Parser / Serializer
      │
      ▼
Kotlin Object
```

📌 **Diagram — Data Conversion Pipeline**

<!-- DIAGRAM: data-conversion-pipeline -->

Example flow:

```
JSON File → Parser → Kotlin Object
Kotlin Object → Serializer → JSON File
```


---

# Working with the Current API

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


---

# Best Practices

### Keep data separate from code

Store gameplay parameters in structured files rather than hardcoding them.

---

### Use serializable data classes

Mapping files to data classes makes systems easier to maintain.

---

### Prefer stable identifiers

Use identifiers (IDs) to reference content rather than direct object references.

---

### Choose the right format

Use TOML for configuration and JSON for structured datasets.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
