<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Content Pipeline

Games often rely on **large amounts of structured data** such as:

* item definitions
* enemy configurations
* level parameters
* gameplay tuning values
* simulation settings

Canopy uses a **data-driven workflow** where game content is defined in files and loaded at runtime.

This process is known as the **content pipeline**.

The content pipeline describes how **raw files become usable game data**.

---

# Mental Model

The pipeline transforms **authored data files into runtime objects**.

```text
Content Files
     │
     ▼
AssetsManager
     │
     ▼
Parsers (JSON / TOML)
     │
     ▼
Kotlin Data Objects
     │
     ▼
Registries / Game Systems
```

📌 **Diagram — Content Pipeline**

<!-- DIAGRAM: content-pipeline -->

---

# Step 1 — Author Content Files

Game data is written in structured formats such as **JSON** or **TOML**.

Example enemy definition:

```json
{
  "id": "enemy:goblin",
  "health": 40,
  "damage": 10
}
```

Example configuration file:

```toml
spawnInterval = 3.0
maxEnemies = 15
```

These files are stored inside the project's **resources directory**.

---

# Step 2 — Load Files with AssetsManager

Files are accessed through the **AssetsManager**.

```kotlin
val file = assetsManager.loadFile(
    "enemies/goblin.json",
    FileSource.Internal
)
```

The AssetsManager abstracts file access across different platforms.

---

# Step 3 — Parse the Data

The file contents are parsed into Kotlin objects.

Example:

```kotlin
val enemy = Json.fromFile<EnemyDefinition>(file)
```

Or for configuration:

```kotlin
val config = Toml.fromFile<GameConfig>(file)
```

The parser converts structured data into **typed Kotlin objects**.

---

# Step 4 — Register Data

Parsed data is often registered in **runtime registries**.

Example:

```text
EnemyRegistry
   ├ enemy:goblin
   ├ enemy:orc
   └ enemy:troll
```

Registries allow systems to retrieve data using **stable identifiers**.

Example:

```kotlin
val goblin = enemyRegistry["enemy:goblin"]
```

This makes game content easy to reference and reuse.

---

# Step 5 — Use Data in Systems

Once loaded and registered, the data can be used by gameplay systems.

Examples:

* spawning enemies
* configuring AI behavior
* tuning simulation parameters
* loading level data

```text
Game Systems
     │
     ▼
Registries
     │
     ▼
Parsed Content Data
```

---

# Runtime vs Authoring Data

The content pipeline separates **authoring data** from **runtime objects**.

| Authoring Data      | Runtime Data     |
| ------------------- | ---------------- |
| JSON / TOML files   | Kotlin objects   |
| human-editable      | engine-friendly  |
| stored in resources | stored in memory |

This separation makes it easier to:

* tweak gameplay without recompiling
* manage large datasets
* build tools for content creation

---

# Content IDs

Content definitions typically include a **stable identifier**.

Example:

```json
{
  "id": "item:iron_sword"
}
```

These identifiers are used to reference content across systems.

Example:

```json
{
  "weapon": "item:iron_sword"
}
```

During loading, these IDs are resolved through the **ID Registry**.

---

# Relationship with Save Systems

The content pipeline also connects to the **save system**.

Instead of saving full content definitions, save files store **identifiers**.

Example save data:

```json
{
  "weapon": "item:iron_sword"
}
```

During loading, the ID is resolved back into the corresponding runtime content.

```text
Save File
     │
     ▼
Content ID
     │
     ▼
Registry
     │
     ▼
Content Definition
```

This keeps save files small and stable.

---

# Typical Project Data Flow

A typical project pipeline looks like this:

```text
Content Files
 (JSON / TOML)
      │
      ▼
AssetsManager
      │
      ▼
Parser
      │
      ▼
Data Classes
      │
      ▼
Registries
      │
      ▼
Game Systems
```

---

# Best Practices

### Keep content data separate from code

Store gameplay data in JSON or TOML rather than hardcoding values.

---

### Use stable identifiers

IDs allow systems and save files to reference content safely.

---

### Validate data early

Validate parsed data during loading to detect invalid content quickly.

---

### Organize content by domain

Example structure:

```text
resources/
 ├ enemies/
 ├ items/
 ├ configs/
 └ levels/
```

This keeps large projects manageable.

---

# Summary

The content pipeline transforms **authored data files into runtime objects used by the engine**.

```text
Files → Assets → Parsers → Data Objects → Registries → Game Systems
```

This approach enables:

* data-driven gameplay
* flexible configuration
* scalable content management

---

# Related Topics

* **Assets and Resources** — loading files from the project
* **Parsing and Serialization** — converting data and objects
* **JSON** — working with JSON datasets
* **TOML** — working with configuration files
* **ID Registry** — referencing content using stable identifiers
* **Saving and Loading** — persisting game state
