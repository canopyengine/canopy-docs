<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Recommended Data Architecture

This guide shows a typical way to structure game data when using Canopy.

It demonstrates how the following systems work together:

- AssetsManager
- Parsers
- IdRegistry
- Game Systems
- Save Modules

This architecture separates **static content definitions**, **runtime state**, and **save data**.

---

# High-Level Architecture

A typical data architecture looks like this:

📌 **Data Lifecycle**

```text
Static Content
(JSON / TOML)
       │
       ▼
AssetsManager loads files
       │
       ▼
Parsers convert data
       │
       ▼
IdRegistry stores definitions
       │
       ▼
Game Systems use runtime objects
       │
       ▼
Save Modules store player progress
       │
       ▼
Save Files
````

Each layer has a clear responsibility.

---

# Project Data Layout

A typical project might organize data like this:

```text
project/
│
├─ data/
│   ├─ items.json
│   ├─ enemies.json
│   └─ skills.json
│
├─ config/
│   └─ gameplay.toml
│
└─ saves/
    ├─ slot_0.json
    └─ slot_1.json
```

### Folder roles

| Folder    | Purpose                      |
| --------- | ---------------------------- |
| `data/`   | gameplay content definitions |
| `config/` | configuration and tuning     |
| `saves/`  | player save files            |

---

# Example: Item Definitions

Items are usually stored in a structured file.

Example:

```json
[
  {
    "id": "weapon_sword",
    "damage": 10
  },
  {
    "id": "armor_iron",
    "protection": 5
  }
]
```

These files represent **static game definitions**.

---

# Loading Definitions

During game startup, definitions are loaded and parsed.

```kotlin
val file = assetsManager.loadFile(
  "data/items.json",
  FileSource.Internal
)

val items: List<Item> =
  JsonParser.parseFile(file)
```

---

# Registering Definitions

Parsed objects are registered in an **IdRegistry**.

```kotlin
val registry = IdRegistry<Item>()

registry.loadRegistry(items)
```

This allows systems to resolve objects by ID.

---

📌 **Registry Example**

```text
weapon_sword → Weapon(damage = 10)
armor_iron   → Armor(protection = 5)
```

Game systems can now reference items by ID.

---

# Using Definitions in Systems

Game systems typically store **IDs**, not full objects.

Example inventory:

```text
["weapon_sword", "armor_iron"]
```

When needed, these IDs are resolved using the registry.

```kotlin
val items: List<Item> =
  registry.mapIds(inventoryIds)
```

---

# Save Data

Player progress is stored using **Save Modules**.

Each system registers a module responsible for saving its state.

Example inventory module:

```kotlin
registerSaveModule<InventorySaveData>(
  SaveModule(
    id = "inventory",
    serializer = JsonParser.serializer(),
    onSave = { inventoryState },
    onLoad = { inventoryState = it }
  )
)
```

---

📌 **Save System**

```text
Game Systems
   │
   ├─ Inventory
   ├─ Bestiary
   ├─ Player Stats
   └─ World State
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

---

# Example Save File

```json
{
  "inventory": ["weapon_sword"],
  "bestiary": ["enemy_goblin"]
}
```

Save files store **IDs instead of full objects**.

This keeps save files:

* small
* stable across versions
* easier to maintain

---

# Full Game Data Flow

The complete system looks like this:

📌 **Full Data Pipeline**

```text
Content Files
(JSON / TOML)
        │
        ▼
AssetsManager
        │
        ▼
Parsers
        │
        ▼
Kotlin Objects
        │
        ▼
IdRegistry
        │
        ▼
Runtime Game Systems
        │
        ▼
Save Modules
        │
        ▼
Save Manager
        │
        ▼
Save Files
```

---

# Best Practices

### Separate Definitions and Runtime State

Static definitions should never be modified at runtime.

Example:

```
Weapon definition → immutable
Player weapon durability → runtime state
```

---

### Use IDs Instead of Full Objects

Always store IDs in save files instead of full objects.

Example:

```json
{
  "inventory": ["weapon_sword"]
}
```

---

### Load Definitions Before Saves

Startup order should be:

```
1. Load definitions
2. Populate IdRegistry
3. Initialize systems
4. Load save file
```

This ensures all IDs can be resolved.

---

# Summary

A well-structured game data architecture separates:

* **content definitions**
* **runtime systems**
* **save data**

```text
Content Files
      ↓
AssetsManager
      ↓
Parsers
      ↓
IdRegistry
      ↓
Game Systems
      ↓
Save Modules
      ↓
Save Files
```

This design keeps game data:

* modular
* scalable
* easy to maintain
