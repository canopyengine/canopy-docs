!!!DRAFT!!!

# Logging Guidelines

All engine subsystems must use the **Canopy logging system**.

See:

* **Logging System**
* **[Logging Best Practices](logging-guidelines.md)**

Important rules:

* use the correct log level
* avoid logging in hot loops
* never use `println`
* keep logs under the `io.canopy.engine.*` namespace

---
## Current engine baseline

This guidance targets 0.1.0-dev2: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).
