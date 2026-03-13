<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Parsing and Serialization

Games frequently store configuration and content in **structured data files**.

Examples include:

* gameplay configuration
* enemy definitions
* item databases
* level metadata
* simulation parameters

Canopy provides utilities for converting between **structured data and Kotlin objects**.

Two operations are involved:

| Operation         | Description                                    |
| ----------------- | ---------------------------------------------- |
| **Parsing**       | converting structured data into Kotlin objects |
| **Serialization** | converting Kotlin objects into structured data |

Both operations are supported through the same parser utilities.

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

# Supported Formats

Canopy currently provides built-in support for:

| Format   | Typical Usage                        |
| -------- | ------------------------------------ |
| **JSON** | structured datasets and integrations |
| **TOML** | configuration and gameplay tuning    |

Each format has a dedicated helper:

| Helper | Format                         |
| ------ | ------------------------------ |
| `Json` | JSON parsing and serialization |
| `Toml` | TOML parsing and serialization |

Both helpers integrate with the **AssetsManager** for loading files.

---

# Basic Workflow

Working with structured data usually follows this sequence:

```
File
 │
 ▼
AssetsManager loads file
 │
 ▼
Parser converts data
 │
 ▼
Kotlin Object
 │
 ▼
Gameplay systems
```

When writing data back to disk, the process is reversed:

```
Runtime Object
 │
 ▼
Serializer
 │
 ▼
Structured Data
 │
 ▼
File
```

📌 **Diagram — Runtime Data Flow**

<!-- DIAGRAM: runtime-data-flow -->

---

# Parsing Data

Parsing converts structured data into Kotlin objects.

Example:

```kotlin
@Serializable
data class GameConfig(
    val playerSpeed: Float,
    val enemyCount: Int,
    val difficulty: String
)
```

Parsing a TOML file:

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)

val config: GameConfig = Toml.fromFile(file)
```

Parsing a JSON string:

```kotlin
val json = """{"playerSpeed": 4.5, "enemyCount": 10, "difficulty": "normal"}"""

val config = Json.fromString<GameConfig>(json)
```

---

# Serializing Data

Serialization converts objects back into structured data.

Example:

```kotlin
val jsonString = Json.toString(config)
```

Writing data to a file:

```kotlin
Json.toFile(config, saveFile)
```

The same pattern exists for TOML:

```kotlin
Toml.toFile(config, file)
```

---

# Shared API Pattern

Both parsers follow the same API design:

| Operation           | JSON                       | TOML                       |
| ------------------- | -------------------------- | -------------------------- |
| Parse file          | `Json.fromFile<T>(file)`   | `Toml.fromFile<T>(file)`   |
| Parse string        | `Json.fromString<T>(text)` | `Toml.fromString<T>(text)` |
| Serialize to string | `Json.toString(obj)`       | `Toml.toString(obj)`       |
| Serialize to file   | `Json.toFile(obj, file)`   | `Toml.toFile(obj, file)`   |

This unified pattern keeps data handling consistent across formats.

---

# Configuration and Defaults

Both parsers are built on top of **kotlinx.serialization** and support optional customization.

Default behaviors include:

| Behavior                      | Description                         |
| ----------------------------- | ----------------------------------- |
| `classDiscriminator = "type"` | used for polymorphic serialization  |
| `ignoreUnknownKeys = true`    | allows forward-compatible parsing   |
| `explicitNulls = false`       | avoids writing explicit null values |

Additional configuration can be provided when calling the parser.

---

# When Data Conversion Happens

Parsing and serialization usually occur during:

* application initialization
* configuration loading
* content loading
* save and load systems

This allows gameplay systems to work with **typed objects rather than raw files**.

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

# Summary

Parsing and serialization convert between **structured data and Kotlin objects**.

```
Structured Data ↔ Parser / Serializer ↔ Kotlin Object
```

Canopy provides two built-in helpers for this workflow:

* `Json`
* `Toml`

These utilities make it easy to build **data-driven systems** for configuration, content definitions, and save files.

---

# Related Topics

* **JSON** — working with JSON data
* **TOML** — working with TOML configuration files
* **Assets and Resources** — loading files with the AssetsManager
* **ID Registry** — referencing content using stable identifiers
* **Saving and Loading** — implementing save systems
