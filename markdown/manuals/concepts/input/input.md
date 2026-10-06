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
InputBind represents physical bindings; Key is the logical key in raw keyboard events. Do not treat their enums as
interchangeable codes.

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
