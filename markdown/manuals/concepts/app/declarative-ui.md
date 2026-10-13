# Declarative UI and responsive layout

The **user interface**, or UI, is what the player reads and interacts with:
labels, buttons and panels. In Canopy you describe these pieces together, and
the engine arranges them to fit the available space. This is called
**declarative UI**.

Start with the [terminal example](../../getting-started/first-project.md) if you
have not used the controls yet. The example below goes inside a terminal app's
`onEnter` callback, after the app has started its services.

A `Column` stacks things vertically. A `Row` places them side by side. `Text`
shows a label, and `Button` runs code when the player activates it. A signal
keeps a changing label up to date.

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

Attach `hud` to your world with `world.addChild(hud)`, or use
`hud.asSceneRoot()` to make it the active scene. The example fills the available
space, shows a count and lets you add an animal or toggle the extra text.

`UiStyle` chooses sizes and spacing. `UiLength.Fill` means “use the available
space,” and `gap = 1.0` leaves space between children. On a terminal, sizes are
measured in character cells. When the terminal changes size, the layout uses
the new space.

The interface does not rebuild everything whenever the count changes. Canopy
updates the affected label or condition while keeping the other controls.
The starter already includes the compiler plugin needed for this behavior.

The shared API lives in `io.canopy.engine.ui`. The terminal app provides the
services and drawing backend. Headless apps can update UI state without drawing,
or supply a recording backend for testing. Custom node properties use the normal
compiler-managed storage; explicit `nodeProperty` remains supported.

The following sections are the detailed reference for dynamic lists, reusable
components and layout rules.

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

The compiler retains local signal/computed/effect initialization. On the foundation
integration branch it also retains direct Node and UiNode constructors by source
site within each key. Constructor arguments initialize once; pass Signals for
live values. Reordering preserves the same node and its state. Omission destroys
it, and reinsertion constructs a fresh instance. Constructor argument reads do
not become dependencies of the surrounding condition or list.

Arbitrary factory-created objects still require explicit retention, such as
`remember("service") { createService() }`. Put component-owned state on a UiNode
rather than recreating it in a changing branch. Entry-scoped effects belong in
ordinary node entry hooks; a standalone effect statement can run again when its
structural declaration is evaluated.

## Keys, identity and owned state

```kotlin
UiRoot("Animals") {
    val animals = signal(listOf("rabbit", "fox"))
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

Ordinary scene nodes may contain UI roots. On the foundation integration branch,
direct ordinary Node constructors are retained inside a UI declaration. It
shares its container's drawing area without contributing to layout measurement.
Other imperative child mutations inside managed declarations remain unsupported.
Removal/detachment suspends UI observers and input routes;
reentry resumes them without rebuilding retained local signals. Existing
Computed and Effect objects keep their engine entry-scoped disposal contract:
removal disposes them, and reentering a retained root does not resurrect such
remembered objects. Initialize entry-scoped work through appropriate ordinary
node entry hooks when reentry is required. Permanent destruction cancels pending
UI work and releases retained declaration closures.

## Reusable components

On the foundation integration branch, every component extends `UiNode`, which
extends the same `Node` base used by the rest of the game. Row, Column, Box, Text
and Button are individual classes in `io.canopy.engine.ui.components`. UiRoot
also extends UiNode and supplies the host-level layout and focus boundary.

A reusable component uses the ordinary `nodeInit` hook:

```kotlin
import io.canopy.engine.core.flows.events.Signal
import io.canopy.engine.ui.UiNode
import io.canopy.engine.ui.UiRoot

class PopulationCard(
    name: String,
    private val population: Signal<Int>,
) : UiNode<PopulationCard>(name) {
    override fun nodeInit() {
        ui {
            Column {
                Text("Animals: ${population()}")
                Button("Add animal") { population.update { it + 1 } }
            }
        }
    }
}

