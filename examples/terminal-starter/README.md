# Terminal starter

A visible external Canopy consumer: reactive text, buttons, conditional UI,
a command overlay and bounded startup/shutdown smoke. No gameplay framework is
introduced. Requires JDK 25, Kotlin 2.4.10 and matching Canopy `0.1.0-alpha.1`
artifacts published to Maven Central. No local engine checkout is required.

The clean build and smoke run have been verified against the remote alpha release.
Follow [installation](../../markdown/manuals/getting-started/installation.md)
and [the walkthrough](../../markdown/manuals/getting-started/first-project.md).

```sh
bash ./gradlew installDist
./build/install/canopy-terminal-starter/bin/canopy-terminal-starter
```

On Windows, use PowerShell in this example folder:

```powershell
.\gradlew.bat installDist
.\build\install\canopy-terminal-starter\bin\canopy-terminal-starter.bat
```

Launch directly for keyboard controls. `gradlew run` can supply a pipe rather
than a real console on Windows, causing fallback to line input. Automated smoke
checks may still use Gradle:

```sh
bash ./gradlew run --args=--smoke
```

Arrows select buttons; Enter activates. Escape toggles commands in raw mode;
`:console` opens them in line mode. `help`, `add`, `pause`, `resume`, `quit` are
available. Opening the overlay captures input without pausing updates. Resize
interactively to check layout.

The wrapper is copied unchanged from the pinned engine (Gradle 9.8.0). The build
applies `io.github.canopyengine.compiler`; omitting it does not produce an equivalent example.
Both signals have explicit world ownership and are disposed by scene teardown.
The smoke submits add/pause/resume, checks population, runs three updates and requests
normal exit; it is not a keyboard-input test.

## Where logs go

The example's `src/main/resources/logback.xml` keeps diagnostic logs off the
terminal. TerminalApp writes managed logs to `.canopy/logs/<run-id>/` under the
folder you launched from, including `engine.log`, `engine.jsonl`, `app.log` and
`app.jsonl`. The startup banner and game UI still appear on screen.

Keep this configuration when copying the example. Without it, Logback's default
console output is preserved by the engine and can cover the UI. This file
configures the logger; it does not turn off managed file logging.
