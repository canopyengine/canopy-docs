<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Logging from an application

Canopy uses structured logging so messages can carry useful context without putting formatting into gameplay code.
Core and headless apps use your host logging configuration by default. Terminal apps also create managed per-run
files and a startup banner. Select a policy with `app.logging(...)` before entry; App closes only its acquired session.
Use a logger for your own subsystem or class.

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

For managed output in core/headless apps, include `io.github.canopyengine:adapters-logback`
and select `io.canopy.adapters.logback.LogbackLogging()`. Its configuration can
choose the log directory and disable the banner. Managed output respects host
logger levels and routing. It does not replace your provider or reset host
logging configuration. Run metadata is scoped to application callbacks; use
`app.withLoggingContext { ... }` for additional work on the calling thread.

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

## Keep diagnostics off a terminal game's screen

Managed logging adds `.canopy` files; it preserves the existing console logger.
If you use Logback without a configuration file, its default console output can
cover your game UI. The runnable terminal examples include this
`src/main/resources/logback.xml`:

```xml
<configuration>
    <logger name="io.canopy.engine" level="DEBUG" />
    <root level="INFO" />
</configuration>
```

It declares no console appender. TerminalApp still adds the managed per-run file
appenders, so session diagnostics go to `.canopy/logs/<run-id>/`. Keep the file
when copying an example. Logs are relative to the directory you launch from.
This does not suppress the startup banner or game output.

Managed files capture events carrying the application's logging context.
Background work must opt into `app.withLoggingContext { ... }`; arbitrary
background logs are not automatically captured. See the
[terminal starter](../../../../examples/terminal-starter/README.md) for launch
commands that preserve keyboard access.
