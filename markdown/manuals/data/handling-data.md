<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Handling Data

Games rely heavily on **external data** such as configuration files, assets, and structured game content.

Canopy provides a flexible system for **loading, parsing, and managing data** so that gameplay logic remains separate from the data it operates on.

Typical types of data include:

- configuration files
- item or enemy definitions
- gameplay tuning parameters
- level metadata
- dialogue or narrative data

By keeping this data outside the codebase, projects become easier to maintain, modify, and scale.

---

# Data Handling Pipeline

In Canopy, external data usually flows through several layers before being used by gameplay systems.

📌 **Data Loading Flow**

```text
Game Code
   │
   ▼
AssetsManager
   │
   ▼
File Source
   │
   ▼
Parser (JSON / TOML)
   │
   ▼
Kotlin Data Objects
   │
   ▼
Gameplay Systems
````

This pipeline allows data to be loaded from files and converted into structured objects that your game can use.

---

# Core Components

The data system is composed of two main parts.

| Component         | Responsibility                                   |
| ----------------- | ------------------------------------------------ |
| **AssetsManager** | loads files and resources from different sources |
| **Parsers**       | convert structured files into Kotlin objects     |

Together they allow your game to read and interpret external data.

---

# Assets Manager

The **AssetsManager** is responsible for loading files and resources used by the game.

It supports loading files from different sources such as:

* internal game resources
* local filesystem
* other supported file sources

Example:

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)
```

Once the file is loaded, it can be passed to a parser to convert its contents into usable data.

---

# Parsers

Parsers convert structured files into Kotlin objects.

Canopy currently includes support for:

| Format   | Typical Use          |
| -------- | -------------------- |
| **JSON** | structured game data |
| **TOML** | configuration files  |

Example workflow:

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)

val config: GameConfig = TomlParser.parseFile(file)
```

---

📌 **Parsing Pipeline**

```text
External File
   │
   ▼
AssetsManager loads file
   │
   ▼
Parser reads data
   │
   ▼
Kotlin object returned
```

---

# Why External Data Matters

Using external data provides several advantages:

* **faster iteration** without recompiling
* easier balancing and tuning
* separation of data and gameplay logic
* compatibility with external tools and pipelines

For example, enemy stats or gameplay configuration can be changed simply by editing a file.

---

# Data Formats

Canopy currently supports the following structured formats.

## JSON

JSON is widely used for storing **structured data**.

Example:

```json
{
  "enemy": "goblin",
  "health": 30,
  "speed": 2.5
}
```

JSON is well suited for:

* item databases
* enemy definitions
* level metadata
* external APIs

---

## TOML

TOML is designed to be **easy for humans to read and edit**, making it ideal for configuration files.

Example:

```toml
enemy = "goblin"
health = 30
speed = 2.5
```

TOML is commonly used for:

* gameplay configuration
* tuning parameters
* project settings

---

# Available Guides

The following guides explain how to use each component of the data system.

* **Parsing Data**

    * JSON Parsing
    * TOML Parsing

Each guide includes examples showing how to load and parse external data into Kotlin objects.

---

# Summary

Canopy's data system allows your game to load and interpret external data in a structured way.

The typical workflow is:

```text
External file
   │
   ▼
AssetsManager loads file
   │
   ▼
Parser converts data
   │
   ▼
Kotlin object used by game systems
```

This approach keeps your game **flexible, configurable, and easier to maintain**.

---

# Next Steps

To learn how to parse structured data, continue with:

* **[Parsing Data](parsers/parsing-data.md)**
