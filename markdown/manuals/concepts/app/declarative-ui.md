# Declarative UI and responsive layout

The shared UI API lives in `io.canopy.engine.ui`. Applications install `UiManager`
and `InputFocus` through the normal application lifecycle. TerminalApp supplies a
terminal backend; headless applications can supply a recording backend or run
reactive updates without painting. No additional content wrapper is required. Construct UI nodes after the application
manager scope has entered, for example inside its onEnter callback.

```kotlin
import io.canopy.engine.core.flows.events.signal
import io.canopy.engine.ui.*

val hud = UiRoot("Hud") {
    val population = signal(3)
    val details = signal(true)

    Column(UiStyle(width = UiLength.Fill, height = UiLength.Fill, gap = 1.0)) {
        Row(UiStyle(width = UiLength.Fill)) {
            Text("Animals: ${population()}")
            Button("Add animal") { population.update { it + 1 } }
        }
        if (details()) {
            Text("The simulation keeps running while the command prompt is open")
        }
        Button("Toggle details") { details.update { !it } }
    }
}
```

Attach the root beneath an ordinary scene node, or make it the current scene.
Declaration nodes are ordinary guarded Canopy nodes. Constructors and lifecycle
initialization run once for retained identities; updates do not rerun the root
initializer. Custom stored fields on Node subclasses still require nodeProperty.

## Compiler and reactive declarations

The matching Canopy compiler plugin is required for direct reactive expressions.
It captures the expressions in Text and Button labels, container styles, and
supported element style/visibility/enabled assignments. It tracks signal and
computed reads at each affected declaration. Signal writes queue work for the
next UI update on the serialized engine thread; multiple writes coalesce.
Unrelated expressions are not reevaluated. Equal property results do not submit
another backend frame; focus changes can redraw without remeasuring text.

Conditional statements and explicitly keyed for-loops receive independent
reactive scopes. The compiler retains local signal initialization in those
scopes; it does not rerun the whole root builder. Event handlers are excluded
from declaration tracking and may write state to request a later update.
The existing compiler validation providers remain read-only; expression capture
is a separate internal transform. Ordinary node field validation is unchanged.

Keep reactive reads in the captured expression, or expose them through computed
values. A pre-evaluated local string is not itself reactive. Unsupported forms
receive a CANOPY_UI_UNSUPPORTED diagnostic rather than silently appearing live.
This initial DSL supports statement conditionals and explicitly keyed for-loops;
value-producing child conditionals and unkeyed dynamic loops are unsupported.

The compiler retains local signal/computed/effect initialization and direct
component constructors whose class declares a UiScope-taking method. Arbitrary
factory-created objects and inherited-only component factories require explicit
retention, for example `val card = remember("card") { PopulationCard(population) }`.
Use a retained local `val observer = effect { ... }` or explicit remember for
effects inside changing branches/lists; a standalone effect statement can run
again when that structural declaration is evaluated.

## Keys, identity and owned state

```kotlin
UiRoot("Animals") {
    val animals = signal(listOf("fox", "wolf"))
    Column {
        for (animal in animals()) {
            key(animal) {
                val visits = signal(0)
                Button("$animal: ${visits()}") { visits.update { it + 1 } }
            }
        }
    }
}
```

Keys must be unique within a sibling scope. Reordering keeps the same node,
local signal state and focus. Removing an identity destroys its normal owned
node subtree, subscriptions and resources; reinsertion creates fresh local
state. Hoist state to a retained parent if it must survive omission. Internal
transparent scope nodes provide ordinary node ownership rather than a second
ownership tree. Managed children cannot be imperatively added, removed,
reparented, renamed or queued for deletion; change declaration state instead.

Ordinary scene nodes may contain UI roots. Arbitrary ordinary children inside a
managed UI declaration are unsupported: ownership and layout belong to the
UI declaration list. Removal/detachment suspends UI observers and input routes;
reentry resumes them without rebuilding retained local signals. Existing
Computed and Effect objects keep their engine entry-scoped disposal contract:
removal disposes them, and reentering a retained root does not resurrect such
remembered objects. Initialize entry-scoped work through appropriate ordinary
node entry hooks when reentry is required. Permanent destruction cancels pending
UI work and releases retained declaration closures.

## Reusable components

Functions and classes can use the same declaration receiver:

```kotlin
fun UiScope.PopulationLabel(population: Signal<Int>) {
    Text("Animals: ${population()}")
}

class PopulationCard(private val population: Signal<Int>) {
    fun render(scope: UiScope) {
        with(scope) {
            Column {
                Text("Population")
                PopulationLabel(population)
            }
        }
    }
}
```

Import Signal from `io.canopy.engine.core.flows.events`. Calls at different
source sites receive distinct retained component scopes. Signals/computed
values provide live state; event callbacks carry changes back to its owner.

