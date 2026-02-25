---
title: Logging System
parent: Engine Details
nav_order: 1
permalink: /engine-details/logging-system/
---

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="{{ '/' | relative_url }}">
    <img src="{{ '/assets/canopy-icon.png' | relative_url }}" width="50" alt="Canopy Engine logo">
  </a>
</p>

# 🌲 Logging

Canopy provides a structured, engine-grade logging system designed to:

* Keep **engine logs separate** from user application logs
* Write logs to a dedicated `.canopy/logs` directory
* Remain quiet by default
* Be powerful when debugging
* Avoid verbose XML configuration

Canopy uses **SLF4J** as a logging API and provides a default Logback implementation via an optional module.

## 📦 Architecture

### Core

* `canopy-core` depends only on `slf4j-api`
* No logging backend is bundled into core

### Default Logging Module

* `canopy-logging-logback`
* Configured programmatically in Kotlin
* No XML required
* Can be disabled or replaced

All engine logs are emitted under the namespace:

```text
canopy.*
```

This guarantees isolation from user logs.

## 🗂 Log Location

By default, engine logs are written to:

```text
.canopy/logs/
```

Log directory resolution order:

1. `-Dcanopy.logs.dir=...`
2. `CANOPY_LOGS_DIR` environment variable
3. `<current working directory>/.canopy/logs`
4. `<user.home>/.canopy/logs` (fallback)

Log files are named:

```text
canopy-<runId>.log
```

Log rotation is enabled (time + size based).

## 🧱 Engine/User Log Isolation

Engine logs:

* Use the `canopy.*` namespace
* Do **not propagate** to the root logger
* Are written only to the engine log file

User application logs:

* Use their own packages
* Are fully controlled by the user’s logging configuration
* Are never redirected or modified by Canopy

## 📄 Log Format (Default)

Default format:

```text
yyyy-MM-dd HH:mm:ss.SSS LEVEL [thread] logger - message
```

Example:

```text
2026-02-20 12:41:33.482 INFO  [main] canopy.engine.boot - Canopy 0.1.0 launching
```

Includes:

* Millisecond timestamp
* Log level
* Thread name
* Short logger name
* Message
* Stacktrace (if present)

File logs are plain text (no color codes).

## 🚦 Log Levels

### ERROR

* Fatal engine errors
* Unrecoverable subsystem failures
* Unhandled exceptions

### WARN

* Fallback applied
* Invalid user configuration corrected
* Repeated performance issues (rate-limited)

### INFO

* Startup milestones
* Backend selection
* Scene loading
* State transitions

### DEBUG

* Diagnostic details
* Resource load timings
* ECS scheduling information

### TRACE

* Per-frame or per-entity events
* High-frequency internal operations

> Rule: If something happens every frame, it must not log above `TRACE`.

## 🔇 Anti-Spam Policy

To keep logs readable:

* Repeated warnings are rate-limited
* Some warnings are emitted once and suppressed afterward
* Suppressed counts may be summarized at shutdown
* Per-frame logging never occurs above `TRACE`

## 🚀 Startup Header

Each log file begins with a startup summary:

```text
------------------------------------------------------------
Canopy 0.1.0
Run ID: 20260220-124133-pid4812
OS: Windows 11
Java: 21.0.2
Working Dir: /project
Log File: .canopy/logs/canopy-20260220-124133.log
------------------------------------------------------------
```

This helps with:

* Bug reports
* Environment diagnostics
* Run identification

## 🏁 Shutdown Footer

On clean shutdown:

```text
------------------------------------------------------------
Canopy shutdown complete
Run ID: ...
Uptime: ...
Total frames: ...
Warnings: ...
Errors: ...
------------------------------------------------------------
```

If a fatal error occurred:

```text
Canopy terminated due to fatal error
```

The footer confirms whether shutdown completed successfully.

## ⚙ Runtime Configuration

Canopy supports system-property configuration:

```bash
-Dcanopy.logging.level=DEBUG
-Dcanopy.logging.format=text|json
-Dcanopy.logging.filter=canopy.render=DEBUG
-Dcanopy.logs.dir=/custom/path
-Dcanopy.logging.disabled=true
```

Logging installation:

* Happens automatically during `CanopyApp.launch()`
* Does nothing if disabled
* Does nothing if user already configured logging
* Never overrides user application logging

## 🔮 Future Extensions (Optional)

Planned or possible enhancements:

* JSON structured log mode
* Frame index tracking via MDC
* Profiling summaries
* CLI log parsing
* Crash dump integration

## 🎯 Design Philosophy