val hud = UiRoot("Hud") {
    PopulationCard("Population", population)
}
```

Here `population` at the call site is a Signal owned by the game. Its reference
is constructor configuration; its changing value is read by the Text binding.
The constructor and nodeInit run once per retained component. A component can
also declare its own `val count = signal(0)` field, owned by that node like any
ordinary Node. Use normal entry/removal/destruction hooks for owned work.

`ui { ... }` describes a component's children once. Its body accepts built-in
controls, custom UiNodes and ordinary Node constructors. Custom components use
overlay layout by default; compose a Row or Column to arrange children. Ordinary
nodes are transparent to layout: their first UI descendants participate in the
nearest UI container's arrangement, while ordinary drawing inherits that
container's content area. Child UI nodes establish their own drawing area.

You do not construct UiScope or pass it around to use this API. It is the DSL
receiver behind `ui { ... }`, managing retained declarations, keys and bindings.
UiNode is the component; Node is the owner; UiScope reconciles declarations.
Functions may still use a UiScope receiver to extract a small shared builder,
but a reusable component with owned state should be a UiNode. No renderer
selection or explicit render call is needed in a terminal app.

| Type | Owns |
| --- | --- |
| UiNode | Style, layout bounds and composition, plus normal Node state/lifecycle |
| Row / Column / Box | Arrangement policy |
| Text | Mutable text content |
| Button | Mutable label, eligibility and action |
| UiRoot | Host-level sizing, layering and focus |

Typed builders return the actual component, so `val label = Text("Ready")` has
Text's API and `val button = Button("Start") { ... }` has Button's API. Containers
do not carry meaningless text/action fields. Existing Row/Column/Box/Text/Button
DSL spellings remain supported. Direct class construction outside a UI declaration
uses ordinary node construction and requires distinct sibling names, as usual.
Components need a containing UiRoot for layout/presentation.

## Drawing ordinary nodes inside UI

The foundation integration branch adds `Node.onDraw(DrawContext)`. For example,
this ordinary node can draw a map marker inside a panel:

```kotlin
import io.canopy.engine.core.nodes.Node
import io.canopy.engine.graphics.DrawContext
import io.canopy.engine.ui.*

class MapNode : Node<MapNode>("Map") {
    override fun onDraw(context: DrawContext) {
        context.text("r", x = 2.0, y = 1.0, width = 1.0, height = 1.0)
    }
}

val hud = UiRoot("Hud") {
    Box(UiStyle(width = UiLength.Fixed(20.0), height = UiLength.Fixed(8.0), padding = 1.0)) {
        MapNode()
    }
}
```

The compiler retains MapNode once per source site/key. Signals in the node can
hold changing game state. Reordering preserves the same node; omission destroys
it normally. The runtime `node(site) { ... }` hook remains available for explicit
retention when working without direct compiler lowering.

Drawing uses local coordinates in the container's content area, excluding its
padding. `context.size` gives that area; `context.measureText` uses host metrics.
Ordinary descendants share the area. Ancestor clipping applies automatically;
disabling a container's clipping permits overflow up to the remaining ancestor
and host clips. These coordinates do not apply Node2D position/scale/rotation.
Ordinary drawing does not reserve layout space: size the containing UI node.
UiRoot remains a host-level layer, rather than an embedded measured component.

The frame flow is: application and manager updates, queued UI bindings, layout,
drawing into the pending buffer, then one successful presentation. Ordinary
scene drawing appears below host-level UI roots; inside a UI container, ordinary
nodes and UiNodes paint in declaration order. A custom UiNode can also override
onDraw; its own drawing precedes its children and uses its padded content bounds. Hidden and detached subtrees
do not draw. Drawing continues while simulation is paused. Headless hosts with
no drawing backend run state/lifecycle updates without invoking drawing hooks.

Entered nodes that override `onDraw` request drawing each frame so animation can
follow their current state. Reactive UI conditions still subscribe to Signals;
this does not turn condition checking into frame polling. UI-only unchanged
frames still skip backend submission, and unchanged terminal cells write nothing.
The context expires when its callback returns. A draw failure aborts pending
presentation and preserves the original callback error; game state is not rolled
back. Store persistent state on the node, not in a retained drawing context.

## Sizing and resizing

UiRoot fills its backend viewport by default. Row lays out children horizontally,
Column vertically, and Box overlaps them in declaration order. UiStyle is an
immutable value describing width, height, padding, gap, cross-axis alignment,
wrapping, clipping, maximum dimensions, border and appearance.

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

On the foundation integration branch, text measurement reuses results when only
the available height changes. Width changes still update wrapping; Fill and
Fraction heights still follow their parent allocation. Changing one label does
not remeasure sibling labels whose measurement inputs are unchanged. This
reduces layout work; changed frames still compose into the terminal cell buffer,
which writes only cells that differ from the last successful presentation.

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

## Colors, borders and themes

The foundation integration branch supports portable styles rendered through
Mordant on terminal hosts. Put colors and emphasis in `UiStyle.appearance`:

```kotlin
Text("Population").also {
    it.style = UiStyle(
        appearance = UiAppearance(
            foreground = UiColor.Rgb(120, 220, 160),
            bold = true,
        ),
    )
}

