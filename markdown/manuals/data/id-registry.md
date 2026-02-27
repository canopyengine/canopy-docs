---
title: Id Registry
parent: Handling Data
nav_order: 2
permalink: /manuals/data/id-registry/
---

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Id Registry

**`IdRegistry` is a generic ID → definition resolver.**

It allows game state (e.g. save files, inventories, references inside data files) to store **only IDs**, while resolving those IDs into fully defined objects at runtime.

## 🎯 Problem It Solves

Game content is usually defined in static files:

* `weapons.json`
* `armors.json`
* `consumables.json`
* etc.

> [!NOTE]
> This also works for TOML parsing

When saving player state, storing full item definitions would:

* Duplicate data
* Inflate save files
* Make versioning fragile
* Create maintenance nightmares

Instead, save files store only item IDs:

```json
{
  "inventory": ["weapon_sword", "armor_iron"]
}
```

`IdRegistry` maps those IDs back into real objects:

```kotlin
val items: List<Item> = registry.mapIds(savedInventoryIds)
```

## 🧠 Concept

The registry maintains an in-memory mapping:

```
id -> concrete object definition
```

It does **not**:

* Load JSON itself
* Handle persistence
* Manage save files
* Perform migrations

It is purely a deterministic resolver.

## 📦 Basic Usage

### 1️⃣ Create a registry

```kotlin
val registry: IdRegistry<Item> = IdRegistry()
```

### 2️⃣ Load definitions

```kotlin
val items = listOf(sword, armor, consumable)
registry.loadRegistry(items)
```

This registers each element using its `id`.

> IDs must be unique.

### 3️⃣ Resolve IDs

```kotlin
val weapons: List<EquippableItem.Weapon> =
    registry.mapIds(listOf(sword.id))

val armors: List<EquippableItem.Armor> =
    registry.mapIds(listOf(armor.id))
```

The function is type-safe and filters by subtype.

## ✅ Guarantees

* Every ID must exist in the registry
* Resolution is deterministic
* Type-safe mapping using generics
* Fails fast if:

    * ID is missing
    * ID exists but is not of requested subtype

## ❌ Failure Behavior

If an ID cannot be resolved, `IllegalArgumentException` is thrown.

Example:

```kotlin
assertThrows<IllegalArgumentException> {
    registry.mapIds<EquippableItem.Weapon>(listOf("unknown_id"))
}
```

This prevents silent corruption in save files.

## 🔍 Example Test

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

## 🏗 Intended Use in a Game Architecture

```
JSON definitions → parsed into objects
                      ↓
                 IdRegistry
                      ↓
 Save file IDs → resolved into runtime objects
```

The registry acts as a bridge between:

* Static content definitions
* Runtime save data
* Game systems that require full objects


## 🧩 Design Notes

* The registry is generic (`IdRegistry<T>`)
* It is domain-agnostic
* It does not enforce how IDs are structured
* It can be used for:

    * Items
    * Skills
    * NPC definitions
    * Dialogue trees
    * Crafting recipes
    * Anything ID-addressable

## ⚠️ Important Guidelines

### 1. Treat definitions as immutable

* Definitions loaded into the registry should not be mutated.

* Runtime state (e.g., durability, quantity) belongs elsewhere.

### 2. Save only IDs

* Never serialize full definitions into save files.

### 3. Load registry before save resolution

* The registry must be populated before resolving player data.
