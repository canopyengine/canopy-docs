<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Logging

Logging APIs live in `:engine`, under `io.canopy.engine.logging`. `CanopyLogs`
supplies Logger instances through a replaceable provider; its default delegates
to SLF4J. In proposed alpha.2, terminal and headless applications select file-only
managed logging automatically. Custom core hosts retain `LoggingPolicy.Host`
unless they select an adapter. Managed files and the banner live in
`:adapters:logback`, published as `io.github.canopyengine:adapters-logback`.
Alpha.1 is immutable and does not contain this default-behavior correction.

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

## Application logging policy

Call `app.logging(policy)` before entry or launch. `LoggingPolicy.Host` leaves
logging configuration and resource ownership with the host: it creates no files
or banner, does not select an SLF4J backend, and does not change global context.
Choose a host SLF4J binding or install a custom Canopy provider as appropriate.

```kotlin
import io.canopy.engine.logging.LoggingPolicy
import io.canopy.platforms.terminal.app.terminalApp

val app = terminalApp {
    logging(LoggingPolicy.Host)
}
```

For managed output, include the optional adapter and use
`io.canopy.adapters.logback.LogbackLogging`. Its `Config` selects `baseLogDir`,
optional `runId`, `banner` and `preserveHostOutput`. Custom core hosts opt in;
terminal/headless consumers can configure their default policy.

```kotlin
import java.nio.file.Path
import io.canopy.adapters.logback.LogbackLogging

app.logging(LogbackLogging(LogbackLogging.Config(
    baseLogDir = Path.of("game-logs"),
    banner = false,
)))
```

Each entry acquires a separate `LoggingSession`. Application entry, updates,
physics, resize, manager calls and exit callbacks run in its context. Session end
records the outcome before the application exit callback, and resources close
after that callback. Startup failure releases only the session that entry acquired.
Logging-session isolation does not make simultaneous applications independent:
the existing manager registry is process-global, and app entry replaces its scope.
If a custom context wrapper fails before invoking a teardown action, App records
the error and attempts that action in host context. An action already invoked is
not repeated if context restoration fails. Custom policies must clean partial
resources if `start` fails before returning.
Session `close` must be harmless when repeated.

## Managed Logback resources

Default directories are `.canopy/logs/<timestamp>-<unique-id>/` relative to the
working directory. An explicit run ID must be a fresh portable directory name;
parent markers, separators and drive-prefix colons are rejected. Managed
sessions write `engine.log`, `engine.jsonl`, `app.log` and `app.jsonl`, with daily
and size rotation at 10 MB and 30-day history. Session metadata includes run ID,
engine version, start/end times and duration.

The default adapter temporarily detaches existing host appenders and applies
engine DEBUG and game/root DEBUG levels with routing to its four files. It does
not reset or stop the LoggerContext, set `LOG_DIR`, or replace logger providers.
The final session close restores the previous appenders, levels and additivity.
Partial startup also restores acquired routing and releases owned resources.
Install host configuration before starting managed sessions; changing it while
those sessions are active is unsupported. Existing backend TurboFilters and
custom providers can still affect which messages are captured.
An optional banner uses terminal output separately from diagnostic events.

Ordinary unscoped events go to the sole active default session, including game
logs emitted on other threads. Explicit session MDC isolates events when more
than one managed session is active; ambiguous unscoped events are not duplicated
into several game runs. Supply `app.withLoggingContext { ... }` around synchronous
background logging for overlapping sessions. Context is restored afterward and
does not propagate automatically across new threads or coroutine suspension.
Terminal startup and background input diagnostics opt into the session context.

`LogbackLogging.Config(preserveHostOutput = true)` keeps host appenders, levels,
filters and additivity. In that mode only scoped events are captured, and
nonadditive host loggers can bypass managed appenders. `LoggingPolicy.Host` leaves
all logging to the host and creates no managed files. Default file-only and
preserving sessions cannot overlap within one Logback context; attempting it
fails with an actionable error rather than changing another session's policy.

The adapter captures SLF4J events reaching its appenders. A custom Canopy provider
can route logs elsewhere, so selecting managed Logback does not guarantee those
custom logs appear in its files.

## Provider timing and migration

`CanopyLogs.setProvider` affects future logger creation. Existing logger objects,
including cached `EngineLogs` loggers, retain the provider that created them.
Install a provider before constructing the loggers it should control; logging
policies do not replace providers or reroute cached loggers.

Before #208, application entry reset Logback, replaced global run metadata and
set `LOG_DIR`. #208 changed the defaults to preserve host output, which allowed
Logback's default console appender to cover terminal gameplay. Alpha.2 restores
file-only managed defaults while retaining session ownership and host restoration.
It removes the need for a project-level `logback.xml` workaround. Configure banner
output through `LogbackLogging.Config.banner`; diagnostic output remains in files.

No `canopy.logging.*`, `CANOPY_LOGS_DIR`, automatic frame-counter summary or log
rate limiter is provided. Error details use the selected logging backend.

Use ERROR for failures, WARN for recoverable issues, INFO for major lifecycle
events, DEBUG for diagnostics, and TRACE for hot-path traces. Avoid routine
per-frame logs. Prefer lazy message lambdas and useful fields; do not use println
for engine diagnostics. See [logging guidelines](../../contributing/logging-guidelines.md).

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
