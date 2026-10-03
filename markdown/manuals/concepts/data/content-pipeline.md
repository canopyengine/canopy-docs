# Content pipeline

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
