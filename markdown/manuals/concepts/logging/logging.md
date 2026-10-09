<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Logging from an application

Think of two notebooks for one game run: one records how the engine is doing,
and the other records what your game is doing.

In the proposed **0.1.0-alpha.2** correction, terminal and headless applications
set up those files automatically. Diagnostics stay off the console. You do not
need to write a `logback.xml` or set up appenders in your project.

| Files under `.canopy/logs/<run-id>/` | What they contain |
| --- | --- |
| `engine.log` | Readable engine diagnostics and session start/end. |
| `app.log` | Readable messages from your game. |
| `engine.jsonl` / `app.jsonl` | The same categories as structured records for tools. |

Each launch gets its own folder. The folder is relative to where you start the
app. The banner and UI are intentional display output, so they can remain on
screen. A warning or error is still a diagnostic: it goes to the files too.

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
To choose another directory or hide the banner, configure it before launch:

```kotlin
import java.nio.file.Path
import io.canopy.adapters.logback.LogbackLogging

app.logging(LogbackLogging(LogbackLogging.Config(
    baseLogDir = Path.of("game-logs"),
    banner = false,
)))
```

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
