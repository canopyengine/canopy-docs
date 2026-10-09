# A scoreboard you can run

Think of the scoreboard at a sports match: someone changes the score, and the
board shows the new number. This example does the same with a signal and a label.
It targets proposed Canopy `0.1.0-alpha.2` and JDK 25. This logging fix is not yet
published. Use the matching source build until publication; see the
[build setup reference](../../markdown/manuals/getting-started/build-setup.md).

From the documentation repository root, run:

```powershell
# Windows
.\examples\terminal-starter\gradlew.bat -p examples/scoreboard installDist
.\examples\scoreboard\build\install\canopy-scoreboard\bin\canopy-scoreboard.bat
```

```sh
# Linux or macOS
bash examples/terminal-starter/gradlew -p examples/scoreboard installDist
./examples/scoreboard/build/install/canopy-scoreboard/bin/canopy-scoreboard
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
pass `--smoke` to the final launcher command. It changes the score, resets it
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

Save, run the `installDist` command again, then launch normally and check that the display goes from 0 to 2 to 4.
The congratulation message appears at 4 because the condition is `score() >= 3`.
The automated check updates the signal directly, so try the button yourself too.

Canopy writes `.canopy/logs/engine.log` and `app.log` automatically; no
project `logback.xml` is needed. Previous runs move into `history/<run-id>/`.
Append `--diagnostics` to the installed launcher for a separate run folder with
text and structured JSONL files. Omit it on the next launch for normal logging.
See [logging](../../markdown/manuals/concepts/logging/logging.md) for retention
and installed-game locations. Launch directly for raw keyboard controls; Gradle's
`run` task can cause line-input fallback on Windows.
