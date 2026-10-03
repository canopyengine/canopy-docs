# Logging

Logging APIs currently live in `:engine`, under `io.canopy.engine.logging`.
`CanopyLogs` supplies Logger instances through a replaceable provider; its
default provider delegates to SLF4J. The application bootstrap configures Logback.
There is no separate `canopy-logging-logback` module.

```kotlin
import io.canopy.engine.logging.logger

private val log = logger("example.game")

fun reportLoaded(name: String) {
    log.info("scene" to name) { "Scene loaded" }
}
```

Use `EngineLogs` for engine subsystems. Its actual logger names start with
`io.canopy.engine.*`. Application categories should use their own package names.
`LogContext.with(key to value) { ... }` scopes structured context.

## Current bootstrap behavior

`App.launch()` initializes internal CanopyLogging. By default logs are under
`.canopy/logs/YYYYMMDD-HHmmss/` relative to the working directory. The bundled
configuration defines engine.log, engine.jsonl, app.log and app.jsonl files,
console appenders, and daily/size rotation with 30-day history.

The bootstrap currently resets an existing Logback LoggerContext and loads the
bundled `canopy-logback.xml`. It does **not** promise to preserve application
appenders or automatically decline initialization for a custom configuration.
The bundled configuration routes `io.canopy.engine` separately from the root.
Bootstrap uses the `LOG_DIR` property internally; earlier proposed
`canopy.logging.*` switches and `CANOPY_LOGS_DIR` overrides are not supported APIs.

Session start/end include run identity, engine version and elapsed duration.
There is no implemented automatic warning/error/frame-counter summary or log
rate limiter. Error details propagate through the ordinary logging backend.

Use ERROR for failures, WARN for recoverable issues, INFO for major lifecycle
events, DEBUG for diagnostics, and TRACE for hot-path traces. Avoid routine
per-frame logs. Prefer lazy message lambdas and useful fields; do not use println
for engine diagnostics. See [logging guidelines](../../contributing/logging-guidelines.md).
