<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# 🌲 Logging System

Canopy provides a **structured logging system** designed for reliability, clarity, and minimal interference with user applications.

The logging infrastructure aims to:

* keep **engine logs separate from application logs**
* remain **quiet during normal execution**
* provide **detailed diagnostics when needed**
* avoid intrusive configuration
* allow advanced users to **replace the logging backend**

Canopy uses **SLF4J** as its logging API and ships with a default **Logback-based backend**.

---

# Architecture Overview

The logging system is intentionally modular.

```text id="k7dnyu"
canopy-core
     │
     ▼
SLF4J API
     │
     ▼
Logging Backend
(Logback by default)
```

| Module                   | Responsibility                 |
| ------------------------ | ------------------------------ |
| `canopy-core`            | logging API (via `slf4j-api`)  |
| `canopy-logging-logback` | default Logback implementation |

This separation keeps the engine **logging-backend agnostic** while still providing a robust default configuration.

📌 **Diagram — Logging Architecture**

<!-- DIAGRAM: logging-architecture -->

---

# Engine vs Application Logs

A core design goal of Canopy is **strict separation between engine logs and application logs**.

### Engine Logs

* namespace: `canopy.*`
* written to the **engine log file**
* do **not propagate to the root logger**

### Application Logs

* use the **application’s package namespace**
* follow the user’s logging configuration
* are never modified by Canopy

```text id="kcktxb"
Root Logger
   │
   ├─ canopy.*        → engine log file
   │
   └─ user packages   → application logging configuration
```

📌 **Diagram — Logger Isolation**

<!-- DIAGRAM: logger-isolation -->

This ensures that engine diagnostics never interfere with the application's own logging setup.

---

# Log Location

Engine logs are written to:

```id="mng5sl"
.canopy/logs/
```

The directory is resolved using the following order:

1. `-Dcanopy.logs.dir=...`
2. `CANOPY_LOGS_DIR` environment variable
3. `<current working directory>/.canopy/logs`
4. `<user.home>/.canopy/logs`

Log files follow this naming pattern:

```id="y52c3l"
canopy-<runId>.log
```

Example:

```id="9km4ie"
canopy-20260220-124133-pid4812.log
```

Each engine run produces its own log file.

---

# Log Format

The default output format is plain text:

```
yyyy-MM-dd HH:mm:ss.SSS LEVEL [thread] logger - message
```

Example:

```
2026-02-20 12:41:33.482 INFO  [main] canopy.engine.boot - Canopy 0.1.0 launching
```

Each log entry includes:

* timestamp (millisecond precision)
* log level
* thread name
* logger name
* message
* stacktrace (if present)

File logs are always **plain text** and contain **no terminal color codes**.

---

# Log Levels

| Level   | Purpose                                   |
| ------- | ----------------------------------------- |
| `ERROR` | fatal errors and unrecoverable failures   |
| `WARN`  | fallback behavior or configuration issues |
| `INFO`  | major lifecycle events                    |
| `DEBUG` | diagnostic information                    |
| `TRACE` | high-frequency internal events            |

> **Rule:** events occurring every frame must **never log above `TRACE`**.

---

# Log Noise Control

To keep logs readable, Canopy enforces an **anti-spam policy**.

> [!WARNING]
> This section is a work-in-progress.

Potential safeguards include:

* rate-limiting repeated warnings
* emitting some warnings only once
* summarizing suppressed warnings during shutdown
* restricting high-frequency logs to `TRACE`

These measures help prevent logs from becoming excessively large or unreadable.

---

# Startup Header

> [!WARNING]
> This section is a work-in-progress.

Each log file begins with a diagnostic header.

Example:

```
------------------------------------------------------------
Canopy 0.1.0
Run ID: 20260220-124133-pid4812
OS: Windows 11
Java: 21.0.2
Working Dir: /project
Log File: .canopy/logs/canopy-20260220-124133.log
------------------------------------------------------------
```

This information helps when:

* diagnosing issues
* reporting bugs
* identifying runtime environments

---

# Shutdown Summary

When the engine shuts down normally, the log ends with a summary.

Example:

```
------------------------------------------------------------
Canopy shutdown complete
Run ID: ...
Uptime: ...
Total frames: ...
Warnings: ...
Errors: ...
------------------------------------------------------------
```

If the engine terminates due to a fatal error, the log records:

```
Canopy terminated due to fatal error
```

---

# Runtime Configuration

> [!WARNING]
> This section is a work-in-progress.

Logging behavior can be modified using system properties.

Example:

```bash
-Dcanopy.logging.level=DEBUG
-Dcanopy.logging.format=text|json
-Dcanopy.logging.filter=canopy.render=DEBUG
-Dcanopy.logs.dir=/custom/path
-Dcanopy.logging.disabled=true
```

| Property                  | Description                            |
| ------------------------- | -------------------------------------- |
| `canopy.logging.disabled` | disables Canopy logging initialization |
| `canopy.logs.dir`         | overrides the log directory            |
| `canopy.logging.level`    | sets the default engine log level      |
| `canopy.logging.filter`   | subsystem-level log overrides          |
| `canopy.logging.format`   | log output format (`text` or `json`)   |

---

# Logging Installation

Logging is installed automatically during application startup.

```kotlin
CanopyApp.launch()
```

Internally this triggers:

```kotlin
CanopyLogging.init()
```

The installer performs several safety checks.

Logging will **not install** if:

* logging has been explicitly disabled
* a non-Logback SLF4J binding is detected
* the user already configured appenders

Canopy **never overrides user logging configurations**.

---

# Log Rotation

The default Logback configuration includes:

* time-based rotation
* size-based rotation
* compressed archived logs
* capped log history

This prevents logs from consuming excessive disk space.

---

# Run Tracking

Each engine run receives a **Run ID**.

The logging system may track metrics such as:

* startup timestamp
* runtime duration
* warning count
* error count
* frame count (when available)

These metrics may be summarized during shutdown.

---

# Contributor Guidelines

When adding logs to the engine:

1. Use the appropriate log level.
2. Avoid logging per-frame events above `TRACE`.
3. Prevent repeated log spam.
4. Prefer structured logging.

Example:

```kotlin
logger.info("Loaded scene {}", sceneName)
```

Additional rules:

* never use `println`
* always log under the `canopy.*` namespace

---

# Design Philosophy

The logging system is designed to be:

* **quiet during normal execution**
* **informative during debugging**
* **isolated from application logs**
* **deterministic and structured**

Engine logs belong to the **engine**, while application logs belong to the **application**.
