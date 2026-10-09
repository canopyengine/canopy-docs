# Logging Guidelines

All engine subsystems must use the **Canopy logging system**.

See:

* **[Logging manual](../manuals/concepts/logging/logging.md)**
* **[Logging implementation and ownership](../engine-details/log/logging.md)**

Important rules:

* use the correct log level
* avoid logging in hot loops
* use structured logging for diagnostics; intentional terminal rendering is separate
* keep logs under the `io.canopy.engine.*` namespace

Core does not select a logging backend. In proposed alpha.2, terminal and
headless apps compose the managed Logback adapter by default: two text logs,
file-only output, and optional structured diagnostic mode. The adapter owns its
session resources and restores host configuration on final close without
resetting the backend. Explicit `LoggingPolicy.Host` leaves routing to the host.
Preserve causes and suppressed cleanup failures.

---
## Current engine baseline

This guidance targets 0.1.0-alpha.1: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).
