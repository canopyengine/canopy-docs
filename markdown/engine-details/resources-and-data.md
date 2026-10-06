<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Resources, serialization and persistence design

AssetsManager resolves backend file handles; ResourceManager owns loaded disposable objects. Parsing and saving use
file interfaces and codecs without acquiring scene-tree ownership implicitly. These boundaries keep platform I/O
separate from engine caches and data formats.

## Files and resource identities

AssetEntry exposes file metadata and reading; WritableAssetEntry adds writing. The backend interprets FileSource and
options. File handles do not imply file contents are loaded or resources are leased.

Terminal classpath handles retain their source semantics even when lookup finds no URL: missing resources remain
missing and reads fail without a working-directory fallback. Classpath writes are rejected regardless of URL presence;
choose an explicitly writable source for saves. Reading a classpath URL closes the stream on success and failure.
Classpath directory enumeration is unsupported: isDirectory is false and list returns an empty list.

AssetKey identifies a loaded resource by exact declared class, raw path, source and copied immutable string parameters.
Paths are not normalized and JVM generic arguments are erased. Each exact class has one registered loader; registering a
second loader fails. ResourceManager installs no default loaders or backend dependencies.

acquire loads synchronously once per key and returns an AssetLease. Same-key recursive loading and acquisition during
cleanup fail. Loader errors propagate; the loader is responsible for partial allocations. If loading returns the wrong
type or shutdown invalidates its generation, the produced object is closed and the acquisition fails.

## Ownership and disposal

Leases count explicit owners and borrow a value through the manager. Closing a lease is idempotent. Final release
immediately disposes by default; a configured finite nonnegative idle timeout instead starts monotonic real-time expiry.
Frame cleanup and late reacquisition evict expired entries even during pause. Reacquisition cancels the idle state.

AssetDelegate stores only a key. Reads/preloads for a node share one lease slot per node/key. First acquisition requires
entered membership and no ongoing exit. Existing slots remain readable during normal exit callbacks; destruction
invalidates gameplay access. The slot checks entry generation after acquisition and closes a handle if its owner left
while loading. Tree exit releases slots and re-entry reacquires them.

Outside nodes, callers acquire and close leases explicitly; a global lookup of ResourceManager does not own its assets.
Shutdown invalidates every lease before attempting reverse-load-order disposal, aggregates failures and clears entries.
Re-entry creates a new cache generation while preserving loaders. Startup acquisitions made before first entry survive
that first entry. All resource operations are confined to the serialized lifecycle thread.

## Codecs and save modules

Json and Toml wrap Kotlin serializers and file interfaces. Their default discriminator is type; caller configuration is
applied last. JSON ignores unknown keys and pretty-prints by default; TOML ignores unknown keys and omits explicit nulls.
Parsing and codec errors propagate. Writing overwrites entries rather than appending.

SaveManager maps named destinations and numeric slots to writable entries. SaveModule supplies an id, serializer,
onSave and onLoad; a destination file is an object keyed by module ids. Missing registries, destinations, files or module
payloads can be skipped during load. Successfully decoded modules update their cached data and invoke onLoad in order;
there is no transaction rollback across callbacks. loadData selects an exact decoded runtime class. Duplicate module ids
are an application contract, not a registration-time uniqueness check. cleanModules removes the destination's modules.

IdRegistry loads explicit lists or recursively collected JSON files and indexes IdEntry by id. Duplicate ids throw after
previous additions have already occurred; imports are not atomic. mapIds returns the stored instances and applies its
handler to them, rather than copying them. Missing requested ids fail. The registry exposes mutable storage and is not
thread-safe. Content pipeline pages describe application conventions, not an automatic compiler/import service.

## Verification

ResourceManagerTests and AssetDelegateTests cover key sharing, invalid acquisition, idle eviction, shutdown and node
ownership. SaveManagerTests and IdRegistryTests use in-memory entries for serialization, destinations and duplicate ids.
See [Assets and resources](../manuals/concepts/data/assets-and-resources.md),
[Serialization](../manuals/concepts/data/parsing-and-serialization.md),
[Saving](../manuals/concepts/data/saving-and-loading.md) and [Registries](../manuals/concepts/data/id-registry.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
