# A scoreboard you can run

Think of the scoreboard at a sports match: someone changes the score, and the
board shows the new number. This example does the same with a signal and a label.
It uses Canopy `0.1.0-alpha.1` from Maven Central and JDK 25.

From the documentation repository root, run:

```powershell
# Windows
.\examples\terminal-starter\gradlew.bat -p examples/scoreboard run
```

```sh
# Linux or macOS
bash examples/terminal-starter/gradlew -p examples/scoreboard run
```

The project uses the existing starter's Gradle launcher; keep both example folders
in place. See [installation](../../markdown/manuals/getting-started/installation.md)
if you need to install Java first.

## What you should see

```text
My scoreboard
Score: 0
[ Earn a point ]
[ Reset ]
[ Quit ]
```

This sketch shows the contents; the terminal's button styling can differ.
Use arrow keys to select a button and Enter to activate it. Earn three points,
and **Three points! Well done.** appears. Reset returns the count to zero and
removes that message. Quit closes the application.

Use an interactive terminal for the controls. For a short automated check,
append `--args=--smoke` to either run command. It changes the score, resets it
and exits; it does not press real keys or check the painted terminal output.

## Follow the code

The complete program is [Main.kt](src/main/kotlin/Main.kt).

| Code | Familiar comparison | What it does here |
| --- | --- | --- |
| `world` | The venue holding the game | Groups the app's UI and owns the score. |
| `signal(owner = world, value = 0)` | A scorekeeper announcing the current score | Keeps a number and tells the UI when it changes. |
| `Text("Score: ${score()}")` | The scoreboard display | Reads the score and stays up to date. |
| `score.update { it + 1 }` | Awarding one point | Replaces the old score with the old score plus one. |
| `Column` | A vertical stack of signs | Arranges the labels and buttons. |

The comparison explains the connection, not a real sports timer: no scoring
rules or match clock are built in. You provide those rules in your game.

## Try a small change

Change the button to award two points:

```kotlin
Button("Earn two points") { score.update { it + 2 } }
```

Save, run normally again, and check that the display goes from 0 to 2 to 4.
The congratulation message appears at 4 because the condition is `score() >= 3`.
The automated check updates the signal directly, so try the button yourself too.
