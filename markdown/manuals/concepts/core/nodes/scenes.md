<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Scenes

A **scene** brings related nodes together into a reusable piece of your game.
A menu, a level or a terminal simulation can each begin with its own root.

You build the hierarchy in Kotlin and give its root to the Scene Manager.
There is no required scene-file format to learn first.

---

# Mental Model

A **scene is simply a node tree**.

```text
Scene
└ Root Node
   ├ Player
   ├ Enemy
   └ UI
```

The **root node defines the entire scene**.

Everything inside the scene exists as children of that root.


Player, Enemy and UI are conceptual application roles in this diagram; they are
not built-in node classes in the enabled snapshot.

---

# Working with the Current API

A scene is an application-defined node tree; there is no required `Scene` base
class or scene-file format in the current engine.

```kotlin
import io.canopy.engine.core.nodes.types.empty.EmptyNode

fun makeWorld() = EmptyNode("World") {
    EmptyNode("Simulation")
    EmptyNode("Commands")
}

fun enterWorld() {
    makeWorld().asSceneRoot()
}
```

Call this after the application's managers are registered. `asSceneRoot()`
installs the tree into SceneManager. A later root replaces the previous tree;
assigning `currScene = null` clears it. Build new instances when entering a new
scene rather than assuming a previously built tree will initialize again.

[Screens](../../app/screens.md) select application states; [SceneManager](scene-manager.md)
owns node processing. `asPrefab()` marks a node to suppress automatic lifecycle
when attached; it is not a factory, deep copy, or asset loader.


---

# Best Practices

### Keep scenes focused

Each scene should represent a clear gameplay context.

---

### Use node hierarchies

Structure scenes using parent–child relationships.

---

### Separate structure and logic

Use scenes for **structure** and behaviors for **logic**.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
