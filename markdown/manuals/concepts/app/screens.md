# Screens

`Screen` and `ScreenManager` are in `io.canopy.engine.app`.
Screens group application states; a screen can install a scene, but it is not a node.

```kotlin
import io.canopy.engine.app.Screen
import io.canopy.engine.app.screens
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.platforms.terminal.app.terminalApp

class GameScreen : Screen() {
    override fun onEnter() {
        EmptyNode("World").asSceneRoot()
    }
}

fun main() = terminalApp {
    screens { start(GameScreen()) }
}.launch()
```

The registry DSL supports `screen(instance)`, `+instance`, `-Type::class`,
`start<Type>()` for registered types and `start(instance)` to register and start.
Screens are registered by concrete class; another instance of the same class
replaces the registration. Starting an unregistered type fails.

## Actual lifecycle

Navigation to a different instance calls the previous screen's `onExit()`, then
the target's `onEnter()`. Starting the current instance is a no-op. `onEnter()`
can run again when returning to a screen; there is no one-time `setup()` callback.
Only the current screen receives update, physics-update and resize callbacks.

`Screen` declares `onActive()` and `onInactive()`, but the current manager does
not dispatch them. Teardown exits the current screen and then all registered
screens, so the current screen can receive `onExit()` twice. Keep cleanup
idempotent. A screen exit does not automatically remove its scene; scene
replacement belongs to [SceneManager](../core/nodes/scene-manager.md).
