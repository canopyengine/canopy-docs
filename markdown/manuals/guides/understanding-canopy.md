<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Understanding Canopy

Think of a small rabbit world. You need somewhere to keep the rabbits, rules
that change their energy, a way to show the player what is happening and a way
to remove a rabbit when it dies. Canopy gives you pieces for those jobs.

If you have not run anything yet, start with [your first project](../getting-started/first-project.md).
The examples here explain individual ideas; they are not complete programs.
You can learn them one at a time.

## A complete example to try

Run the [scoreboard example](../../../examples/scoreboard/README.md) when you
want to connect an explanation to a complete program. It starts at zero; you
can earn points, reset the count and show a message after three points.

```text
You activate “Earn a point”
            ↓
The score changes: 0 → 1
            ↓
The label becomes “Score: 1”
```

Like a sports scoreboard, the display follows the scorekeeper. In Canopy, the
signal is the changing score and `Text` is the display. You still decide the
rules for earning points.

## Nodes: the things in your world

A **node** is one thing your game keeps track of. It might be a rabbit, a group
of animals or a menu. Nodes can contain other nodes, like folders contain files:

```text
World
├── Rabbit
├── Fox
└── Status panel
```

This arrangement is called a **tree**. The world is the parent; the rabbit and
fox are its children. Working with the world lets you manage these pieces together.

A **scene** is a tree being used by the game. A **screen** is a stage the player
visits, such as a title screen or the simulation. You can start with one scene
without creating several screens.

### From folders to code

A folder can hold files and other folders. Similarly, your world node can hold
animals and groups of animals. Replace the entire body of the starter's `onEnter`
callback with this fragment, including removal of its old prompt and smoke-check
code. Keep the surrounding `terminalApp` and `.launch()`:

```kotlin
val world = EmptyNode("World") {
    EmptyNode("Animals") {
        EmptyNode("Rabbit")
        EmptyNode("Fox")
    }
}
world.asSceneRoot()
```

The starter already imports `EmptyNode`. This builds the following structure:

```text
World                       Like a main folder
└── Animals                 Like a folder inside it
    ├── Rabbit              A game object
    └── Fox                 Another game object
```

It does not draw animals; these nodes only organize them. Unlike files, active
nodes can receive update callbacks. Add UI to see values, and behaviors to give
the animals rules.

Read [nodes](../concepts/core/nodes/nodes.md) when you are ready to create your
own game objects.

## Behaviors: what happens over time

A node describes something that exists. A **behavior** describes what it does.
For example, a rabbit might lose energy as time passes.

Canopy repeatedly gives your game a chance to update. An update callback is a
function you provide for one of those moments. A **callback** simply means a
function the engine calls when something happens.

### Think of an instruction card

A behavior is like an instruction card attached to an object: “each update,
move a little to the right.” This fragment creates a moving node:

```kotlin
import io.canopy.engine.core.nodes.behavior
import io.canopy.engine.core.nodes.types.empty.EmptyNode2D
import io.canopy.engine.math.Vector2

val mover = EmptyNode2D("Mover") {
    behavior(onUpdate = { seconds ->
        position = position + Vector2(seconds, 0f)
    })
}
mover.asSceneRoot()
```

Put the three imports at the top of `Main.kt`. Replace the entire body of
`onEnter` with the `val mover` declaration and `mover.asSceneRoot()`, removing
the starter's old prompt and smoke-check code. After roughly one second of
active updates, its horizontal position increases by about one unit.
It is not drawn by this code; the example explains movement data, not sprites.
This illustrative version has no Quit button; stop it with Ctrl+C. The callback
receives elapsed seconds, so movement does not depend on counting frames. The card comparison ends there: the engine calls your function, not a
separate person or background worker.

For a rule shared by many rabbits, you can use a **TreeSystem**. It finds nodes
of the types you ask for and applies your rule to them. A world containing a
rabbit is not itself a rabbit, so it does not match a rabbit-only system.

