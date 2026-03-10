<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Id Registry

`IdRegistry` is a generic **ID → definition resolver** used to map stored IDs into fully defined objects at runtime.

Instead of storing full objects in save files or game state, systems can store **only IDs**, and resolve them later using the registry.

This helps keep game data:

- lightweight
- consistent
- version-safe

---

# The Problem It Solves

Game content is often defined in external data files such as:

```
weapons.json
armors.json
consumables.json
skills.json
````

These files define **static game content**.

However, runtime data such as inventories or save files should not duplicate these definitions.

Example save file:

```json
{
  "inventory": ["weapon_sword", "armor_iron"]
}
````

Instead of storing the full item objects, the save file stores **only IDs**.

---

📌 **Save Data vs Game Definitions**

```text
Game Definitions
 ├─ weapon_sword
 ├─ armor_iron
 └─ potion_small

Save File
 └─ ["weapon_sword", "armor_iron"]
```

To convert these IDs back into objects, the game uses the **IdRegistry**.

---

# Concept

The registry maintains a mapping between IDs and their corresponding objects.

```
id → concrete definition
```

Example:

```text
weapon_sword → Weapon(damage = 10)
armor_iron   → Armor(protection = 5)
potion_small → Consumable(heal = 20)
```

---

📌 **Registry Mapping**

```text
IdRegistry
  │
  ├─ weapon_sword → Weapon
  ├─ armor_iron   → Armor
  └─ potion_small → Consumable
```

When the game loads player data:

```
["weapon_sword", "armor_iron"]
```

The registry resolves them into real objects.

---

# Basic Usage

Using the registry involves three steps:

1. Create a registry
2. Load definitions
3. Resolve IDs

---

# 1️⃣ Create a Registry

```kotlin
val registry: IdRegistry<Item> = IdRegistry()
```

The registry is **generic**, allowing it to work with any domain type.

Examples:

```
IdRegistry<Item>
IdRegistry<Skill>
IdRegistry<NpcDefinition>
IdRegistry<CraftingRecipe>
```

---

# 2️⃣ Load Definitions

Once definitions are parsed from JSON or TOML files, they can be registered.

```kotlin
val items = listOf(sword, armor, consumable)

registry.loadRegistry(items)
```

Each element is registered using its `id`.

---

📌 **Loading Flow**

```text
JSON / TOML data
      │
      ▼
Parsed into objects
      │
      ▼
IdRegistry.loadRegistry()
      │
      ▼
ID → object mapping created
```

---

# 3️⃣ Resolve IDs

IDs can then be resolved into objects.

```kotlin
val weapons: List<EquippableItem.Weapon> =
    registry.mapIds(listOf(sword.id))

val armors: List<EquippableItem.Armor> =
    registry.mapIds(listOf(armor.id))
```

The registry will:

* resolve each ID
* return objects of the requested subtype
* ensure type safety

---

📌 **Resolution Flow**

```text
Saved IDs
   │
   ▼
["weapon_sword", "armor_iron"]
   │
   ▼
IdRegistry
   │
   ▼
[Weapon, Armor]
```

---

# Guarantees

`IdRegistry` enforces several guarantees to keep game state consistent.

| Guarantee                | Description                        |
| ------------------------ | ---------------------------------- |
| Unique IDs               | Each ID must exist only once       |
| Deterministic resolution | IDs always map to the same object  |
| Type safety              | Subtype filtering is enforced      |
| Fail-fast behavior       | Invalid IDs cause immediate errors |

---

# Failure Behavior

If an ID cannot be resolved, an exception is thrown.

Example:

```kotlin
assertThrows<IllegalArgumentException> {
    registry.mapIds<EquippableItem.Weapon>(
        listOf("unknown_id")
    )
}
```

This prevents silent corruption in:

* save files
* data files
* gameplay systems

Failing early ensures that invalid data is caught immediately.

---

# Example Test

```kotlin
@Test
fun `should correctly map items`() {

    val items = listOf(sword, armor, consumable)

    registry.loadRegistry(items)

    val weapons: List<EquippableItem.Weapon> =
        registry.mapIds(listOf(sword.id))

    assertContentEquals(listOf(sword), weapons)
}
```

---

# How It Fits Into Game Architecture

`IdRegistry` connects **static content definitions** with **runtime game state**.

---

📌 **Architecture Overview**

```text
Data Files
 (JSON / TOML)
      │
      ▼
Parsed Objects
      │
      ▼
IdRegistry
      │
      ▼
Runtime Systems
      │
      ▼
Save Files store only IDs
```

This separation keeps:

* definitions centralized
* save files lightweight
* runtime data consistent

---

# Intended Use Cases

The registry can be used for any **ID-addressable domain object**.

Examples:

* items
* skills
* NPC definitions
* dialogue nodes
* crafting recipes
* abilities

Any system where objects are **referenced by ID** can benefit from the registry.

---

# Design Notes

The registry is intentionally minimal.

It:

* does **not load JSON**
* does **not handle persistence**
* does **not manage save files**
* does **not perform migrations**

Its only responsibility is:

```
ID → definition resolution
```

This keeps the system deterministic and easy to reason about.

---

# Best Practices

### Treat Definitions as Immutable

Definitions loaded into the registry should not change at runtime.

Example:

```
Weapon definition → immutable
Player weapon durability → runtime state
```

Runtime state should be stored elsewhere.

---

### Save Only IDs

Save files should store **only IDs**, never full definitions.

Example:

```json
{
  "inventory": ["weapon_sword"]
}
```

---

### Load Registry Before Resolving Saves

The registry must be populated before resolving saved data.

Typical startup flow:

```text
Load data files
     │
     ▼
Populate IdRegistry
     │
     ▼
Load save file
     │
     ▼
Resolve IDs into objects
```

---

# Summary

`IdRegistry` provides a simple but powerful way to map IDs into runtime objects.

```
id → definition
```

This pattern allows games to:

* keep save files small
* avoid duplicated data
* maintain consistency between data files and runtime state

The registry acts as the bridge between:

* **static content definitions**
* **runtime systems**
* **save data**