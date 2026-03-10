<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Assets Manager

The **Assets Manager** is responsible for loading files and resources used by your game.

It provides a centralized system for accessing external data such as:

- configuration files
- textures
- audio files
- game data
- level definitions

The Assets Manager works together with **parsers** to convert structured files into Kotlin objects.

---

# How Asset Loading Works

When loading data in Canopy, the typical workflow is:

📌 **Asset Loading Pipeline**

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
File loaded
   │
   ▼
(Optional) Parser converts data
   │
   ▼
Usable game data
````

This system keeps file loading consistent and centralized across the project.

---

# Accessing the Assets Manager

The Assets Manager can be accessed through the **manager registry**.

Example:

```kotlin
val assetsManager = manager<AssetsManager>()
```

Once retrieved, it can be used to load files or resources.

---

# Loading Files

Files can be loaded using the `loadFile` method.

Example:

```kotlin
val file = assetsManager.loadFile(
    "config/game.toml",
    FileSource.Internal
)
```

This loads a file from the specified source and returns a file object that can be read or parsed.

---

📌 **File Loading Flow**

```text
Game code
   │
   ▼
loadFile(...)
   │
   ▼
FileSource determines location
   │
   ▼
File returned
```

---

# File Sources

Files can come from different locations depending on how your project is structured.

| Source     | Description                   |
| ---------- | ----------------------------- |
| `Internal` | files packaged with the game  |
| `Local`    | files on the local filesystem |

Example:

```kotlin
val file = assetsManager.loadFile(
    "data/items.json",
    FileSource.Internal
)
```

Using file sources allows the same loading system to work across multiple platforms.

---

# Parsing Loaded Files

Once a file is loaded, it can be passed to a parser to convert its contents into structured data.

Example:

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)

val config: GameConfig =
    TomlParser.parseFile(file)
```

This converts the TOML file into a Kotlin object.

---

📌 **Parsing Example**

```text
config.toml
   │
   ▼
AssetsManager loads file
   │
   ▼
TomlParser parses data
   │
   ▼
GameConfig object
```

---

# Typical Use Cases

The Assets Manager is commonly used for loading:

* gameplay configuration
* item databases
* enemy definitions
* level metadata
* dialogue data
* resource files

Example:

```kotlin
val file = assetsManager.loadFile(
    "data/enemies.json",
    FileSource.Internal
)
```

This file can then be parsed into a structured object.

---

# Best Practices

To keep your project organized:

* store structured data in **JSON or TOML files**
* use the **Assets Manager** to load files
* parse structured files into **Kotlin objects**
* avoid hardcoding large datasets directly in code

This approach keeps gameplay systems cleaner and easier to maintain.

---

# Summary

The Assets Manager provides a unified way to load files and resources.

Typical workflow:

```text
External file
   │
   ▼
AssetsManager loads file
   │
   ▼
Parser converts data (optional)
   │
   ▼
Kotlin objects used by game systems
```

This system allows your game to load and manage external data in a consistent and scalable way.

---

# Next Steps

To learn how to parse structured data files, see:

* **Parsing Data**
    * JSON Parsing
    * TOML Parsing

