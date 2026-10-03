<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Screens

Screens represent **high-level application states**: a main menu, gameplay,
settings or a loading screen. A screen can choose the scene tree for that state
and keep the application-level callbacks together.

![How screens fit between the app and scene tree](assets/screens-img1.png)

---

# Working with the Current API

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

## Lifecycle: entering, being active and leaving

Think of navigation as a visit to a screen. A registered instance can be visited
more than once; its callbacks bracket each visit.

| Moment | Callbacks, in order |
| --- | --- |
| Start a different screen | Previous `onInactive()`, previous `onExit()`, target `onEnter()`, target `onActive()` |
| Start the current instance | None â€” this is a no-op |
| Remove or replace the active instance | `onInactive()`, then `onExit()`; current becomes null |
| Shut down | Active `onInactive()`, then `onExit()`; clear all registrations |

`onEnter()` runs again when returning to a screen. Use it for visit setup, and
`onExit()` for the corresponding cleanup. A screen that was never started does
not receive exit callbacks, and an earlier visit is not exited a second time at
shutdown. Only the current screen receives update, physics-update and resize
callbacks. Registering the same instance again leaves its visit untouched;
registering a replacement ends the old visit but does not start the new one.

`current` is cleared before leaving callbacks and points to the target during
entering callbacks. Navigation from `onEnter()` is supported; if it redirects,
the screen that already left does not receive a late `onActive()`. Screen
navigation and registration changes from `onInactive()` or `onExit()` fail with
`IllegalStateException`, preventing overlapping teardown. If `onInactive()`
throws, `onExit()` still runs. The first failure propagates to the caller, with
an additional exit failure attached as a suppressed exception.

A screen exit does not automatically remove its scene. Scene replacement belongs
to [SceneManager](../core/nodes/scene-manager.md).

---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
