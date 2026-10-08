<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Logging

Logging APIs live in `:engine`, under `io.canopy.engine.logging`. `CanopyLogs`
supplies Logger instances through a replaceable provider; its default delegates
to SLF4J. Core and headless applications use host-owned logging by default.
Optional managed files and the banner live in `:adapters:logback`, published as
`io.canopy:adapters-logback`. Terminal applications select that adapter by default.

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
optional `runId` and `banner`. Core/headless consumers opt in explicitly; terminal
consumers can replace their default with a configured policy.

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

The adapter adds session-filtered appenders and removes/stops only those it
owns. It never resets or stops the host LoggerContext, replaces host appenders,
changes logger levels/additivity, sets `LOG_DIR`, or installs a logger provider.
Host levels, filters and routing still determine which events reach managed
files; nonadditive host loggers may bypass the managed attachment points.
Console formatting and verbosity remain host-controlled. The optional banner
uses terminal output separately from diagnostic log events.

Run metadata is scoped through MDC and restored afterward. Existing host global
fields remain intact. Background work outside an application callback stays
host-controlled; use `app.withLoggingContext { ... }` on the calling thread to
scope it explicitly while the session is active. This does not propagate context
to a newly created thread or make engine operations thread-safe.

The adapter captures SLF4J events reaching its appenders. A custom Canopy provider
can route logs elsewhere, so selecting managed Logback does not guarantee those
custom logs appear in its files.

## Provider timing and migration

`CanopyLogs.setProvider` affects future logger creation. Existing logger objects,
including cached `EngineLogs` loggers, retain the provider that created them.
Install a provider before constructing the loggers it should control; logging
policies do not replace providers or reroute cached loggers.

Earlier application entry always reset Logback, replaced global run metadata and
set `LOG_DIR`. Core/headless entry now leaves the host configuration alone; opt
into the adapter for managed files/banner. Terminal keeps managed output by
default but honors host routing and levels. The old `canopy-logback.xml` bootstrap
resource and direct engine `ConsoleBanner` helper are removed; configure managed
banner output through `LogbackLogging.Config.banner`. Applications needing custom
console presentation should use their host output facilities.

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