Start with [behaviors](../concepts/core/nodes/behaviors.md). Use
[TreeSystems](../concepts/core/nodes/tree-systems.md) when you need shared rules.

### Game time is your choice

An engine update is not automatically a day in your simulation. You decide how
much game time passes. For example, a simulation tick could advance from dawn
to early morning after a chosen amount of real time.

Canopy provides regular updates and fixed-time updates. The
[application guide](../concepts/app/application.md) explains how to choose between them.

## Signals: keep the screen up to date

An ordinary variable keeps a value:

```kotlin
var energy = 100
energy -= 1
```

A **signal** also tells interested parts of the game when its value changes.
Use one when a label or another reaction should stay up to date:

```kotlin
val population = signal(owner = world, value = 3)
```

Here `world` is the world node, and `signal` comes from
`io.canopy.engine.core.flows.events`. Read the value with parentheses:

```kotlin
Text("Population: ${population()}")
```

Change it with `update`:

```kotlin
population.update { it + 1 }
```

`it` is the previous value. Canopy notices the change and updates the label.

### A notebook or a scoreboard?

| Choose | Real-life comparison | What happens when the value changes |
| --- | --- | --- |
| Ordinary property | A number written in a notebook | Code can read the new number, but it does not notify a label. |
| Signal | A scorekeeper updating a scoreboard | The UI expressions reading it can update automatically. |

In the [scoreboard program](../../../examples/scoreboard/src/main/kotlin/Main.kt),
these declarations go together inside `UiRoot`:

```kotlin
Text("Score: ${score()}")
Button("Earn a point") { score.update { it + 1 } }
```

**What you see:** one activation changes `Score: 0` to `Score: 1`. The score
signal is created earlier with `signal(owner = world, value = 0)`.

An ordinary variable does not send that notification. Putting an ordinary
`energy` property inside a text expression does not make later changes update
the label automatically. Use a signal for a value the interface should follow.

There are two related tools you can learn later: a **computed value** calculates
something from signals, and an **effect** runs a piece of code when the signals
it reads change. See [signals and reactions](../concepts/core/flows/events-and-signals.md).

## Ownership: who cleans up?

In the population example, `owner = world` means the signal belongs to the world.
When Canopy permanently destroys the world, it cleans up that signal too. This
is useful when leaving a game: old reactions should not keep running afterward.

Think of a room and the equipment supplied with it. When the room is permanently
closed, its equipment is cleared away too. The owner tells Canopy which resources
to clean up together:

```text
World node
├── UI children             Destroyed with the world
└── Population signal       Disposed because its owner is world
```

Taking a node out temporarily is different from closing the room permanently.
Some reactions stop on tree exit, while owned signals keep their values. The
comparison is a starting point; the cleanup table in the reference gives each
resource's exact rule.

Canopy can choose an owner automatically inside some node callbacks. When you
create a resource outside those callbacks, giving it an owner explicitly keeps
the relationship clear. Storing something in a node property does not, by itself,
make the node responsible for cleaning it up.

