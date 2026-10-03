# Scenes

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
