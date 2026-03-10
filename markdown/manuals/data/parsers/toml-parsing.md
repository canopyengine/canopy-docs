<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# TOML Parsing

Canopy provides built-in support for parsing **TOML files** into Kotlin objects.

TOML is a configuration format designed to be **easy for humans to read and write**, making it ideal for game configuration and tuning values.

Typical uses include:

- gameplay configuration
- difficulty settings
- level parameters
- simulation tuning values
- project settings

The TOML parser integrates with the **AssetsManager**, allowing your game to load structured configuration data directly from files.

---

# Basic Usage

Parsing TOML into Kotlin objects usually involves three steps:

1. Define a serializable data class  
2. Load the TOML file  
3. Parse it into a Kotlin object  

---

## 1. Define a Serializable Class

First define a data class that represents the structure of the TOML file.

Use the `@Serializable` annotation so the parser can map the TOML data into the class.

```kotlin
@Serializable
data class GameConfig(
    val playerSpeed: Float,
    val enemyCount: Int,
    val difficulty: String
)
````

---

## 2. Example TOML File

A corresponding TOML file might look like this:

```toml
playerSpeed = 4.5
enemyCount = 10
difficulty = "normal"
```

TOML is designed to be simple and readable, making it easy to modify game configuration.

---

## 3. Parse a TOML File

TOML files can be loaded using the **AssetsManager**, then parsed into objects.

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)

val config: GameConfig = TomlParser.parseFile(file)
```

---

📌 **Parsing Flow**

```text
TOML File
   │
   ▼
AssetsManager loads file
   │
   ▼
TomlParser converts data
   │
   ▼
Kotlin Object
```

---

## 4. Parse a TOML String

If the TOML content is already available as a string, it can be parsed directly.

```kotlin
val toml = """
playerSpeed = 4.5
enemyCount = 10
difficulty = "normal"
"""

val config: GameConfig = TomlParser.parseString(toml)
```

This can be useful when:

* loading configuration dynamically
* reading external content
* testing data structures

---

# Nested Data

TOML also supports nested structures using **tables**.

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
val config: GameConfig = TomlParser.parseFile(file)
```

---

📌 **Nested Data Mapping**

```text
TOML Tables
   │
   ▼
Nested Kotlin Classes
```

---

# When to Use TOML

TOML is best suited for **configuration data** rather than large datasets.

Good examples include:

* gameplay tuning
* simulation parameters
* level configuration
* project settings

Example:

```toml
gravity = 9.8
maxEnemies = 20
spawnInterval = 3.5
```

These values can be adjusted without recompiling the game.

---

# TOML vs JSON

Both formats are supported by Canopy parsers.

| Format   | Best Use                     |
| -------- | ---------------------------- |
| **JSON** | large structured datasets    |
| **TOML** | human-readable configuration |

TOML is usually preferred for **configuration files**, while JSON is better for **complex data structures**.

---

# Summary

The TOML parser allows Canopy projects to load configuration files and convert them into Kotlin objects.

Typical workflow:

```text
TOML file
   │
   ▼
AssetsManager loads file
   │
   ▼
TomlParser parses data
   │
   ▼
Kotlin configuration object
```

This makes it easy to separate **configuration data** from your gameplay code.

---

# Next Steps

You may also want to explore:

* **JSON Parsing** for structured data
* **Handling Data** for loading files and assets