Box(
    UiStyle(
        width = UiLength.Fill,
        height = UiLength.Fixed(8.0),
        padding = 1.0,
        border = UiBorder.Rounded,
        appearance = UiAppearance(background = UiColor.Rgb(16, 28, 22)),
    ),
) {
    MapNode()
}
```

RGB channels range from 0 to 255. Null inherits an explicit appearance from
ancestors; `UiColor.Default` resets to the host's default color. Null emphasis
inherits, while `false` explicitly disables it. Supported emphasis is bold,
dim, italic, underline and inverse video. Opaque backgrounds fill the node's
allocated rectangle; no background leaves it transparent. Appearance also
passes through ordinary drawing nodes to their DrawContext.

A theme provides component defaults for a subtree:

```kotlin
hud.theme = UiTheme.Default.copy(
    button = UiAppearance(foreground = UiColor.Rgb(120, 190, 255)),
    focusedButton = UiAppearance(bold = true, inverse = true),
    disabledButton = UiAppearance(foreground = UiColor.Rgb(140, 140, 140), dim = true),
    buttonBorder = UiBorder.Double,
)
```

The nearest non-null node theme replaces the inherited theme as a whole. Copy a
theme to change only one default. Component defaults apply first, followed by
explicit ancestor appearances, then the component's own appearance. Focused or
disabled button defaults apply last. An empty state appearance adds no extra
state styling. Setting theme to null restores inheritance.

Borders may be None, Rounded, Square or Double. Null uses the theme's border for
buttons and no border for other components. A border reserves one logical unit
on each edge in addition to padding. Button measurement includes the terminal
control's bracket decoration and horizontal label padding; the engine does not count its
border twice. Border changes recompute layout; color/emphasis changes paint
without remeasuring text. Equal styles/themes skip unchanged UI-only frames, and
terminal cell diffing writes only changed physical cells. Off-screen panel
backgrounds and borders allocate and iterate only within the drawable clip.

With the matching compiler, style and theme assignments inside component
configuration lambdas capture Signal reads. For example,
`label.style = UiStyle(appearance = UiAppearance(foreground = color()))` inside a
captured builder expression updates at the next UI boundary. Event handlers may
also assign styles directly. Constructor arguments still initialize once.

Each agent can override its own foreground while inheriting the map background:

```kotlin
override fun onDraw(context: DrawContext) {
    context.text(
        "r",
        x = rabbitColumn,
        y = rabbitRow,
        width = 1.0,
        height = 1.0,
        appearance = UiAppearance(foreground = UiColor.Rgb(120, 240, 120)),
    )
}
```

The coordinates are local logical units, supplied as Doubles. DrawContext text
backgrounds style the painted glyphs; a UiNode background fills its whole bounds.
The terminal smoke example now includes a bordered map with moving, individually
colored markers. Simulation pause stops movement while drawing remains active.
It is an API exercise, not the complete rabbits/foxes ecosystem simulation.

## Mouse input

Every `UiNode` starts with `mouseFilter = UiMouseFilter.Ignore`. Layout/display
elements (`Row`, `Column`, `Box`, `Text`) keep this default. Buttons use `Stop`
and run their existing action once on a primary mouse press; keyboard activation
still works. Set a button's filter to `Ignore` to keep it keyboard-only.

| Filter | Behavior |
|---|---|
| `Ignore` | Skip this element; eligible children and elements behind it can receive events. |
| `Pass` | Call its handler, then continue unless the event was consumed. |
| `Stop` | Call its handler and block elements behind it, even if the handler does nothing. |

Routing follows the same front-to-back order as drawing, including root layer,
z index and sibling order. A target must be entered, visible and inside its
viewport/ancestor clipping. Disabled buttons block according to their filter
but do not activate. A primary press handled by a button is consumed even when
its filter is `Pass`; unused events such as wheels can then reach other targets.

Custom components opt in and override `onMouseInput`, like a normal Node hook:

```kotlin
import io.canopy.engine.input.events.InputEvent
import io.canopy.engine.input.events.MouseScrollEvent
import io.canopy.engine.ui.*

