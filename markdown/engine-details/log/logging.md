<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# 🌲 Logging System

Canopy provides a **structured, engine-grade logging system** designed for reliability and clarity.

The system is built with the following goals:

- keep **engine logs separate** from user application logs
- avoid intrusive configuration
- remain **quiet by default**
- provide **powerful diagnostics when debugging**
- allow advanced users to replace the logging backend

Canopy uses **SLF4J** as its logging API and provides a default **Logback-based implementation**.

---

# Architecture Overview

The logging system is split into two modules.

📌 **Logging Architecture**

```text
canopy-core
    │
    ▼
SLF4J API
    │
    ▼
Logging Backend
(Logback by default)
````

| Module                   | Responsibility                 |
| ------------------------ | ------------------------------ |
| `canopy-core`            | Logging API only (`slf4j-api`) |
| `canopy-logging-logback` | Default Logback implementation |

This design keeps the engine **backend-agnostic**.

---

# Engine vs Application Logs

Canopy guarantees **strict separation** between engine logs and user logs.

### Engine Logs

* namespace: `canopy.*`
* written to the **engine log file**
* do **not propagate** to the root logger

### Application Logs

* use the user’s package namespace
* follow the user’s logging configuration
* are never modified by Canopy

📌 **Logger Isolation**

```text
Root Logger
   │
   ├─ canopy.*        → engine log file
   │
   └─ user packages   → user logging configuration
```

This prevents engine logs from interfering with application logs.

---

# Log Location

Engine logs are written to:

```
.canopy/logs/
```

Directory resolution order:

1. `-Dcanopy.logs.dir=...`
2. `CANOPY_LOGS_DIR` environment variable
3. `<current working directory>/.canopy/logs`
4. `<user.home>/.canopy/logs`

Log files are named:

```
canopy-<runId>.log
```

Example:

```
canopy-20260220-124133-pid4812.log
```

---

# Log Format

Default text format:

```
yyyy-MM-dd HH:mm:ss.SSS LEVEL [thread] logger - message
```

Example:

```
2026-02-20 12:41:33.482 INFO  [main] canopy.engine.boot - Canopy 0.1.0 launching
```

Each entry includes:

* timestamp (millisecond precision)
* log level
* thread name
* logger name
* message
* stacktrace (if present)

File logs are plain text and **contain no color codes**.

---

# Log Levels

| Level | Purpose                                        |
| ----- | ---------------------------------------------- |
| ERROR | fatal errors and unrecoverable failures        |
| WARN  | configuration corrections or fallback behavior |
| INFO  | major lifecycle events and milestones          |
| DEBUG | diagnostic information                         |
| TRACE | high-frequency internal events                 |

> Rule: **Anything that happens every frame must never log above `TRACE`.**

---

# Anti-Spam Policy

> [!WARNING]
> Section work-in-progress

To keep logs readable, Canopy enforces several safeguards.

* repeated warnings may be **rate-limited**
* some warnings may be **emitted once**
* suppressed warnings may be **summarized on shutdown**
* per-frame logging must never exceed `TRACE`

These rules prevent large logs from becoming unreadable.

---

# Startup Header

> [!WARNING]
> Section work-in-progress

Each log file begins with a diagnostic summary.

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

This information is useful when:

* diagnosing bugs
* reporting issues
* identifying runtime environments

---

# Shutdown Footer

On normal shutdown the log ends with a summary.

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

If a fatal error occurs:

```
Canopy terminated due to fatal error
```

---

# Runtime Configuration

> [!WARNING]
> Section work-in-progress

The logging system supports runtime configuration through system properties.

Example:

```bash
-Dcanopy.logging.level=DEBUG
-Dcanopy.logging.format=text|json
-Dcanopy.logging.filter=canopy.render=DEBUG
-Dcanopy.logs.dir=/custom/path
-Dcanopy.logging.disabled=true
```

| Property                  | Purpose                          |
| ------------------------- | -------------------------------- |
| `canopy.logging.disabled` | disable Canopy logging installer |
| `canopy.logs.dir`         | override log directory           |
| `canopy.logging.level`    | global engine log level          |
| `canopy.logging.filter`   | subsystem-level overrides        |
| `canopy.logging.format`   | text or JSON output              |

---

# Logging Installation



Logging is installed automatically during application startup.

```
CanopyApp.launch()
```

Internally this triggers:

```kotlin
CanopyLogging.init()
```

The installer performs several safety checks.

### Installation Rules

Logging will **not install** if:

* logging is disabled
* a non-Logback SLF4J binding is detected
* the user already configured appenders

Canopy never overrides user logging configurations.

---

# Log Rotation

The default Logback configuration uses:

* **time-based rotation**
* **size-based rotation**
* compressed archived logs
* capped log history

This prevents uncontrolled disk usage.

---

# Run Tracking

Each engine run is associated with a **Run ID**.

The logging system may track:

* startup timestamp
* runtime duration
* warning counts
* error counts
* frame counts (when available)

These metrics are summarized during shutdown.

---

# Future Extensions

Potential enhancements include:

* JSON structured logging
* frame index tracking
* profiling summaries
* CLI log parsing tools
* crash dump integration

The architecture intentionally keeps the core minimal to support future extensions.

---

# Contributor Guidelines

When adding logs to Canopy:

1. Use the correct log level.
2. Avoid logging per-frame events above `TRACE`.
3. Prevent repeated log spam.
4. Prefer structured logging.

Example:

```kotlin
logger.info("Loaded scene {}", sceneName)
```

5. Never use `println`.
6. Always log under the `canopy.*` namespace.

---

# Design Philosophy

The logging system should feel:

* **quiet during normal gameplay**
* **informative when debugging**
* **isolated from application logs**
* **deterministic and structured**

Engine logs belong to the engine.
User logs belong to the user.
