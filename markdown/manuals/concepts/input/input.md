<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Input actions and raw events

Map physical bindings to named actions so gameplay can ask for move_left or jump without knowing the backend key code.
InputManager is a global service. Terminal installs a Mordant-backed input manager; other hosts need an appropriate
registered implementation before input utilities can resolve it.

## Map and read actions

```kotlin
import io.canopy.engine.core.managers.manager
import io.canopy.engine.input.InputManager
import io.canopy.engine.input.binds.InputBind
import io.canopy.engine.math.Vector2

fun configureMovement() {
    manager<InputManager>().mapActions(
        "move_left" to listOf(InputBind.A, InputBind.LEFT),
        "move_right" to listOf(InputBind.D, InputBind.RIGHT),
        "move_up" to listOf(InputBind.W, InputBind.UP),
        "move_down" to listOf(InputBind.S, InputBind.DOWN),
        "jump" to listOf(InputBind.SPACE)
    )
}

fun movement(): Vector2 = manager<InputManager>().getInputVector(
    "move_left", "move_right", "move_down", "move_up"
)

fun jumpedThisFrame(): Boolean = manager<InputManager>().isActionJustPressed("jump")
```

Configure once after input registration. mapActions replaces bindings for supplied actions by default; replace = false
appends bindings. Other mappings remain. Replacement clears cached action states; unmapAction and clearMappings remove
mappings. InputMapper can export/import copied InputData for serialization.

| State/helper | Meaning |
| --- | --- |
| JustPressed / isActionJustPressed | Transition from released to pressed |
| Pressed / isActionPressed | Held; the helper also includes JustPressed |
| JustReleased / isActionJustReleased | Transition from pressed to released |
| Released / isActionReleased | Released; the helper also includes JustReleased |

Unknown actions read as Released. getAxis(negative, positive) returns -1, 0 or 1; both directions cancel. getInputVector
combines axes without normalizing, so normalize its returned value if diagonal movement should have unit speed.
InputBind stores keyboard and mouse action bindings. Key supplies the canonical keyboard identity shared by raw
KeyInputEvents and keyboard bindings. Canopy codes are stable engine identifiers; they are not native backend codes
or enum ordinals. Backends translate explicitly.

## Keyboard identity and saved bindings

Every supported keyboard InputBind round-trips through toKey and toInputBind, including digits, Tab, Delete, sided
modifiers, punctuation, function keys and numpad keys:

```kotlin
import io.canopy.engine.input.binds.InputBind
import io.canopy.engine.input.binds.Key
import io.canopy.engine.input.binds.toInputBind
import io.canopy.engine.input.binds.toKey

fun sameKeyboardIdentity(): Boolean =
    InputBind.NUM_1.toKey() == Key.NUM_1 && Key.NUM_1.toInputBind() == InputBind.NUM_1
```

Mouse bindings convert to Key.UNKNOWN. UNKNOWN and the unsided CTRL, ALT and SHIFT identities have no exact
InputBind and convert to null. Modifier flags on KeyInputEvent describe a combination; they do not imply which
physical modifier side was pressed.

Saved InputBind enum names, order, device types and Canopy codes are unchanged. Existing InputData using enum-name
strings loads without manual migration, for example:

```json
{
  "mappings": [
    { "name": "select", "binds": ["NUM_1", "TAB", "LEFT_MOUSE"] }
  ]
}
```

For Kotlin source migration, use Key.A through Key.Z. Deprecated Key.A_KEY through Key.Z_KEY aliases resolve to the
same canonical entries, so Key.W_KEY == Key.W. They are no longer separate enum entries: update code using
Key.valueOf("W_KEY"), enum-name persistence or entries iteration, and recompile clients. Key ordinals and raw event
action names change (W_KEY becomes W); do not use them as saved binding identifiers. This does not change the
InputBind names stored by InputData.

## Load and export bindings

Decode saved bindings into InputData, then load them into an InputMapper. Loading replaces all of that mapper's
actions; use mapActions when you want to change only selected actions. Export a snapshot with toData and encode it
with Canopy's Json helper:

```kotlin
import io.canopy.engine.data.parsers.Json
import io.canopy.engine.input.InputMapper
import io.canopy.engine.input.binds.InputData

fun loadBindings(savedJson: String): InputMapper = InputMapper().also { mapper ->
    mapper.loadData(Json.fromString<InputData>(savedJson))
}

fun saveBindings(mapper: InputMapper): String = Json.toString(mapper.toData())
```

InputData already has generated serializers. This snippet does not define a new serializable type and needs no
serialization compiler plugin. JSON binds are InputBind enum-name strings, not objects with type/code fields.
Parsing errors propagate; automatic compatibility applies to the existing enum-name format, not unsupported formats.

The [runnable input bindings example](../../../../examples/input-bindings/README.md) loads a checked-in legacy file,
exports and reloads it, and checks all 103 physical keyboard bindings plus a deprecated source alias. Its README
includes the exact local build commands and the canonical implementation dependency on
[engine PR #192](https://github.com/canopyengine/canopy/pull/192), validated at commit 6267487. Use that implementation
until it merges; a remote artifact with the same development version may not contain the canonical API.

## Backend keys and text

Mordant maps explicit key names and unshifted ASCII letters, digits and punctuation. Uppercase ASCII letters share
their canonical letter key while the original text and modifier flags remain intact. A single printable Unicode code
point is delivered as TextInputEvent; unsupported characters may have no physical key event. Multi-code-point
Mordant key reports retain the existing unsupported behavior; fallback line input accepts whole lines. A terminal
character does not reveal a keyboard layout, modifier side or numpad identity. Shifted symbols such as ! are kept as text without guessing NUM_1.
Ctrl/Alt combinations do not emit text; Ctrl+C keeps platform exit behavior.

Terminal input still has press events without key releases. LibGDX remains a polling adapter with explicit native
translations; both Meta bindings map to its SYM key. This change does not add a LibGDX raw event bridge.

Read TextInputEvent for editor text instead of reconstructing it from Key names or codes.

## Delivery and focus

The backend enqueues events; the lifecycle thread processes them once per frame. InputSystem delivers raw events before
mapped ButtonInputEvents in FramePre. Use a node/behavior onInput hook to react to events. event.consume() prevents
remaining traversal from receiving the event; node processing modes control eligibility.

A visible command prompt owns editor focus. Its toggle/edit events are routed before gameplay; action snapshots, action
queries and direct physical polling are suppressed for captured input. Hiding the prompt releases focus. This is separate
from app pause: direct polling does not consult a node's ProcessMode.

Application code normally reads states and mappings. Backend implementers use enqueue from producers, processEvents on
the engine thread, and the physical polling hook. The returned raw event view is replaced each frame; copy it if retaining
it beyond that frame. Avoid calling processEvents twice per frame yourself when the host already drives it.

## Optional global access

```kotlin
import io.canopy.engine.core.managers.managerOrNull
import io.canopy.engine.input.InputManager

fun canReadInput(): Boolean = managerOrNull<InputManager>() != null
```

Use the immediate helper for a one-time check. A property declared with core.queries.managerOrNull resolves on every
read and can recover after a service is registered. Optional lookup only handles absence; ambiguity still throws.

See [Dependencies](../core/dependencies.md), [Command prompts](../app/command-prompts.md),
[Pause-aware nodes](../core/nodes/nodes.md#pause-aware-processing) and
[Input design](../../../engine-details/commands-and-input.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
