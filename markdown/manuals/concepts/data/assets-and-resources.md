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
typed texture/audio loader in the enabled core. Typed resources use the optional
`ResourceManager` service described below, while file handle APIs remain unchanged.

## Typed loading with custom assets

A loaded resource can be a parsed configuration, a simulation dataset, or a
backend object. Implement `CanopyAsset` and register an `AssetLoader<T>` in the
existing `io.canopy.engine.data.assets` package. Loaders receive an immutable
`AssetKey<T>` and run synchronously on the serialized lifecycle thread.

```kotlin
import kotlin.time.Duration.Companion.seconds
import io.canopy.engine.core.managers.manager
import io.canopy.engine.data.assets.AssetsManager
import io.canopy.engine.data.assets.CanopyAsset
import io.canopy.engine.data.assets.ResourceManager
import io.canopy.engine.data.assets.assetKey

class RulesAsset(val text: String) : CanopyAsset {
    override fun close() = Unit // Parsed immutable data needs no backend cleanup.
}

val Rules = assetKey<RulesAsset>("config/rules.toml")

app.managers {
    +ResourceManager(idleTimeout = 3.seconds).apply {
        registerLoader<RulesAsset> { key ->
            require(key.parameters.isEmpty()) { "RulesAsset does not support options" }
            val entry = manager<AssetsManager>().loadFile(key.path, key.source)
            RulesAsset(entry.readText())
        }
    }
}
```

Register the service explicitly in the app's manager builder. Earlier built-in
screen and scene startup callbacks can already acquire assets; the resource
manager's first `onEnter()` preserves those values and valid leases. Headless
applications can register in-memory loaders that need no file/backend service.
No default resource manager, built-in text/binary/graphics/audio loaders, desktop
backend changes, or automatic screen-visit ownership are installed by this API.

Loader selection uses the exact declared Kotlin class. Register under an
interface type when keys request that interface; a concrete-type loader does
not satisfy a key for its base type. Duplicate loader registration is rejected.
Missing loaders and failed loads leave no cached value. The loader cleans up
any partial allocations if construction fails. Recursive loading of the same
key is rejected, while a loader can acquire other keys explicitly.
Each successful uncached load transfers exclusive disposal ownership to its cache
entry. Return fresh or independently disposable values across different keys and
managers; returning one shared singleton under independent keys can close it while
another entry still owns it.

## Immutable resource keys and options

`assetKey<T>(path, source = FileSource.Internal, parameters = emptyMap())`
identifies a resource using the exact declared class, raw path, source, and
string parameters. Equal keys share a cached value within one manager; changing
any component creates a separate entry. Paths are not implicitly normalized.

The parameter map is defensively copied and unmodifiable; non-string or null keys
and values from Java raw maps or unchecked casts are rejected. Loaders validate their
supported options. For example, `parameters = mapOf("encoding" to "UTF-8")`
can describe an application loader's decoding mode. Adapter helper functions
can encode typed options into this map without retaining arbitrary user objects
in node delegates. Generic type arguments inside a class are erased by the JVM.

## Node and behavior ownership

Manual construction needs explicit lifetime cleanup:

```kotlin
val entry = manager<AssetsManager>().loadFile("config/rules.toml")
val rules = RulesAsset(entry.readText())
node.onDestroy { rules.close() }
```

That creates separate values for each consumer. A resource delegate shares
loading and tracks each node's ownership automatically:

```kotlin
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.data.assets.asset
import io.canopy.engine.data.assets.resources

class Level(name: String) : Node<Level>(name) {
    val rules by asset(Rules)

    override fun onEnterTree() {
        resources { preload(Rules) }
    }
}

// Equivalent declaration without a separate key:
// val rules by asset<RulesAsset>("config/rules.toml")
```

The final `AssetDelegate<T>` stores only immutable key metadata; loaded values
and leases live in engine-owned lifetime state. It is accepted by the node-state
compiler and runtime validation. Behaviors use the same `asset` and `resources`
factories, resolving against their node. A behavior without a node has no owner.

First access or preload acquires once for that node/key. Other properties with
an equal key and that node's behavior reuse the same owner slot. Preloading a
value and then reading its delegate does not add a second lease or load. If a
later preload fails, earlier successful preloads remain owned; the handler is
not an implicit transaction.

Two entered `Level` nodes reading `Rules` share one loaded `RulesAsset`. Removing
one releases only its ownership; the other can continue reading the value.
Removing the final owner makes the value idle. With the default zero timeout,
the manager closes it immediately. With a positive timeout, it remains cached
until expiry or manager shutdown.

Acquisition requires valid entered membership. Constructor and detached access,
and acquiring a new key while exiting, fail descriptively. Previously acquired
values remain readable in normal node/behavior exit hooks and `onRemoval`
callbacks. The engine clears owner slots and releases all handles after those
callbacks, even if callbacks or disposal fail. Entered reparenting retains
ownership; exit and re-entry release and reacquire. If a loader removes,
destroys, or exits and re-enters its owner, the engine rejects installation and
releases the newly acquired handle. Permanent destruction rejects every asset
read with `NodeDestroyedException`, including from exit callbacks.

## Explicit leases and idle expiration

Application and screen objects can manage ownership with explicit leases:

```kotlin
manager<ResourceManager>().acquire(Rules).use { lease ->
    val rules = lease.value
    processRules(rules.text)
}
```

`AssetLease.value` returns a borrowed resource while that lease and manager are
valid. `close()` releases exactly once, including after failed disposal; repeated
closure is harmless. Access after lease closure or manager shutdown fails.
Consumers must not call `close()` on the shared resource themselves. Holding a
raw Kotlin reference does not extend ownership or make it safe after disposal;
the engine does not track arbitrary application references.

`ResourceManager(idleTimeout = Duration.ZERO)` disposes on final release. A
positive timeout must be finite and nonnegative, and starts at final release,
not load time. Reacquiring before its deadline cancels expiry. If acquisition
happens at or after the deadline before a sweep, the expired value is disposed
and loaded again. Expiration uses monotonic real time, so paused frames with
zero gameplay delta still expire idle values. Disposal runs on manager frames
and lifecycle operations, without a worker thread or timer.

Manager shutdown invalidates all leases before attempting resource disposal in
reverse successful-load order, even if owners remain. Every disposal is attempted;
the first failure is rethrown with later failures suppressed. Registration and
acquisition during shutdown, and acquisition during user disposal callbacks,
are rejected. Re-entry after completed shutdown opens a fresh cache generation
with retained loader configuration; old leases never become valid again. The
[manager registry](../core/managers/managers.md) attempts every service's cleanup
even if an earlier manager fails.


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
