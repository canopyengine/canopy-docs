<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Your first project

Start with the [terminal starter](../../../examples/terminal-starter/README.md).
Follow [installation](installation.md) if you have not run it yet.

This small app shows a population count. You can change it with a button or a
typed command. It is a learning example: it counts rabbits, but does not yet
simulate their lives.

## Try the controls

Use a regular terminal window. Press the arrow keys to select **Add rabbit**,
then press Enter. The population should increase by one.

Select **Toggle details** to show or hide the extra explanation. Resize the
terminal and watch the interface rearrange to fit.

Press Escape to open the command panel at the bottom. Type `add`, then Enter.
It changes the same population count as the button.

| Command | What it does |
| --- | --- |
| `help` | Lists the available commands. |
| `add` | Adds one to the population count. |
| `pause` | Pauses normal game updates. |
| `resume` | Starts normal game updates again. |
| `quit` | Closes the app. |

While the panel is open, your typing goes to the command editor. The game keeps
running unless you ask it to pause. Pause/resume will matter more once you add
something that changes over time.

If your terminal uses line input instead of arrow-key controls, type `:console`
and press Enter to open the panel. The app reports when it switches to this mode.

## Make your first change

Open `src/main/kotlin/Main.kt` in a text editor. Find:

```kotlin
Text("Canopy terminal starter")
```

Change the words, save the file and run the app again. For example:

```kotlin
Text("My rabbit world")
```

You should see your new title. You have changed a piece of the game's interface.

Next, find the starting population:

```kotlin
val population = signal(owner = world, value = 3)
```

Change `3` to `10`. Run the app normally again: the count should start at ten.
The automated check described below expects the original starting value, so
restore `3` before running that check.

## Why the count updates

The population is a **signal**: a value that tells interested parts of the app
when it changes. This line reads the value and puts it in a label:

```kotlin
Text("Population: ${population()}")
```

The button changes that value:

```kotlin
Button("Add rabbit") { population.update { it + 1 } }
```

`it` means the current count. Adding one changes the signal, and Canopy updates
the label. The `add` command changes the same signal, so both controls agree.

`owner = world` tells Canopy that this value belongs to the world. When the app
closes and destroys the world, Canopy cleans up the signal too.

## Check that the project still works

With the original starting population restored, run this short automated check:

```powershell
# Windows
.\gradlew.bat run --args=--smoke
```

```sh
# Linux or macOS
bash ./gradlew run --args=--smoke
```

It adds a rabbit, checks pause/resume and closes the app automatically. Look for
`BUILD SUCCESSFUL`. You should still try the controls and resizing yourself;
the automated check does not press real keys or resize a window.

## Where to go next

Read [Understanding Canopy](../guides/understanding-canopy.md) for the next step:
how nodes, behaviors and signals work together. The
[complete starter source](../../../examples/terminal-starter/src/main/kotlin/Main.kt)
is there when you want to follow the rest of the app.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
