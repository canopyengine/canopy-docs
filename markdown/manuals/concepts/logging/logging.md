<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Logging from an application

Canopy uses structured logging so messages can carry useful context without putting formatting into gameplay code.
Applications normally let App initialize and close logging. Use a logger for your own subsystem or class.

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