The details matter when you reuse nodes or share resources. You can look them up
in the [lifetime reference](runtime-details.md#detachment-destruction-and-ownership)
when you reach that point.

## Remove for later, or remove for good

Sometimes you want to take a rabbit out of the world and put it back later:

```kotlin
world.removeChild(rabbit)
world.addChild(rabbit)
```

`removeChild` takes it out of the active tree. It stops normal scene updates,
but keeps its state for reuse. Keep a reference so you can put it back or destroy
it later.

For a rabbit that has died, use:

```kotlin
rabbit.queueFree()
```

This asks Canopy to destroy it at the end of a complete frame or fixed update.
It may still receive callbacks before that point. After destruction it cannot
be used again. Removing a child alone does not request destruction.

A useful comparison is a reusable prop versus a discarded prop:

| Your intention | Code | What happens |
| --- | --- | --- |
| Put a prop aside for later | `world.removeChild(rabbit)` | The node leaves the active tree and keeps its state. |
| Bring it back | `world.addChild(rabbit)` | The node returns to the tree. |
| Dispose of it permanently | `rabbit.queueFree()` | Destruction is scheduled; the node cannot be reused afterward. |

These fragments assume `rabbit` is currently a child of `world` before removal.
They show alternatives, not three steps that every removal should perform.

Some reactions stop when a node leaves the tree, even if the node is kept for
reuse. Learn the [cleanup rules](runtime-details.md#detachment-destruction-and-ownership)
before relying on the same reactions after putting it back.

## UI: describe what the player sees

**UI** means user interface: labels, buttons, panels and other controls.
In Canopy you describe them together:

```kotlin
Column {
    Text("Population: ${population()}")
    Button("Add rabbit") { population.update { it + 1 } }
}
```

A `Column` places its children vertically. `Text` shows words. `Button` runs its
code when activated. This style is called **declarative UI**: you describe the
interface and let Canopy arrange and update it.

The starter puts these declarations inside `UiRoot`. Its build setup includes
the compiler plugin needed for the automatic updates. You do not need to write
compiler code yourself.

A condition can choose what appears. If a signal changes the condition, Canopy
creates or removes the affected controls. This differs from hiding a control,
which keeps it and its space in the layout.

### A stack of signs

A `Column` is like stacking signs vertically; a `Row` places them beside each
other. The code above has this shape:

```text
Column
┌────────────────────┐
│ Population: 3      │  Text
│ [ Add rabbit ]     │  Button
└────────────────────┘
```

This is a sketch of the arrangement, not an exact screenshot. Layout containers
arrange controls; they do not supply the game rules behind the buttons.

The scoreboard adds a condition:

```kotlin
if (score() >= 3) {
    Text("Three points! Well done.")
}
```

Put it inside the scoreboard's `Column`. Below three points the message is
absent. At three or more it appears; resetting removes it again. You describe
when it belongs on screen, and Canopy manages that piece of the interface.

When the terminal is resized, Canopy uses the new available space to lay out the
interface again. Read [UI and layout](../concepts/app/declarative-ui.md) for sizing
and more examples.

## Commands: another way to control the same world

A button and a typed command can change the same signal. In the starter, both
**Add rabbit** and `add` increase the population.

Think of a button and a typed command as two doors into the same room: either
can reach the same game action. In the starter, this declaration goes inside
its existing `CommandPrompt("Console")` block:

```kotlin
command("add", "Add one rabbit") {
    execute {
        population.update { it + 1 }
        reply("Population: ${population()}")
    }
}
```

The starter already contains it; do not add a second command with the same name.
Type `add` and the count increases, just as it does when activating the button.
The command also replies with the new count. See the
[complete starter](../../../examples/terminal-starter/src/main/kotlin/Main.kt)
for the surrounding code.

Opening the command panel sends your typing to its editor, so typing a command
does not also trigger gameplay keys. The world keeps running unless you pause
it. `pause` and `resume` are separate commands.

Read [commands](../concepts/app/command-prompts.md) when you want to add one,
and [input](../concepts/input/input.md) when you want keyboard actions.

## Learn the other pieces when you need them

| When you want to… | Read… |
| --- | --- |
| Save progress and load it later | [Saving and loading](../concepts/data/saving-and-loading.md) |
| Load files used by your game | [Assets and resources](../concepts/data/assets-and-resources.md) |
| Switch between a menu and the game | [Screens](../concepts/app/screens.md) |
| Move things using positions and directions | [Vectors and transforms](../concepts/math/vectors-and-transforms.md) |
| Investigate what happened during a run | [Logging](../concepts/logging/logging.md) |

For now, one scene, a few nodes and a signal are enough to explore the engine.

## Already comfortable with engines?

The [runtime reference](runtime-details.md) covers exact update order, resource
lifetimes, reuse, reactive state and compiler behavior. The
[architecture pages](/markdown/index.md#engine-internals) explain how the engine
is implemented. They are useful when debugging or extending Canopy, and are
available alongside this learning path.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
