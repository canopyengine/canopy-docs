<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Assets and resources

A resource file might contain a world's starting conditions, a list of items or
an application's settings. **AssetsManager** gives your code a backend-neutral
way to locate that file before a parser turns its contents into useful data.

---

# Mental Model

The AssetsManager is responsible for **locating file handles**. Reading the handle loads its contents.

```
File System
     │
     ▼
AssetsManager
     │
     ▼
Game Systems
```

📌 **Diagram — Asset Loading Pipeline**

<!-- DIAGRAM: asset-loading-pipeline -->


---

# Working with the Current API

Import `AssetsManager`, `AssetEntry`, `WritableAssetEntry` and `FileSource`
from `io.canopy.engine.data.assets`.

```kotlin
import io.canopy.engine.core.managers.manager
import io.canopy.engine.data.assets.AssetsManager
import io.canopy.engine.data.assets.FileSource

fun readConfiguration(): String {
    val entry = manager<AssetsManager>().loadFile("config.toml", FileSource.Classpath)
    return entry.readText()
}
```

`loadFile(path, source, customOptions)` resolves a handle, not its contents.
`FileSource` is a top-level enum with Internal, External, Classpath, Local and
Absolute. Location semantics depend on the backend. TerminalApp supplies
TerminalAssetsManager; HeadlessApp does not provide it automatically.

AssetEntry exposes path, name, extension, isDirectory, exists(), readBytes(),
readText() and list(). WritableAssetEntry adds writeBytes/writeText with
`append = false` by default. The generic handle has no `child()` API.
Not every loaded handle is writable; explicitly choose a supported writable
backend entry for saves. Classpath resources must be treated as read-only.

Operations are synchronous and propagate backend errors. There is no general
typed texture/audio cache or automatic asset unloading API in the enabled core.


---

# Best Practices

### Organize assets clearly

Group related files into directories such as:

```
config/
enemy/
textures/
audio/
```

---

### Keep configuration data external

Store gameplay parameters in files rather than hardcoding them.

---

### Load assets once

Avoid repeatedly loading the same files during gameplay.

---

### Separate assets from code

Keeping assets external allows games to be **more flexible and easier to maintain**.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
