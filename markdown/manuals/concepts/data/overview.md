<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Data Overview

Games rely heavily on **data** to define content, configuration, and runtime state.

Canopy provides tools to help manage different kinds of data in a structured and maintainable way.

These systems allow games to:

* load configuration and content
* parse structured files
* persist game state
* reference content safely
* build content pipelines

Together they form the **data layer** of the engine.

---

# Types of Data in a Game

Most games work with several categories of data.

| Data Type         | Description                        | Examples                  |
| ----------------- | ---------------------------------- | ------------------------- |
| **Assets**        | static files bundled with the game | textures, audio, shaders  |
| **Content Data**  | structured gameplay data           | items, enemies, levels    |
| **Configuration** | settings controlling systems       | difficulty values, tuning |
| **Runtime State** | values generated during gameplay   | player position, health   |
| **Save Data**     | persistent player progress         | save files, checkpoints   |

Each category is handled differently by the engine.

---

📌 **Diagram — Game Data Layers**

<!-- DIAGRAM: data-layer-overview -->

---

# Data Flow

Game data usually follows a predictable lifecycle:

1. **Authored** by developers in files
2. **Parsed** into structured objects
3. **Loaded** into the game at runtime
4. **Used** by gameplay systems
5. **Saved** when persistence is needed

📌 **Diagram — Data Lifecycle**

<!-- DIAGRAM: data-lifecycle -->

---

# Assets and Resources

Assets are **static files included with the game**.

Examples include:

* textures
* audio files
* shaders
* fonts
* localization files

Assets are typically stored in the `resources` directory of the project.

These files are loaded by the engine and used by systems such as rendering or audio.

---

# Content Data

Content data defines **gameplay elements and configuration**.

Examples include:

* item definitions
* enemy stats
* biome configuration
* simulation parameters

These files are often written in structured formats such as:

* JSON
* TOML
* YAML

The engine parses these files into **typed objects** used by gameplay systems.

---

# Runtime State

Runtime state represents **data generated while the game is running**.

Examples include:

* player position
* simulation state
* active quests
* inventory contents

Runtime state typically lives in memory and is updated by gameplay systems.

---

# Save Data

Save data allows runtime state to be **persisted between sessions**.

Examples include:

* save files
* checkpoints
* autosave systems

This requires **serialization**, converting runtime objects into a storable format.

---

📌 **Diagram — Save System Flow**

<!-- DIAGRAM: save-system-flow -->

---

# Identity and Registries

Many systems need a way to **reference content safely**.

For example:

* items referencing other items
* quests referencing NPCs
* worlds referencing biomes

Canopy uses **ID registries** to map identifiers to data.

Example:

```
item:iron_sword
enemy:goblin
biome:desert
```

Registries allow systems to refer to content without directly coupling to specific objects.

---

# Content Pipelines

Large projects often include a **content pipeline**.

A content pipeline transforms raw files into runtime-ready data.

Typical steps include:

1. validating source files
2. converting formats
3. generating optimized data
4. producing runtime assets

📌 **Diagram — Content Pipeline**

<!-- DIAGRAM: content-pipeline-flow -->

---

# Related Topics

The data layer is composed of several specialized systems.

| Topic                    | Purpose                        |
| ------------------------ | ------------------------------ |
| **Assets and Resources** | loading static files           |
| **Parsing**              | converting files into objects  |
| **ID Registry**          | mapping identifiers to content |
| **Serialization**        | converting objects into data   |
| **Saving and Loading**   | persisting game state          |
| **Content Pipeline**     | preparing content for runtime  |

Each of these topics is covered in detail in the following sections.

---

# Best Practices

### Keep data separate from logic

Gameplay rules should read data rather than hardcoding values.

---

### Prefer structured data files

Using structured formats makes content easier to edit and validate.

---

### Use identifiers for references

IDs allow content to reference other content without tight coupling.

---

### Separate runtime state and save data

Not all runtime values need to be persisted.

---

# Summary

The data layer of Canopy manages how games **store, load, and persist information**.

It provides systems for:

* loading assets and resources
* parsing structured content
* referencing data safely
* saving and restoring game state
* building content pipelines

These tools help developers build **data-driven games** that are easier to scale and maintain.