class ScrollCounter : UiNode<ScrollCounter>("ScrollCounter") {
    private val count = signal(0)

    init { mouseFilter = UiMouseFilter.Pass }

    override fun nodeInit() {
        ui { Text("Scroll: ${count()}") }
    }

    override fun onMouseInput(event: InputEvent) {
        if (event is MouseScrollEvent) {
            count.update { it + event.vertical }
            event.consume()
        }
    }
}
```

The matching compiler retains `ScrollCounter()` when declared inside `ui {}`.
Its `Text` child ignores mouse input; wheel events reach the parent. Pointer
positions are zero-based viewport coordinates in `screenPos`, using the same
units as `bounds` (terminal cells or backend pixels). Wheel values count steps:
positive vertical is down and positive horizontal is right. Mouse events retain
Ctrl/Alt/Shift flags. The inherited `Node.onInput` remains the separate raw scene
input hook; use `onMouseInput` for hit-tested UI interactions.

Callbacks run on the lifecycle thread, including paused frames. Mouse buttons
use the canonical `InputBind` names as their actions. A GUI-owned button gesture
does not leak into gameplay raw input or mappings if its widget disappears; it
stays captured through release. The open command prompt captures mouse events
before UI routing, preserving its draft and blocking actions behind it, including
the frame in which it closes. Closing restores UI mouse interactions on the next
input frame. Mouse packets are never published as keyboard text.

### Hover

Participating elements (`Pass` or `Stop`) expose `isHovered`, `mouseEntered` and
`mouseExited`. `Ignore` elements never hover. Hover follows the visible, clipped
paint order: `Pass` permits hover behind the element, while `Stop` blocks it.
Hover is independent of keyboard focus and never activates a button. Disabled
buttons still block pointers but retain their disabled appearance.

```kotlin
val action = Button("Add rabbit") { addRabbit() }
action.mouseEntered.connect(action) { showHint.update { true } }
action.mouseExited.connect(action) { showHint.update { false } }
```

Retain a connection handle or supply a node owner as above, following the normal
Event lifetime rules. Enter/exit notifications run once per transition, including
paused frames. Hiding, detaching, changing the mouse filter or changing layout
also reconciles hover beneath a stationary pointer at the UI frame boundary.
Destroyed nodes dispose their events rather than emitting during destruction.

Buttons underline on hover by default. Customize the nearest theme with
`theme = UiTheme.Default.copy(hoveredButton = UiAppearance(background =
UiColor.Rgb(40, 60, 70)))`. Keyboard focus and disabled styling take precedence.
For custom components, use the events to update Signals or appearance; no special
renderer or hover polling loop is required.

The terminal host reports motion only when visible UI elements participate.
Opening the command editor returns reporting to clicks only and clears hover;
closing it waits for fresh pointer input before restoring hover. Coordinates are
terminal cells, so moving within the same cell does not emit another movement.
Leaving the terminal window has no portable notification; hover remains at the
last known cell until another event or a layout/capture change. Drag-and-drop and
GUI pointer capture are not implemented.

## Input, focus and prompt integration

Buttons expose shared enabled/action semantics. Keyboard navigation and
activation use the shared InputFocus service; hidden, disabled or detached UI
cannot receive focus or pointer targeting. Focus stays with retained keyed
identity and releases when it becomes ineligible. UI input and presentation
remain responsive while gameplay is paused. A focused control captures gameplay
keyboard input without pausing simulation; `root.focus(null)` releases it.
When a CommandPrompt is installed, it owns its activation key (Escape by default).
Escape opens/closes the prompt even with a selected button; the underlying
button selection is retained for navigation when the prompt closes.


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

UiBackend supplies drawable viewport conversion, text/button measurement,
styled text/button/box primitives, and begin/end/abort frame boundaries. Shared containers and controls keep layout and
action behavior in the engine. Backends must honor bounds and ancestor clipping,
clear stale output on empty frames, and retry failed presentation without
caching it as successful. Terminal composition restores visible content behind
hidden or removed UI and suppresses painting over blocking line-input fallback.

The backend contract provides common text, button and background/border primitives.
Custom backends receive resolved appearances and border policies; drawText and
drawButton now include those arguments, and measureButton receives its border.
Implement drawBox to support backgrounds/borders; its default is a no-op for
recording or minimal hosts. Text emphasis must preserve measurement metrics. Native
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

Recompile consumers against the matching engine/compiler versions. Replace
UiElement annotations with UiNode<*> for generic layout access, Text for text
content, or Button for actions. UiKind is now an internal layout policy; custom
components compose the public Row/Column/Box classes instead. The plugin
adds the UI transform while preserving unmanaged-field checks and provider
validation. Existing imperative node builders remain one-time builders.

Normal App startup supplies InputFocus and UiManager; custom manager scopes must
register these services before entering prompt/UI nodes. CommandPromptHost now
uses InputFocus, rather than being consulted directly by InputManager. Custom
CommandPromptPresentation implementations may retain their existing render/hide
methods: the new default bind(owner) hook supports platform-owned UI setup and
cleanup, including bind(null) after failed presentation or editor removal.

In the foundation integration branch, `App` processes reactive UI work and paints
after application callbacks and all manager updates, including while paused.
Manager registration order therefore does not delay a service's UI changes until
the following frame. Explicit `renderNow()` calls during application updates are
deferred to that boundary. Failed updates do not commit a new UI paint.

Custom hosts invoke `UiManager.updateFrame()` once after their updates instead of
using `UiManager.onUpdate()`. The method processes one pending observer batch;
work enqueued during that batch remains pending for the next frame. Direct
`renderNow()` outside an application update paints without evaluating observers.

In the foundation integration branch, `UiBackend.begin()` prepares temporary
frame state, drawing methods populate it, and `end()` submits the completed
frame. A failure in any of those stages calls `abort()`; it never calls `end()`
to finish failed painting. Backends must discard temporary state without
presenting it. An abort failure is attached to the original error rather than
replacing it. Output already written to a terminal cannot be rolled back.
The terminal host also discards world/UI submissions from a failed update and
keeps the previously committed presentation. This does not revert game state.

UiManager compares retained presentation values in two reusable flat buffers.
It scans current state in tree order, then skips backend submission when it
matches the last successful frame and no animated drawing is active. This scan
also detects direct visibility, theme, text and hierarchy changes; it does not
reevaluate reactive conditions. A successful `end()` swaps the buffers. Equal
or failed frames clear scratch references, and shutdown releases both buffers.
Layout keys also use flat traversal; appearance resolution walks outward from
the component, preserving the nearest explicit overrides without an ancestor
list. These details change allocation behavior, not the public component API.

Prompt activation uses open/close/isOpen. Node hide/show now means rendering
visibility; it preserves prompt activation and state. The terminal prompt now
uses a retained UI child instead of a separate snapshot-only renderer. Legacy
renderFrame callers remain supported and may adopt UiRoot to gain automatic
layout resizing.

## Compact terminal controls

Terminal buttons occupy one row:

```text
[ Add animal ]
```

Enabled actions use cyan, focused actions use bold inverse video, and disabled
actions are dimmed. Long labels are clipped at grapheme boundaries; newlines
and tabs become spaces, so controls never wrap into additional rows. Borderless
buttons retain horizontal padding. Borders on terminal buttons select bracketed
versus borderless presentation; rounded/square/double panel borders still apply
to containers. Widget output remains in memory and uses Mordant text and styling.
The backend owns measurement and drawing; the existing surface owns output,
clipping and partial repainting.

## Bounded grids and dividers

`GridNode` is a `UiNode`, so it measures itself and participates in layout without
a wrapper. `GridSymbol` is an immutable value, not a Node. Symbols accept one
printable ASCII character and an optional foreground color; null inherits the
component appearance. Coordinates begin at zero in the top-left.

```kotlin
import io.canopy.engine.graphics.GridSymbol
import io.canopy.engine.ui.components.Divider
import io.canopy.engine.ui.components.GridNode

