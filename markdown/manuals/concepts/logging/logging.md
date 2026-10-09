<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Logging from an application

Think of two notebooks for one game run: one records how the engine is doing,
and the other records what your game is doing.

In the proposed **0.1.0-alpha.2** correction, terminal and headless applications
set up those files automatically. Diagnostics stay off the console. You do not
need to write a `logback.xml` or set up appenders in your project.

| Files under `.canopy/logs/` | What they contain |
| --- | --- |
| `engine.log` | Readable engine diagnostics and session start/end. |
| `app.log` | Readable messages from your game. |

These are plain UTF-8 text files: open them in any text editor. The next normal launch
moves the previous run into `history/<run-id>/` and starts fresh current files.
Think of the current files as the notebooks on your desk, with previous ones
on a shelf. At least the ten most recent completed runs are kept. Older managed
runs are removed when needed to meet the 100 MiB storage target; active runs
and those ten recent runs are protected, so the target is not a hard limit.

The default location is relative to where you start the app. The banner and UI
are intentional display output and remain on screen. Warnings and errors go to
the files too, so they do not cover your game.

## Turn on diagnostic mode

Diagnostic mode is like adding a machine-readable copy of each notebook when
investigating a bug. It creates a separate `<run-id>/` folder containing
`engine.log`, `app.log`, `engine.jsonl` and `app.jsonl`. Each line in a `.jsonl`
file is one JSON record that a tool can read without parsing the text format.

Select the mode **before the app starts**. Your game decides whether to expose
a command-line switch; the terminal starter and scoreboard use `--diagnostics`:

```kotlin
import io.canopy.adapters.logback.LogbackLogging
import io.canopy.platforms.terminal.app.terminalApp

fun main(args: Array<String>) {
    val mode = if ("--diagnostics" in args) {
        LogbackLogging.Mode.DIAGNOSTIC
    } else {
        LogbackLogging.Mode.STANDARD
    }
    terminalApp {
        logging(LogbackLogging(LogbackLogging.Config(mode = mode)))
        // Add your scene here, as shown in the terminal starter.
    }.launch()
}
```

For example, run the starter's installed launcher with `--diagnostics`. Leave
that flag out to return to normal logging on the next launch. There is no live
mode switch, and neither mode requires a `logback.xml`.

Alpha.1 is already published and retains the regression; this behavior requires
the corrected alpha.2 runtime, whose publication is pending.

## Write a game message

Use a logger for your class or subsystem. In this example, calling `loaded(1)`
inside the running app writes a message to `app.log`:

```kotlin
import io.canopy.engine.logging.logger

class SessionLog {
    private val log = logger<SessionLog>()

    fun loaded(slot: Int) {
        log.info("event" to "session.loaded", "slot" to slot) { "Loaded session" }
    }

    fun failed(error: Throwable) {
        log.error(error, "event" to "session.load.failed") { "Session loading failed" }
    }
}
```

To keep logging entirely under your host configuration in a terminal app:

```kotlin
import io.canopy.engine.logging.LoggingPolicy
import io.canopy.platforms.terminal.app.terminalApp

val app = terminalApp {
    logging(LoggingPolicy.Host)
}
```

Custom core hosts can select `io.canopy.adapters.logback.LogbackLogging()` when
they include the adapter; terminal and headless hosts choose it automatically.
Choose the location explicitly when packaging your game. Canopy does not guess
whether a launch is development or an installed game:

```kotlin
import java.nio.file.Path
import io.canopy.adapters.logback.LogbackLogging

// Development: the project's own log directory.
val projectLogs = LogbackLogging.Config(baseLogDir = Path.of(".canopy", "logs"))

// Installed game: a writable, game-specific directory for the current user.
val installedLogs = LogbackLogging.Config.forInstalledGame("MyStudio", "RabbitMeadow")

// A tool or test can choose an exact directory instead.
val customLogs = LogbackLogging.Config(baseLogDir = Path.of("game-logs"))

app.logging(LogbackLogging(installedLogs.copy(banner = false)))
```

| Installed-game platform | Default log directory |
| --- | --- |
| Windows | `%LOCALAPPDATA%\MyStudio\RabbitMeadow\logs` |
| Linux | `$XDG_STATE_HOME/MyStudio/RabbitMeadow/logs`, falling back to `~/.local/state/…` |
| macOS | `~/Library/Logs/MyStudio/RabbitMeadow` |

Use your own publisher and game names. Saves and settings do not belong in the
logs directory. When two game processes use the same directory, the extra
standard run gets its own text-only folder under `history/`, so neither process
overwrites the other's current files. Cleanup only removes recognized,
completed Canopy runs; it skips active runs and unrelated files.

With one managed application active, ordinary game and background messages go
to its files. With overlapping managed sessions, use
`app.withLoggingContext { ... }` around synchronous background logging so the
message identifies the right application. Do not keep that thread-local context
open across coroutine suspension.

For an existing host that should keep its output while also capturing scoped
Canopy logs, use `LogbackLogging.Config(preserveHostOutput = true)`. That option
is explicit; it is not the default for a game. It cannot overlap a default
file-only session in the same backend. `LoggingPolicy.Host` creates no managed
files and leaves all routing to the host.

Message lambdas defer formatting until needed. Use trace/debug for investigation, info for useful lifecycle events, warn
for recoverable problems, and error with the original throwable for failures. Structured fields make slot, node identity
or operation searchable. Avoid routine per-frame/per-node logging; it obscures useful output and costs work in hot paths.

Use LogContext.with for scoped fields when several related operations share context; it restores previous context after
the block. Engine code uses its io.canopy.engine subsystem APIs. Intentional terminal rendering belongs to the platform
output API; println is not an engine diagnostic mechanism.

Destroyed-node diagnostics preserve identity, type, last path and operation without reading invalid gameplay state.
When cleanup fails, inspect causes and suppressed exceptions as well as the first message.

For output routing, files, configuration and provider integration, read
[Logging design](../../../engine-details/log/logging.md) and
[Contribution logging guidance](../../../contributing/logging-guidelines.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
