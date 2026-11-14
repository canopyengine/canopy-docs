# Screens

A screen is an ordinary Node tree used as a destination: a menu, an aquarium or
results. **ScreenManager navigates; Nodes contain the game.** There is no Screen
superclass, registration table or wrapper to define first.

## Choose the first screen

```kotlin
import io.canopy.engine.app.initialScreen
import io.canopy.engine.app.navigateTo
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.ui.UiRoot
import io.canopy.platforms.terminal.app.terminalApp

class Aquarium : Node<Aquarium>("Aquarium") {
    var score by signal(0)

    override fun nodeInit() {
        UiRoot {
            Column {
                Text("Score: $score")
                Button("Earn a point") { score++ }
                Button("Results") { navigateTo<Results>() }
            }
        }
    }
}

class Results : Node<Results>("Results") {
    override fun nodeInit() {
        UiRoot {
            Column {
                Text("Round complete")
                Button("Return") { navigateTo<Aquarium>() }
            }
        }
    }
}

fun main() = terminalApp {
    initialScreen<Aquarium>()
}.launch()
```

`initialScreen()` selects a class without constructing it immediately. The root
is created after the App's managers and presentation backend are available,
before the App's `onEnter` callback. Configure it before launching the App.

## Navigate, reload and unload

Import the helpers from `io.canopy.engine.app`. They work on the running App
and on entered Nodes belonging to that App:

```kotlin
navigateTo<Aquarium>()          // Open or resume.
navigateTo(Aquarium::class)     // Same operation with a class reference.
reloadScreen()                 // Recreate the current tree.
unloadScreen<Results>()        // Release an inactive cached tree.
```

The first navigation constructs the root. Leaving detaches it; returning reuses
that same tree and its state. Starting the current screen does nothing. There
is one cached instance per requested class, owned by this App.

Reload destroys the current instance and recreates it. Unload only releases an
inactive instance; it never constructs anything and remembers how to create it
again. To unload the current screen, navigate away first, or use reload instead.
App shutdown destroys active and inactive trees. Successive Apps do not share them.

Managers can hold data that survives screen changes or reloads. Context data
follows its provider's scope. Reloading a screen does not reset a shared manager.

## Constructor arguments

A public no-argument constructor works automatically. A constructor needing
arguments can use an ordinary factory, wherever navigation is requested:

```kotlin
navigateTo<Aquarium> {
    Aquarium(columns = 40, rows = 12)
}
```

This example assumes an Aquarium constructor accepting those arguments. The
factory only runs when a new instance is needed; passing another factory does
not update a cached instance. ScreenManager remembers the successful creation
factory for reload and later visits after unload.

Capture stable values or App-owned services in remembered factories. A factory
that reads fields from an old, destroyed Node cannot safely recreate a screen.
Use managers and existing dependency injection for shared game data.

## Lifecycle and timing

There is one lifecycle to learn: the [Node lifecycle](../core/nodes/nodes.md).
`nodeInit()` builds once per instance. Entry/readiness callbacks run again when
returning; exit ends the visit. Inactive cached trees do not update, draw or
receive input. Visit-owned listeners and jobs are cleaned up on exit; establish
connections in entry callbacks when they must be recreated on return. Declarative
UI bindings resume through the existing re-entry handling.

Navigation requests wait until updates finish, before UI painting and host
presentation. The calling Node remains valid for the rest of its callback. The
latest request in that frame wins. Requests made during destination entry wait
for the next boundary instead of recursively changing trees.

Factories run in a detached construction boundary. If creation fails, the old
screen stays selected and partial Nodes are released. Uncaught errors still
follow normal App failure handling. Activation or cleanup failure attempts all
cleanup and preserves the original cause; arbitrary game side effects are not rolled back.

Responsive Nodes can read `sceneManager.sceneSize()` when entering and subscribe
to `sceneManager.onResize`. UI layouts already use the current viewport. Rendering
stays in SceneManager, UiManager and the platform backend; screens do not choose renderers.

## Migrating from Screen controllers

- Replace `class GameScreen : Screen()` with an ordinary Node root, or navigate
  directly to the existing World class.
- Replace `screens { start(GameScreen()) }` with `initialScreen<GameScreen>()`,
  supplying a factory if its constructor needs arguments.
- Replace `startScreen<T>()` with `navigateTo<T>()`. Registration and removal
  helpers are replaced by lazy class construction and `unloadScreen<T>()`.
- Move construction from Screen `onEnter()` into Node `nodeInit()`. Use Node
  entry/readiness hooks for per-visit work; there is no separate `onActive()`.
- Return control of the active root to ScreenManager. Do not call `asSceneRoot()`
  or assign `SceneManager.currScene` to replace an active screen. Add prompts and
  other children under its tree instead.

Raw scene-root operations remain available for low-level embedding without an
active screen. They do not provide screen caching. Retention avoids construction
work, but returning still performs entry, indexing and layout; measure the real
game before assuming a particular loading speed. History, automatic eviction,
background loading and multiple cached instances per class are not provided here.
