<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Saving and Loading

Games often need to **persist state between sessions**.

Examples include:

* player progress
* inventory contents
* world state
* completed quests
* simulation data
* user settings

Canopy provides a **modular save system** built around the `SaveManager` and **Save Modules**.

Instead of saving a single large object, game state is divided into **independent modules**, each responsible for saving and loading its own data.

This keeps save systems:

* modular
* maintainable
* easy to extend

---

# Mental Model

The save system coordinates multiple independent save modules.

```text
SaveManager
     │
     ├─ PlayerStatsModule
     ├─ InventoryModule
     └─ WorldStateModule
```

Each module handles:

* producing its save data
* applying loaded data back into the game

📌 **Diagram — Save Architecture**

<!-- DIAGRAM: save-system-modules -->

---

# Save Destinations and Slots

The `SaveManager` organizes save files using two concepts.

| Concept         | Description                                   |
| --------------- | --------------------------------------------- |
| **Destination** | named save channel (profile, world, settings) |
| **Slot**        | numeric save slot                             |

Example destinations:

```text
"profile"
"world"
"settings"
```

Each destination maps a **slot number to a file location**.

Example:

```text
saves/
 ├ profile_0.json
 ├ profile_1.json
 ├ world_0.json
 └ settings.json
```

---

# Creating the SaveManager

The `SaveManager` is created with destination definitions.

```kotlin
SaveManager(
    "profile" to { slot -> savesDir.child("profile_$slot.json") },
    "world" to { slot -> savesDir.child("world_$slot.json") }
)
```

Each destination provides a **function that resolves the file location for a slot**.

---

# Save Modules

A **Save Module** represents one piece of persisted data.

Each module defines:

* a unique identifier
* how data is serialized
* how to produce save data
* how to apply loaded data

Example interface:

```kotlin
interface SaveModule<T> {

    val id: String

    val serializer: KSerializer<T>

    val onSave: () -> T

    val onLoad: (T) -> Unit
}
```

---

# Registering a Save Module

Modules are typically registered during game initialization.

Example:

```kotlin
registerSaveModule(
    destination = "profile",
    id = "player.stats",
    onSave = { snapshotPlayerStats() },
    onLoad = { applyPlayerStats(it) }
)
```

When the game saves or loads the `"profile"` destination, this module participates automatically.

---

# Save File Structure

Save files are stored as **JSON objects**, where each module stores its data under its ID.

Example save file:

```json
{
  "player.stats": {
    "health": 100,
    "level": 5
  },
  "inventory": {
    "gold": 120,
    "items": ["iron_sword"]
  }
}
```

Each module is responsible only for **its own section of the save file**.

📌 **Diagram — Save File Layout**

<!-- DIAGRAM: save-file-modules -->

---

# Saving Data

Saving is coordinated by the `SaveManager`.

```kotlin
manager<SaveManager>().save("profile", slot = 0)
```

During saving:

1. each module runs `onSave()`
2. the result is serialized
3. the data is stored under the module ID
4. the combined JSON is written to disk

---

# Loading Data

Loading restores module state from the save file.

```kotlin
manager<SaveManager>().load("profile", slot = 0)
```

During loading:

1. the save file is parsed
2. each module's section is located
3. the data is deserialized
4. `onLoad()` is called

This allows modules to **reconstruct runtime state**.

---

# Accessing Loaded Data

After loading, modules can retrieve stored data through the manager.

```kotlin
val stats = manager<SaveManager>()
    .loadData("profile", PlayerStats::class)
```

This is useful when systems need access to previously loaded data.

---

# Saving Multiple Destinations

Games often save multiple data categories at once.

The manager provides helpers for this.

```kotlin
saveManager.saveAll(slot = 0)
```

This saves all registered destinations.

Loading works the same way:

```kotlin
saveManager.loadAll(slot = 0)
```

---

# Typical Save Structure

A common structure might look like this:

```text
saves/
 ├ profile_0.json
 ├ profile_1.json
 ├ world_0.json
 └ settings.json
```

Where:

| Destination | Content            |
| ----------- | ------------------ |
| profile     | player progress    |
| world       | world state        |
| settings    | user configuration |

---

# Best Practices

### Split data into modules

Avoid storing everything in a single save structure.

Modules keep save logic independent.

---

### Use stable module IDs

Module IDs must remain stable so older save files remain compatible.

---

### Save data, not engine objects

Persist structured data instead of runtime objects.

---

### Keep modules focused

Each module should handle **one logical piece of state**.

Examples:

* `player.stats`
* `inventory`
* `quest.progress`
* `world.time`

---

# Summary

Canopy's save system uses **modular save modules coordinated by the SaveManager**.

```text
SaveManager
     │
     ▼
Save Modules
     │
     ▼
Serialized JSON save file
```

This architecture allows:

* modular save systems
* flexible save formats
* independent game systems
* scalable persistence

---

# Related Topics

* **Parsing and Serialization** — converting objects and data
* **JSON** — working with JSON data
* **ID Registry** — referencing content with stable identifiers
* **Assets and Resources** — loading files from the project