## Sizing and resizing

UiRoot fills its backend viewport by default. Row lays out children horizontally,
Column vertically, and Box overlaps them in declaration order. UiStyle is an
immutable value describing width, height, padding, gap, cross-axis alignment,
wrapping, clipping and optional maximum dimensions.

| Dimension policy | Behavior |
| --- | --- |
| Content | Measure content using the backend text metrics |
| Fill | Receive available space, shared with fill siblings |
| Fixed(value) | Use the specified logical units |
| Fraction(value) | Use that fraction of the available parent size |

Rows and columns recalculate allocation from both console dimensions. For
example, a Fill root with two half-width panels will adapt when a 120×40 console
becomes 60×20. Narrow text is remeasured at its allocated width so wrapping can
increase its content height. Padding and gaps reduce available child space;
clipping prevents drawing outside ancestor bounds. Backend rounding converts
logical bounds to drawable terminal cells.

The initial shared layout operates within finite viewports. Content is measured
within available space; an infinite/unbounded parent constraint API is not
provided. UiStyle is a typed immutable policy rather than an ordered modifier
chain.

Terminal logical units are columns and rows; graphical/recording backends can
use font metrics and pixels. A pixel is not treated as a terminal cell. The
terminal backend reserves its last column to prevent wrapping/scrolling and
measures Unicode graphemes using Mordant display-cell widths. Terminal-emulator
font size and window controls remain outside Canopy. There is no terminal
window-resize lock that still permits maximize.

A root's horizontalAlignment and verticalAlignment anchor it in its viewport;
End supports a bottom overlay. UiLayer separates ordinary Content from Overlay;
zIndex orders roots within their layer. Hidden mounted
nodes keep their layout space and reactive state updates; conditional omission
removes space and destroys the omitted subtree. Legacy renderFrame text remains
supported, but strings are clipped rather than automatically scaled.

## Input, focus and prompt integration

Buttons expose shared enabled/action semantics. Keyboard navigation and
activation use the shared InputFocus service; hidden, disabled or detached UI
cannot receive focus or pointer targeting. Focus stays with retained keyed
identity and releases when it becomes ineligible. UI input and presentation
remain responsive while gameplay is paused. A focused control captures gameplay
keyboard input without pausing simulation; `root.focus(null)` releases it.

The command editor is a prompt-owned retained UI root, painted above the world
as a bottom panel through the same layout and terminal primitives. Its draft,
transcript and ownership are retained across resizing. Opening it exclusively
captures command input while simulation continues; typing a letter bound to a
gameplay action does not fire that action. Explicit pause/resume controls
simulation. Closing the prompt does not resume an explicitly paused app.

General node hide/show controls rendering, separately from prompt
open/close/isOpen. A hidden prompt retains its activation/draft but does not
present or capture UI input until effective visibility returns.

## Backends and limits

UiBackend supplies drawable viewport conversion, text measurement and
begin/drawText/end primitives. Shared containers and controls keep layout and
action behavior in the engine. Backends must honor bounds and ancestor clipping,
clear stale output on empty frames, and retry failed presentation without
caching it as successful. Terminal composition restores visible content behind
hidden or removed UI and suppresses painting over blocking line-input fallback.

The initial backend contract provides common text and button primitives. Native
widgets, clipboard/IME, accessibility bridges, rich text, virtualization and
animation are not part of this first slice. Hosts cannot mount native controls
through this API; use the shared controls. Desktop remains disabled in the
build, so its source visibility/clearing changes have not been executed. Cell
and differing pixel-metric conformance fixtures cover the portable core.

For an interactive example, run `bash ./gradlew :platforms:terminal:terminalUiSmoke`
with the configured toolchain. Resize the window, focus buttons, open commands,
and use add, pause, resume and quit. The example is a UI exercise rather than the
complete ecosystem simulation.

## Migration and custom hosts

Recompile consumers against the matching engine/compiler versions. The plugin
adds the UI transform while preserving unmanaged-field checks and provider
validation. Existing imperative node builders remain one-time builders.

Normal App startup supplies InputFocus and UiManager; custom manager scopes must
register these services before entering prompt/UI nodes. CommandPromptHost now
uses InputFocus, rather than being consulted directly by InputManager. Custom
CommandPromptPresentation implementations may retain their existing render/hide
methods: the new default bind(owner) hook supports platform-owned UI setup and
cleanup, including bind(null) after failed presentation or editor removal.

Prompt activation uses open/close/isOpen. Node hide/show now means rendering
visibility; it preserves prompt activation and state. The terminal prompt now
uses a retained UI child instead of a separate snapshot-only renderer. Legacy
renderFrame callers remain supported and may adopt UiRoot to gain automatic
layout resizing.
