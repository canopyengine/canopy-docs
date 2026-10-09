<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Data overview

Games need more than objects in a scene. They need **configuration**, authored
content, changing runtime values and sometimes a way to pick up where the player
left off. The data layer supplies the pieces for those workflows.

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

These categories describe application data; supported helpers currently cover file handles, JSON/TOML, registries and saves. Texture, audio and shader processing belong to future graphical work.

---

📌 **Diagram — Game Data Layers**

<!-- DIAGRAM: data-layer-overview -->


---

# Working with the Current API

Canopy 0.1.0-alpha.1 supplies synchronous file handles, JSON/TOML serialization,
ID registries and modular JSON saves. The full API overview is in
[data systems](data.md).

Use [assets](assets-and-resources.md) to access configuration, then
[parsers](parsing-and-serialization.md) to decode it. Provide values through
Context or managers. Keep persisted payloads separate from runtime nodes.
There is no YAML parser, automatic content importer, hot reload or supported
texture/audio loader in the enabled engine platforms.


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

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
