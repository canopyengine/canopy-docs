<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Assets and Resources

Games rely on many external files such as textures, audio, configuration data, and gameplay definitions.

Canopy provides the **AssetsManager** to load these files at runtime.

The AssetsManager allows the engine to access files from different sources and pass them to systems such as:

* parsers
* rendering systems
* audio systems
* configuration loaders

---

# Mental Model

The AssetsManager is responsible for **locating and loading files**.

```
File System
     │
     ▼
AssetsManager
     │
     ▼
Game Systems
```

📌 **Diagram — Asset Loading Pipeline**

<!-- DIAGRAM: asset-loading-pipeline -->

---

# File Sources

Assets can be loaded from different sources depending on the platform and use case.

| Source      | Description                           |
| ----------- | ------------------------------------- |
| `Internal`  | files packaged with the application   |
| `External`  | files located outside the application |
| `Classpath` | files bundled in the classpath        |
| `Absolute`  | files referenced by absolute path     |

Example:

```kotlin
val file = assetsManager.loadFile(
    "config/game.toml",
    FileSource.Internal
)
```

The returned file can then be used by other systems such as parsers.

---

# Loading Files

The most common operation is loading a file from the project resources.

```kotlin
val file = assetsManager.loadFile("config/game.toml", FileSource.Internal)
```

Once loaded, the file can be:

* parsed into data objects
* read as raw text
* passed to asset systems

Example with a parser:

```kotlin
val file = assetsManager.loadFile("enemy/goblin.toml", FileSource.Internal)

val enemy: EnemyData = TomlParser.parseFile(file)
```

---

# Accessing File Contents

Files loaded by the AssetsManager can provide their contents in different formats.

Example:

```kotlin
val text = file.readString()
```

This can be useful when:

* debugging data
* passing data to custom parsers
* handling external content

---

# Typical Workflow

Loading data usually follows this sequence:

```
File
 │
 ▼
AssetsManager loads file
 │
 ▼
Parser reads file
 │
 ▼
Kotlin object
 │
 ▼
Gameplay systems
```

📌 **Diagram — Data Loading Flow**

<!-- DIAGRAM: data-loading-flow -->

---

# Organizing Project Resources

Game projects usually organize assets inside the `resources` directory.

Example project structure:

```
resources/
 ├ config/
 │   └ game.toml
 │
 ├ enemy/
 │   └ goblin.toml
 │
 ├ textures/
 │   └ player.png
 │
 └ audio/
     └ explosion.wav
```

This makes assets easier to manage and locate.

---

# Common Use Cases

The AssetsManager is commonly used for loading:

| Asset Type    | Example            |
| ------------- | ------------------ |
| configuration | game settings      |
| gameplay data | enemy definitions  |
| textures      | sprites            |
| audio         | sound effects      |
| shaders       | rendering programs |

Many systems rely on the AssetsManager as the **entry point for file access**.

---

# Best Practices

### Organize assets clearly

Group related files into directories such as:

```
config/
enemy/
textures/
audio/
```

---

### Keep configuration data external

Store gameplay parameters in files rather than hardcoding them.

---

### Load assets once

Avoid repeatedly loading the same files during gameplay.

---

### Separate assets from code

Keeping assets external allows games to be **more flexible and easier to maintain**.

---

# Summary

The **AssetsManager** is responsible for loading files used by the engine.

Typical flow:

```
File
 │
 ▼
AssetsManager
 │
 ▼
Parser / System
 │
 ▼
Runtime objects
```

This system allows Canopy projects to access **configuration data, assets, and resources** in a consistent way.

---

# Related Topics

* **Parsing Overview** — converting files into structured objects
* **JSON Parsing** — parsing JSON datasets
* **TOML Parsing** — parsing configuration files
* **Saving and Loading** — persisting game state