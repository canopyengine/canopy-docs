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

Read [nodes](../concepts/core/nodes/nodes.md) when you are ready to create your
own game objects.

## Behaviors: what happens over time

A node describes something that exists. A **behavior** describes what it does.
For example, a rabbit might lose energy as time passes.

Canopy repeatedly gives your game a chance to update. An update callback is a
function you provide for one of those moments. A **callback** simply means a
function the engine calls when something happens.

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

When the terminal is resized, Canopy uses the new available space to lay out the
interface again. Read [UI and layout](../concepts/app/declarative-ui.md) for sizing
and more examples.

## Commands: another way to control the same world

A button and a typed command can change the same signal. In the starter, both
**Add rabbit** and `add` increase the population.

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
