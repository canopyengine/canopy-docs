<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Saving Data

The **Saving System** is responsible for saving and loading player progress.

It is implemented as a globally available manager that collects save data from different parts of the game and stores it in a **single JSON save file**.

Instead of having one monolithic save object, Canopy uses a **modular system based on save modules**.

This allows each system in the game to manage its own save data independently.

---

# The Problem It Solves

Games often need to save multiple types of data:

- player stats
- inventory
- run progress
- bestiary entries
- unlocked abilities
- world state

A naïve save system might try to store everything inside a single large structure.

However, this quickly becomes difficult to maintain.

Instead, Canopy splits save data into **modules**, where each system contributes its own portion of the save file.

---

📌 **Save Architecture**

```text
Game Systems
   │
   ├─ Inventory
   ├─ Bestiary
   ├─ Player Stats
   └─ World Progress
   │
   ▼
Save Modules
   │
   ▼
Save Manager
   │
   ▼
Single JSON Save File
````

Each system registers its own save module, allowing the save manager to combine them automatically.

---

# What is a Save Module?

A **Save Module** represents one portion of the save file.

Each module defines how a specific system:

* saves its data
* loads its data

A module consists of four components:

| Component    | Description                           |
| ------------ | ------------------------------------- |
| `id`         | field name used in the save file      |
| `serializer` | handles serialization/deserialization |
| `onSave`     | callback returning data to save       |
| `onLoad`     | callback receiving loaded data        |

---

📌 **Save File Structure**

```text
Save File
 │
 ├─ bestiary
 ├─ inventory
 ├─ playerStats
 └─ worldState
```

Each field corresponds to a **registered save module**.

---

# Registering a Save Module

Game systems register save modules during initialization.

Example:

```kotlin
init {
  registerSaveModule<ExampleData>(
    SaveModule(
      id = "bestiary",
      serializer = JsonParser.serializer(),
      onSave = { runtimeData },
      onLoad = { loadedData -> runtimeData = loadedData }
    )
  )
}
```

This automatically registers the module with the save manager.

---

📌 **Module Registration**

```text
Game System
   │
   ▼
registerSaveModule(...)
   │
   ▼
Save Manager stores module
```

Each system becomes responsible for its own save logic.

---

# Saving Data

When the game performs a save operation:

1. The save manager calls `onSave()` for each module
2. Each module returns its data
3. The manager merges the results into a JSON file

---

📌 **Save Flow**

```text
SaveManager.save()
     │
     ▼
Call onSave() for each module
     │
     ▼
Collect module data
     │
     ▼
Generate JSON save file
```

Example resulting save file:

```json
{
  "bestiary": {
    "entries": ["enemy_goblin", "enemy_slime"]
  }
}
```

The contents of each field are determined by the module’s `onSave()` callback.

---

# Loading Data

When loading a save file:

1. The save manager reads the JSON file
2. Each module receives its data
3. The module processes the data through its `onLoad()` callback

---

📌 **Load Flow**

```text
SaveManager.load()
     │
     ▼
Read JSON save file
     │
     ▼
Match data with modules
     │
     ▼
Call onLoad() for each module
```

Each system is responsible for restoring its own runtime state.

---

# Example: Bestiary Module

A bestiary system might store which enemies the player has discovered.

Example module:

```kotlin
init {
  registerSaveModule<ExampleData>(
    SaveModule(
      id = "bestiary",
      serializer = JsonParser.serializer(),
      onSave = { this.asData() },
      onLoad = ::loadData
    )
  )
}
```

Example load function:

```kotlin
fun loadData(data: ExampleData) {
  entries = registry.mapIds(data.entriesIds)
}
```

This example uses an **IdRegistry** to resolve saved IDs into runtime objects.

Learn more about the registry here:

```
/manuals/data/id-registry/
```

---

# Slot-Based Saving

The saving system supports **slot-based saves**.

This allows games to implement multiple save slots.

Example:

```
slot_0.json
slot_1.json
slot_2.json
```

The save manager receives a slot number when saving or loading.

Example:

```kotlin
saveManager.save(slot = 0)
saveManager.load(slot = 0)
```

---

# Custom Save Locations

The save manager can also support custom file locations.

This is done through a `fileLocationFactory`.

The factory receives the slot number and returns a file handle.

Example concept:

```kotlin
fileLocationFactory(slot: Int): FileHandle
```

This allows the save system to support:

* save slots
* custom save directories
* platform-specific storage

---

📌 **Slot Resolution**

```text
Slot Number
   │
   ▼
fileLocationFactory
   │
   ▼
File Location
   │
   ▼
Save File
```

---

# Important Guidelines

To keep the save system stable and predictable, follow these guidelines.

---

## Unique Module IDs

Each module must use a **unique ID**.

Duplicate IDs can cause data to overwrite other modules.

---

## Keep Save Data Simple

Save files should contain **data structures**, not runtime objects.

Example:

```json
{
  "inventory": ["weapon_sword"]
}
```

Runtime objects should be reconstructed during loading.

---

## Prefer ID-Based Saves

Large objects should not be serialized directly.

Instead, save only their IDs and resolve them using an **IdRegistry**.

---

# Summary

The save system uses a **modular architecture** where each system manages its own data.

```
Game Systems
      │
      ▼
Save Modules
      │
      ▼
Save Manager
      │
      ▼
JSON Save File
```

This approach provides:

* modular save logic
* flexible system integration
* smaller save files
* easier maintenance

By combining **save modules**, **JSON serialization**, and **ID registries**, Canopy provides a scalable way to manage player data.