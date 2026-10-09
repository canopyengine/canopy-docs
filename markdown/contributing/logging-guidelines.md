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

Core does not select a logging backend. Terminal composes the managed Logback
adapter by default; headless consumers select their own backend. Keep logging
configuration and session resources owned by the host, and never reset unrelated
application logging implicitly. Preserve causes and suppressed cleanup failures.

---
## Current engine baseline

This guidance targets 0.1.0-alpha.1: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).
