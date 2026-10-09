# Terminal starter

A visible external Canopy consumer: reactive text, buttons, conditional UI,
a command overlay and bounded startup/shutdown smoke. No gameplay framework is
introduced. Requires JDK 25, Kotlin 2.4.10 and matching Canopy `0.1.0-alpha.2`
artifacts. This update targets the proposed logging-fix release, **not yet
published**. After publication, Gradle resolves it from Maven Central with no
local engine checkout. For source validation beforehand, see the
[build setup reference](../../markdown/manuals/getting-started/build-setup.md).

The earlier alpha.1 remote check does not validate this new version.
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

TerminalApp configures file-only diagnostics automatically. No project
`logback.xml` is required. Normal runs write `.canopy/logs/engine.log` and
`.canopy/logs/app.log` under the folder you launched from. The next normal launch moves
the previous files into `history/<run-id>/`. History keeps up to ten completed
runs within a 100 MiB budget, deleting oldest runs first. Large logs can leave
fewer than ten runs; active runs are preserved.

For a bug report, enable structured diagnostics at startup:

```sh
./build/install/canopy-terminal-starter/bin/canopy-terminal-starter --diagnostics
```

On Windows, append `--diagnostics` to the `.bat` launcher instead.
That run gets a separate folder with `engine.log`, `app.log`, `engine.jsonl`
and `app.jsonl`. Leave out the flag on the next launch to use normal logging.
The banner and game UI remain visible; diagnostic messages do not cover them.
See [logging](../../markdown/manuals/concepts/logging/logging.md) for explicit
project, installed-game and custom locations.
The alpha.1 logging regression is corrected in the proposed alpha.2 engine.
