<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Content pipeline

The **content pipeline** is the path from a file you can edit to data your game
can use. Start with a small configuration file, decode it into a Kotlin value,
and let your nodes or services consume that value.

These steps are an application pattern built from Canopy's data helpers.

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

# Runtime vs Authoring Data

The content pipeline separates **authoring data** from **runtime objects**.

| Authoring Data      | Runtime Data     |
| ------------------- | ---------------- |
| JSON / TOML files   | Kotlin objects   |
| human-editable      | engine-friendly  |
| stored in resources | stored in memory |

This separation makes it easier to:

* tune values in external files without changing Kotlin code
* rebuild classpath resources when bundled configuration changes
* manage large datasets
* build tools for content creation


---

# Working with the Current API

A content pipeline is an application pattern using existing Canopy utilities;
there is no standalone pipeline manager or importer in 0.1.0-dev2.

```text
resource file -> AssetsManager -> Json/Toml -> Kotlin data -> game systems
```

1. Author configuration in `src/main/resources`.
2. Resolve it with `AssetsManager.loadFile(path, FileSource.Classpath)` in a
   terminal application.
3. Decode with `Json.fromFile<T>(entry)` or `Toml.fromFile<T>(entry)`.
4. Validate application constraints, then store values or register ID entries.
5. Provide values to nodes through Context or services through managers.

IDRegistry file sources contain JSON **arrays** of IdEntry values, whose domain
and name derive a stable ID. Lookups use `registry.map[id]` or `mapIds`; saved IDs
are not automatically resolved by parsers or SaveManager.

The committed ecosystem demo demonstrates TOML loading and context lookup.
It does not yet implement spawning, animal behavior, commands or narration.
Classpath edits require rebuilding/reloading application resources; hot reload
and graphical asset import are not implemented by this workflow.

See [assets](assets-and-resources.md), [parsing](parsing-and-serialization.md),
[registries](id-registry.md), and [saves](saving-and-loading.md).


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

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
