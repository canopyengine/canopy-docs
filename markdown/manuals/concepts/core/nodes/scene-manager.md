<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Scene manager

The **Scene Manager** keeps track of the active scene and coordinates the
systems that process it. When your game moves to a different world, it is the
place where the old tree leaves and the new tree begins its lifecycle.

---

# Mental Model

At runtime, the engine processes **one active scene tree**.

The Scene Manager holds the root of that tree and drives the update loop.

📌 **Diagram — Runtime Scene Structure**

<!-- DIAGRAM: runtime-scene-structure -->

Every node in the scene is a descendant of the root node.


---

# Working with the Current API

`io.canopy.engine.core.managers.SceneManager` owns `currScene`, phase-ordered
systems and group indexes. Applications install this manager automatically.
Use `manager<SceneManager>()` after registration to access it.

## Scene replacement

Assigning `currScene` or calling a node's `asSceneRoot()`:

1. Exits and unregisters the old subtree.
2. Changes the root pointer and emits `onSceneReplaced`.
3. Registers and builds the new subtree.

The replacement event runs **before** the new tree finishes building; listeners
must not treat it as an `onReady` notification. Assign null to clear the scene.

## Update phases

Frame traversal is `FramePre` systems, node update, `FramePost` systems.
Physics traversal is `PhysicsPre`, node physics update, `PhysicsPost`.
`EngineLoop` supplies fixed-step physics dispatch separately from frame updates.
Systems within a phase are ordered by ascending priority. Each phase snapshots
its system list at dispatch; node processing snapshots each system's matches.

System methods are `addSystem`, `removeSystem(KClass)`, `getSystem(KClass)` and
`hasSystem(KClass)`. There is one system per concrete class.

### Bringing a system into a running world

A system can join a scene that already exists. When the manager has entered,
`addSystem` calls `onRegister()` first, then adds existing nodes matching the
manager's assignable-type index. Future nodes join through the usual registration
path. Repeated registration of the same node does not duplicate its match or its
`onNodeAdded()` callback.

Before manager entry, system initialization and matching are deferred. Entry
calls `onRegister()` before backfilling the indexed scene. Configuration blocks
run on the first entry only; repeated entry while active is a no-op.

Removing a system takes it out of the manager indexes, releases its matches
through `onNodeRemoved()`, then calls `onUnregister()` if it was initialized.
The same system instance can be added again without retaining old nodes. Manager
exit performs the same match cleanup and unregister callbacks once. It retains
the scene and system configuration; re-entry initializes and backfills them
again. Cleanup attempts all matching-node removals and initialized-system hooks,
even if one throws; the first failure is rethrown with later failures suppressed.
These operations belong on the serialized lifecycle thread.

Use a `SceneManager { addSystem(MySystem()) }` constructor block in custom hosts.
The current `App.sceneManager` helper is a member extension inside SceneManager,
not a top-level application DSL. TerminalApp installs `InputSystem` itself.

## Groups and resize

Node group edits update manager indexes. `signalGroup(name) { node -> ... }`
broadcasts to members and fails if the group does not exist. It does not snapshot
the group list; avoid editing that list during a broadcast.

`sceneSize` is a `Signal<Vector2>` initialized to zero. Every resize first stores
the new width and height, then emits `onResize`, so listeners can read the current
dimensions. Equal dimensions do not produce a signal change; the resize event
still fires for every call. Manager exit unregisters systems but does not itself
clear the scene.
Keep all tree, group and system operations on the serialized lifecycle thread.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