UiRoot {
    Column {
        Text("Ecosystem")
        val rabbit = GridSymbol('r', UiColor.Rgb(120, 220, 160))
        val map = GridNode(columns = 30, rows = 15) {
            empty('.', color = UiColor.Rgb(120, 120, 120))
            columnGap = 1
            set(5, 3, 'T', color = UiColor.Rgb(40, 140, 60))
            set(1, 1, rabbit)
        }
        Divider()
        Button("Move rabbit") {
            map.clear(1, 1)
            map[2, 1] = rabbit
        }
    }
}
```

Use the matching compiler plugin for direct node declarations, as for other
custom components. Constructor blocks run once per retained identity. Use
`set(x, y, glyph, color)`, `set(x, y, symbol)` or indexed assignment for one cell;
indexed reads return its symbol. `clear(x, y)` restores a cell to the configured
empty symbol; `clear()` restores the whole grid. `fill(glyph, color)` and
`fill(symbol)` replace every cell without changing the empty configuration.
Explicit symbols keep their values when empty configuration changes; cleared
cells follow that configuration. Invalid coordinates fail before mutation.

Dimensions are positive and fixed for each instance. The default is gray dots
with one character-width gap between columns. A 30-by-15 terminal grid measures
59-by-15 character cells: gaps appear only between columns. Standard `style`
controls borders, padding, color inheritance and sizing. A smaller allocated
area clips the view rather than changing its logical dimensions. `Divider`
fills the allocated width with a horizontal separator and takes no focus or
mouse input by default; customize its appearance through `style`.

Cell changes are retained and presented after updates. Multiple writes in one
frame are batched, equal writes do not request another presentation, and color
changes do not remeasure the grid. Sparse cell storage and constant-space fill
avoid allocating a Node or a full buffer for every logical cell. Terminal drawing
reads only visible cells; the terminal screen still has its ordinary bounded
frame buffer. Simulation, terrain restoration and overlapping-agent policy
remain application responsibilities.

`UiBackend.measureGrid`/`drawGrid` and `measureDivider`/`drawDivider` are platform
contracts. Backends choose metrics and draw into their pending frame. Defaults
provide character-based measurement and report unsupported drawing explicitly;
custom backends supporting these components must implement their draw methods.
The terminal backend translates symbols and styles into text; a future graphical
backend can draw the same character grid. This does not imply automatic image
sprites, desktop integration or the deferred `platformConfig` system.

For [engine issue #219](https://github.com/canopyengine/canopy/issues/219), the
terminal surface compares styled grapheme cells against its last successful
frame and writes only changes. Shorter text erases its old tail; overlapping
wide characters are replaced as whole glyphs. World, UI and command submissions
inside one terminal update produce a single synchronized write. Startup and
resize clear once; failed writes trigger a complete repaint on retry. Raw runs
use the alternate screen and restore it and the cursor on exit; line fallback
returns to the normal screen before reading input.

This is pending source work, not behavior in published `0.1.0-alpha.1`. It does
not introduce per-component paint caches: reactive expressions and equal-frame
suppression already coalesce work, while changed frames still compose the
retained tree into memory. No performance claim is made without measurement.
