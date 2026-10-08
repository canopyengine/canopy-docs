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
| onExit | Final application callback after manager teardown has been attempted |

The fixed physics step comes from SceneManager and defaults to 1/60 second. EngineLoop runs fixed ticks before each
variable frame, capped at five ticks per frame by default. Use physics callbacks for fixed-step logic and onUpdate for
variable-time work. Avoid assuming every frame has exactly one physics tick.

Call app.pause() and app.resume() on the engine thread. The host keeps running and eligible scene nodes continue with
real elapsed time through ProcessMode.Always or WhenPaused. Other managers get zero frame delta and no paused physics
callbacks. Events and direct method calls are not automatically paused.

## Terminal frame output

`TerminalApp.renderFrame(lines)` copies the latest world frame and composes it with
the command prompt on the serialized lifecycle thread. In raw terminal mode, an
open prompt covers the bottom rows; world updates remain visible above it.
Closing or removing the prompt restores the latest world across those rows without
another world update. Shorter and empty frames erase previous output.

Configure its adaptive height and maximum terminal rows, including the editor row:

```kotlin
terminalApp {
    commandPanelRows = 8
    commandPanelHeightFraction = 1.0 / 3.0
}
```

The panel uses the viewport height multiplied by commandPanelHeightFraction,
rounded up and capped by commandPanelRows. The fraction defaults to one-third and
must be finite, greater than zero and at most 1. The row cap defaults to 8 and
must be positive. The panel leaves a world row when the viewport has at least
two rows; a one-row terminal shows only the editor. Set the fraction to 1.0 for
the previous fixed-cap behavior. Changes apply at the next lifecycle frame. The newest
transcript rows appear above the editor, whose long draft scrolls horizontally
at grapheme boundaries to keep the latest typing visible.

Frames are clipped to the viewport using terminal cell widths. The last column
is reserved to prevent wrapping or scrolling; newlines create rows and world or
transcript tabs use the terminal renderer's expansion. Editor tabs become spaces.
Safe ANSI SGR colors/styles are retained in world and transcript rows; the editor
uses plain text. Other control characters cannot reposition the cursor or escape
the composed surface. This changes the previous unbounded raw-string rendering behavior.
Full-screen replacement clears stale rows and can cause flicker; identical
composed frames avoid another write unless the viewport changed. Resizing
recomposes retained content even when the prompt is closed or gameplay is paused,
without requiring another renderFrame call.

Fallback line input keeps control of the terminal: there is no animated overlay
or world-frame output over its blocking editor, and no adaptive resize events. World frame copies are still
retained. Opening or closing the prompt does not pause or resume the application;
use explicit pause/resume commands or application actions.

## Responsive terminal screens

In raw mode, the terminal host forwards initial dimensions and subsequent console-size changes
to the existing app and active Screen.onResize callbacks before its next frame.
Width and height are terminal columns and rows, not pixels. SceneManager.sceneSize
is updated before its resize event runs. Screens can recompute layout from these
dimensions, including the new aspect ratio:

```kotlin
terminalApp {
    onResize { columns, rows ->
        val usableColumns = (columns - 1).coerceAtLeast(0)
        renderFrame(listOf(
            "Ecosystem: ${columns}x$rows",
            "-".repeat(usableColumns),
        ))
    }
}
```

This recomputes the divider's width after a resize. A screen can likewise update
its grid, relative positions or camera policy. Submitted text is clipped and
composed; it does not automatically become a responsive scene or declarative
layout. Shared declarative layout remains separate work.

Canopy does not own the terminal emulator's window, font size or maximize controls.
It cannot enforce a window-resize lock on the current terminal host.

## Launch and shutdown handles

launch uses the calling thread; whether it blocks depends on the backend. launchAsync starts a non-daemon launch thread
and returns AppHandle. Use suspend awaitStarted() to await initialization, requestExit() for graceful shutdown, and
join() to await teardown. Timeout overloads return a Boolean and report false for unsuccessful waits, including failure.
Untimed waits propagate lifecycle failures. A launch handle does not make node or manager access thread-safe.

forceClose invokes platform emergency behavior; without a backend callback it can halt the JVM. Prefer normal exit.
The application exit callback should not assume global managers remain registered. Registry teardown attempts every
manager cleanup and clears registrations even when a callback throws. A failure
in a shutdown hook does not skip subsequent cleanup stages. The first failure
propagates with later cleanup failures suppressed, and join observes completion
only after all stages, including the application exit callback, have been attempted.

Failed startup uses the same cleanup stages and preserves the startup error as
the primary failure. Managers must tolerate cleanup when entry never started or
did not finish. A failed application cannot be restarted. During entry, frame,
physics and resize callbacks, nested loop lifecycle calls are rejected before
state changes. Request graceful exit through `AppHandle`
instead of calling `exit()` synchronously inside a callback.

See [Screens](screens.md), [Nodes](../core/nodes/nodes.md), [Dependency lookups](../core/dependencies.md),
[Testing applications](../../guides/testing-applications.md) and [Runtime design](../../../engine-details/runtime.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
