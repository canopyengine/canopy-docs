# Assets and resources

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
