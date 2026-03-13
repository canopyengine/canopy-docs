<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# ID Registry

Large games often contain **many pieces of content** such as items, enemies, levels, or biomes.

These systems frequently need to **reference each other**.

For example:

* an item may reference a weapon definition
* a level may reference enemy types
* a quest may reference NPCs

Instead of referencing objects directly, games typically use **stable identifiers (IDs)**.

An **ID Registry** maps these identifiers to the actual objects used at runtime.

---

# Mental Model

An ID registry acts like a **lookup table**.

```text
ID
 │
 ▼
Registry
 │
 ▼
Runtime Object
```

📌 **Diagram — Registry Lookup**

<!-- DIAGRAM: id-registry-lookup -->

Example:

```text
item:sword
enemy:goblin
biome:desert
```

Each identifier maps to a specific data object.

---

# Why Use Identifiers

Using identifiers instead of direct object references provides several benefits.

### Decoupling

Systems can refer to content without knowing how it is implemented.

### Data-driven design

Content files can reference other content safely.

### Stability

IDs remain stable even if internal implementations change.

### Serialization

Identifiers are easy to store in save files.

---

# Example Content Reference

Example enemy definition:

```toml
id = "goblin"
health = 30
weapon = "sword"
```

Here:

```
weapon = "sword"
```

refers to an entry in the **item registry**.

At runtime the registry resolves this identifier to the correct object.

---

# Registering Content

Registries typically load and register objects during initialization.

Example:

```kotlin
registry.register("goblin", enemyData)
```

Once registered, objects can be retrieved using their ID.

```kotlin
val goblin = registry.get("goblin")
```

---

📌 **Diagram — Content Registration**

<!-- DIAGRAM: registry-registration -->

```
Parsed Data
     │
     ▼
Registry registers object
     │
     ▼
ID → Object mapping
```

---

# Namespaced Identifiers

Large projects may use **namespaced identifiers**.

Example:

```
item:iron_sword
enemy:goblin
biome:desert
```

Namespaces help prevent conflicts between different types of content.

Example structure:

```
item:*
enemy:*
biome:*
```

---

# Registry Usage

Registries are commonly used for:

| Content Type | Example                   |
| ------------ | ------------------------- |
| items        | weapons, armor            |
| enemies      | enemy definitions         |
| biomes       | environment configuration |
| abilities    | gameplay actions          |
| quests       | quest definitions         |

These registries allow systems to reference content consistently.

---

# Relationship with Parsing

Registries typically store **parsed data objects**.

Typical pipeline:

```
File
 │
 ▼
AssetsManager loads file
 │
 ▼
Parser converts file
 │
 ▼
Registry stores object
 │
 ▼
Game systems reference ID
```

📌 **Diagram — Data Pipeline**

<!-- DIAGRAM: data-registry-pipeline -->

---

# Best Practices

### Use stable identifiers

Identifiers should not change once content is released.

---

### Avoid hardcoded references

Systems should use registry lookups rather than direct object references.

---

### Use namespaces

Namespacing helps prevent identifier collisions in large projects.

---

### Keep registries focused

Create separate registries for different types of content.

Example:

```
ItemRegistry
EnemyRegistry
BiomeRegistry
```

---

# Summary

An **ID Registry** maps identifiers to runtime objects.

```text
ID → Registry → Object
```

This system allows games to:

* reference content safely
* build data-driven systems
* decouple gameplay logic from data
* support stable serialization

Registries are a key part of building **scalable content systems**.

---

# Related Topics

* **Parsing Overview** — converting files into objects
* **Assets and Resources** — loading files from the project
* **Serialization** — converting objects into storable data
* **Saving and Loading** — persisting game state