<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Application lifecycle

An application supplies the runtime around your scene: manager configuration, startup, frame/physics callbacks and
shutdown. Terminal and headless are enabled platforms in this snapshot. Desktop is excluded and is not a runnable
starting point.

## Configure before launching

```kotlin
import io.canopy.engine.app.AppConfig
import io.canopy.engine.core.managers.Manager
import io.canopy.engine.core.managers.SceneManager
import io.canopy.engine.core.managers.manager
import io.canopy.engine.core.nodes.types.empty.EmptyNode
import io.canopy.platforms.headless.app.headlessApp

class Session : Manager {
    var elapsedSeconds = 0f
    override fun onUpdate(delta: Float) {
        elapsedSeconds += delta
    }
}

fun main() {
    val app = headlessApp {
        config(AppConfig(title = "Simulation", fps = 60))
        managers { +Session() }
        onEnter {
            manager<SceneManager>().currScene = EmptyNode("World")
        }
    }
    app.launch()
}
```

The builder configures the app; it does not start it. Headless launches a simulation host without a window. Use
terminalApp from io.canopy.platforms.terminal.app for interactive terminal input, file access and command prompts.
Platform managers plus InjectionManager, ScreenManager and SceneManager are installed before the app's onEnter.
ResourceManager and custom services must be explicitly registered when needed. Replacing managers or callback
configuration blocks replaces the previous block; compose related configuration in the same block.

## Callbacks and time

| Callback | Behavior |
| --- | --- |
| onEnter | After managers have entered; create the initial scene or navigate screens |
| onPhysicsUpdate | Fixed-step gameplay callback, skipped while paused |
| onUpdate | Once per host frame; seconds, zero while paused |
| onResize | After managers receive dimensions |
| onExit | Final application callback after normal manager teardown |

The fixed physics step comes from SceneManager and defaults to 1/60 second. EngineLoop runs fixed ticks before each
variable frame, capped at five ticks per frame by default. Use physics callbacks for fixed-step logic and onUpdate for
variable-time work. Avoid assuming every frame has exactly one physics tick.

Call app.pause() and app.resume() on the engine thread. The host keeps running and eligible scene nodes continue with
real elapsed time through ProcessMode.Always or WhenPaused. Other managers get zero frame delta and no paused physics
callbacks. Events and direct method calls are not automatically paused.

## Terminal frame output

`TerminalApp.renderFrame(lines)` clears the whole screen and presents a new frame.
This simple replacement can increase flicker compared with updating individual rows. Shorter lines,
fewer rows and an empty list clear output left by the previous frame. Rendering
is suspended while the command prompt or line-input mode owns the terminal.
Call it from the serialized lifecycle thread.

## Launch and shutdown handles

launch uses the calling thread; whether it blocks depends on the backend. launchAsync starts a non-daemon launch thread
and returns AppHandle. Use suspend awaitStarted() to await initialization, requestExit() for graceful shutdown, and
join() to await teardown. Timeout overloads return a Boolean and report false for unsuccessful waits, including failure.
Untimed waits propagate lifecycle failures. A launch handle does not make node or manager access thread-safe.

forceClose invokes platform emergency behavior; without a backend callback it can halt the JVM. Prefer normal exit.
The application exit callback should not assume global managers remain registered. Registry teardown attempts every
manager cleanup and clears registrations even when a callback throws.

See [Screens](screens.md), [Nodes](../core/nodes/nodes.md), [Dependency lookups](../core/dependencies.md),
[Testing applications](../../guides/testing-applications.md) and [Runtime design](../../../engine-details/runtime.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