Canopy logging should feel:

* Professional
* Deterministic
* Structured
* Quiet by default
* Powerful when debugging
* Respectful of user applications

Engine logs belong to the engine.
User logs belong to the user.

# 🔧 Logging Implementation Overview

This section describes how Canopy installs and manages its logging system internally.

This is intended for engine contributors.

## 📦 Module Structure

Canopy logging is split into two parts:

### 1️⃣ `canopy-core`

* Depends only on `slf4j-api`
* Contains no logging backend
* Emits logs under the namespace:

```text
canopy.*
```

### 2️⃣ `canopy-logging-logback`

* Optional default implementation
* Depends on `logback-classic`
* Configures Logback programmatically (no XML)
* Installed automatically during engine launch

This separation ensures:

* Engine core remains backend-agnostic
* Users can replace logging backend
* No hard dependency on Logback in core

## 🚀 Installation Lifecycle

Logging is installed at the very beginning of:

```kotlin
CanopyApp.launch()
```

Internally:

```kotlin
CanopyLogging.install()
```

### Installation Rules

The installer will:

* Detect if SLF4J binding is Logback
* Detect if user already configured appenders
* Respect `-Dcanopy.logging.disabled=true`
* No-op if any of the above conditions apply

Canopy never overrides an existing user logging configuration.

## 🗂 Log Directory Resolution

Directory resolution order:

1. `-Dcanopy.logs.dir=...`
2. `CANOPY_LOGS_DIR` environment variable
3. `<cwd>/.canopy/logs`
4. `<user.home>/.canopy/logs`

The directory is created if missing.

Log files use a run identifier:

```text
canopy-<timestamp>-pid<processId>.log
```

## 🧱 Logger Isolation

All engine loggers are children of:

```text
canopy
```

During installation:

* A rolling file appender is attached to `logger("canopy")`
* `additive = false` is set

This ensures:

* Engine logs do not propagate to root logger
* User application logs remain unaffected
* No duplicate output occurs

## 📄 Log Format

Default text format:

```
yyyy-MM-dd HH:mm:ss.SSS LEVEL [thread] logger - message
```

Configured programmatically via `PatternLayoutEncoder`.

File logs:

* Plain text
* No color codes
* Include stacktraces

## 🔁 Rolling Policy

Canopy uses:

* Time + size based rolling
* Log compression for archived logs
* Max history (default ~7 days)
* Total size cap

This prevents uncontrolled disk growth.

## 🧮 Runtime Configuration

Supported system properties:

| Property                  | Purpose                   |
| ------------------------- | ------------------------- |
| `canopy.logging.disabled` | Disable installer         |
| `canopy.logs.dir`         | Custom log directory      |
| `canopy.logging.level`    | Global engine level       |
| `canopy.logging.filter`   | Subsystem-level overrides |
| `canopy.logging.format`   | `text` or `json`          |

These are parsed during installation.

## 🏁 Run Tracking

Canopy tracks run metadata:

* Start timestamp
* Run ID
* Frame count (if available)
* Warning and error counts

### Startup Header

Written at beginning of log file.

### Shutdown Footer

Written during normal shutdown via `finally` block.

If shutdown is abnormal, footer may be absent.

## ⚠️ Warning & Error Counting

Warning and error counts may be implemented via:

* Custom appender wrapper
* Level-based counters
* MDC tracking (future)

These counts are summarized in the footer.

## 🔮 JSON Mode (Optional Future)

If `canopy.logging.format=json`:

* Switch encoder to JSON
* Emit structured fields:

    * timestamp
    * level
    * thread
    * logger
    * message
    * runId
    * optional frame index

This allows integration with:

* CLI tooling
* CI pipelines
* Log processors

Text mode remains the default.

## 🧩 Extension Points

Future extensions may include:

* Frame index MDC
* Profiling summaries
* Crash dump integration
* CLI log inspection tools
* Remote log streaming

The logging architecture is intentionally minimal in core to allow this growth.

## 🎯 Contributor Rules

When adding logs to Canopy:

1. Use the appropriate level.
2. Never log per-frame events above `TRACE`.
3. Avoid log spam.
4. Prefer structured messages:

   ```kotlin
   logger.info("Loaded scene {}", sceneName)
   ```
5. Do not use `println`.
6. Keep engine logs under `canopy.*` namespace.

## 🧠 Design Principle

Logging in Canopy must be:

* Deterministic
* Quiet by default
* Diagnostic when needed
* Isolated from user applications
* Replaceable by advanced users

Logging is part of the engine’s developer experience.