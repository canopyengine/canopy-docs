<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# TOML

Canopy provides built-in support for working with **TOML data** through the `Toml` helper.

TOML is designed to be **simple, readable, and easy to edit**, making it well suited for configuration and gameplay tuning.

Typical uses include:

* gameplay configuration
* simulation parameters
* level settings
* difficulty tuning
* project configuration

The `Toml` helper allows converting between **TOML data and Kotlin objects** using **kotlinx.serialization**.

---

# Quick Example

Example TOML file:

```toml
playerSpeed = 4.5
enemyCount = 10
difficulty = "normal"
```

Kotlin data class:

```kotlin
@Serializable
data class GameConfig(
    val playerSpeed: Float,
    val enemyCount: Int,
    val difficulty: String
)
```

Parsing the file:

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)

val config: GameConfig = Toml.fromFile(file)
```

---

📌 **Diagram — TOML Parsing Flow**

<!-- DIAGRAM: toml-parsing-flow -->

```
TOML File
   │
   ▼
AssetsManager loads file
   │
   ▼
Toml parser converts data
   │
   ▼
Kotlin Object
```

---

# Parsing TOML

TOML data can be parsed either from **files** or **strings**.

### Parsing a file

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)

val config = Toml.fromFile<GameConfig>(file)
```

### Parsing a string

```kotlin
val toml = """
playerSpeed = 4.5
enemyCount = 10
difficulty = "normal"
"""

val config = Toml.fromString<GameConfig>(toml)
```

This can be useful when working with:

* dynamic configuration
* testing data structures
* external content

---

# Serializing TOML

Objects can also be converted into TOML.

### Serialize to string

```kotlin
val tomlString = Toml.toString(config)
```

Example output:

```toml
playerSpeed = 4.5
enemyCount = 10
difficulty = "normal"
```

### Serialize to file

```kotlin
Toml.toFile(config, file)
```

This replaces the contents of the file with the serialized TOML data.

---

# Nested Data

TOML supports nested structures through **tables**.

Example TOML file:

```toml
[player]
speed = 4.5
health = 100

[enemy]
count = 5
damage = 12
```

Corresponding Kotlin classes:

```kotlin
@Serializable
data class PlayerConfig(
    val speed: Float,
    val health: Int
)

@Serializable
data class EnemyConfig(
    val count: Int,
    val damage: Int
)

@Serializable
data class GameConfig(
    val player: PlayerConfig,
    val enemy: EnemyConfig
)
```

Parsing works the same way:

```kotlin
val config: GameConfig = Toml.fromFile(file)
```

---

📌 **Diagram — Nested TOML Mapping**

<!-- DIAGRAM: toml-nested-mapping -->

```
TOML Tables
   │
   ▼
Nested Kotlin Classes
```

---

# Polymorphic Data

TOML supports polymorphic serialization using a **type discriminator**.

Example data model:

```
Item
 ├ Weapon
 └ Armor
```

Example TOML:

```toml
type = "Weapon"
damage = 10
```

Register polymorphic serializers:

```kotlin
val module = SerializersModule {
    polymorphic(Item::class) {
        subclass(Weapon::class)
        subclass(Armor::class)
    }
}
```

Parsing with the module:

```kotlin
val item = Toml.fromString<Item>(tomlString, module)
```

The `"type"` field determines which subclass is created.

---

# Default Configuration

The `Toml` helper provides a default configuration designed for configuration files.

| Option                        | Behavior                             |
| ----------------------------- | ------------------------------------ |
| `classDiscriminator = "type"` | polymorphic type field               |
| `ignoreUnknownKeys = true`    | extra fields are ignored             |
| `explicitNulls = false`       | missing values are treated as absent |

These defaults can be customized using the `TomlConfigBuilder`.

Example:

```kotlin
val config = Toml.fromFile<MyConfig>(file) {
    ignoreUnknownKeys = false
}
```

---

# When to Use TOML

TOML is well suited for **human-editable configuration files**.

Common uses include:

* gameplay tuning
* simulation parameters
* difficulty settings
* level configuration
* project configuration

Because TOML is designed to be easy to read, it is often preferred for configuration data.

---

# TOML vs JSON

Both formats are supported in Canopy.

| Format   | Best Use                     |
| -------- | ---------------------------- |
| **JSON** | large structured datasets    |
| **TOML** | human-readable configuration |

Example TOML configuration:

```toml
gravity = 9.8
spawnInterval = 3.5
maxEnemies = 20
```

---

# Summary

The `Toml` helper allows converting between **TOML data and Kotlin objects**.

```
TOML Data ↔ Toml Helper ↔ Kotlin Object
```

This enables systems such as:

* configuration loading
* gameplay tuning
* simulation parameters
* project settings

---

# Related Topics

* **Parsing and Serialization** — overview of data conversion
* **JSON** — working with JSON datasets
* **Assets and Resources** — loading files with the AssetsManager
* **Saving and Loading** — implementing save systems
