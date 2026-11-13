# Host lifecycle

Screen navigation changes which Node tree is active. The host lifecycle describes
what happens to the application window or OS execution. They are separate: hiding,
minimizing or suspending an App does not leave its screen or rebuild its Nodes.

Think of minimizing a game as putting a book down with a bookmark in place.
Navigating to another screen changes the page; closing the App puts the book away.

## Choose automatic pausing

Configure the policy before launching:

```kotlin
terminalApp {
    initialScreen<Aquarium>()
    lifecycle {
        pauseWhenUnfocused = false
        pauseWhenMinimized = true
        pauseWhenHidden = true
    }
}.launch()
```

This shows the default policy. These options apply only when a host can report
the corresponding state; they do not add window-event support to a platform.
The current terminal library does not report window focus, minimization or hiding,
and headless hosting has no window. Neither guesses those states. Future graphical
hosts can report them through the shared contract below.

| Host state | Shared behavior |
| --- | --- |
| Unfocused | Ignore input; discard queued input, held backend snapshots and pointer hover. Continue simulation by default. |
| Minimized or hidden | Suppress drawing/presentation. Pause gameplay by default; opt out to keep an idle game simulating. |
| Suspended by the OS | Stop all frame and physics processing, including Always and WhenPaused Nodes. Retain the screen. |
| Restored | Accept input when focused/visible, refresh viewport dimensions and repaint. |
| Closed | The host requests normal App shutdown; retained screens are destroyed. |

Manual pause and automatic pause are independent. `pause()` records the player's
pause; `resume()` clears that request. A minimized game can remain paused after
`resume()` because the host policy still applies. Restoring the window never
clears a manual pause. Overlapping automatic causes also remain independent.

Automatic gameplay pause uses the existing [Node process modes](../core/nodes/nodes.md).
Always and WhenPaused Nodes can still process while minimized/hidden. Full OS
suspension stops them too. The first frame after suspension uses zero delta to avoid
charging background time to gameplay; earned physics fractions remain available.

Hiding a Node is different from hiding the host: Node visibility does not change
App pause or navigation. Use process modes or explicit gameplay logic when a hidden
Node should also stop processing.

## Observe a change

```kotlin
onHostStateChanged { state ->
    // Input and presentation rules already reflect state here.
    // state.focused, state.visible, state.minimized, state.suspended
}
```

This App callback replaces the previous callback, like `onResize`. Equal host-state
notifications do not call it again. Use `app.hostState` for the latest reported state
and `app.isPaused` for effective gameplay pause. The callback does not replace Node
entry/exit hooks; those still describe tree membership.

## Implementing a host

Hosts report native events on their lifecycle thread after EngineLoop entry,
outside entry, frame and shutdown dispatch:

```kotlin
app.engineLoop.hostStateChanged(app.hostState.copy(focused = false))
app.engineLoop.hostStateChanged(app.hostState.copy(minimized = true))
app.engineLoop.hostStateChanged(app.hostState.copy(suspended = true))

// Restore only the state reported by this event.
app.engineLoop.hostStateChanged(app.hostState.copy(suspended = false))
app.engineLoop.update(deltaSeconds)
```

`HostState` is an immutable snapshot. Preserve unrelated fields with `copy` rather
than treating one restored flag as a full reset. Unsupported fields keep defaults.
LibGDX headless pause/resume callbacks forward suspension, without inventing window
state. Terminal hosting preserves its existing native input and shutdown behavior.

App coordinates input eligibility, pause policy, UI draw suppression and viewport
refresh. Its protected `afterHostStateChanged(previous, current)` hook lets a host
invalidate its native surface or update input reporting. The terminal host uses it
to suppress surface output and force repaint on return. `beginFrame`/`presentFrame`
are skipped while hidden, minimized or suspended; input preparation and updates can
continue while merely hidden, according to policy.

A resumed host must reset its own wall-clock baseline where possible. EngineLoop
also ignores the first resumed frame's delta, preserving prior physics remainders.
Hosts must keep native close handling routed through ordinary App shutdown, including
when suspended. Notification failures use normal EngineLoop failure reporting and
host teardown; game side effects are not rolled back.
