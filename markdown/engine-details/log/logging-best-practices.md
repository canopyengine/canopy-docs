<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# 🌲 Logging Best Practices

This guide describes how logging should be used within the Canopy engine.

Consistent logging practices help ensure that logs remain:

- readable
- useful for debugging
- free from unnecessary noise
- predictable for users and contributors

These guidelines apply **only to the engine codebase**.

---

# Core Principles

Logging in Canopy should follow these principles:

| Principle | Description |
|------|------|
| Quiet by default | logs should not overwhelm normal usage |
| Useful when debugging | logs should provide meaningful diagnostic information |
| Deterministic | logs should be predictable and structured |
| Non-intrusive | engine logs must never interfere with user logs |

The logging system exists primarily to help:

- debug engine issues
- diagnose user problems
- understand engine behavior

---

# Logger Naming

All engine logs must use the **`canopy.*` namespace**.

Example:

```kotlin
private val logger = LoggerFactory.getLogger("canopy.engine.scene")
````

This ensures that:

* engine logs are isolated
* user application logs remain untouched
* filtering works correctly

Never log under the root namespace.

---

# Choosing Log Levels

Choosing the correct log level is essential.

| Level | When to use                                |
| ----- | ------------------------------------------ |
| ERROR | fatal failures or unrecoverable conditions |
| WARN  | invalid configuration or fallback behavior |
| INFO  | important lifecycle events                 |
| DEBUG | diagnostic details useful for debugging    |
| TRACE | extremely frequent internal operations     |

---

## Example

```kotlin
logger.info("Scene loaded: {}", sceneName)
```

Example warning:

```kotlin
logger.warn("Invalid configuration detected, falling back to default")
```

Example debug log:

```kotlin
logger.debug("Texture loaded in {} ms", loadTime)
```

---

# Avoid Logging in Hot Paths

Logging inside frequently executed code can cause:

* performance degradation
* large log files
* unreadable logs

Per-frame events must never log above `TRACE`.

Example of acceptable usage:

```kotlin
logger.trace("Entity {} updated", entityId)
```

Example of problematic usage:

```kotlin
logger.info("Entity {} updated", entityId)
```

---

# Avoid Log Spam

Repeated logs can quickly overwhelm log files.

Prefer:

* rate-limiting repeated warnings
* logging once and suppressing duplicates
* summarizing repeated events

Bad example:

```kotlin
logger.warn("Invalid component detected")
```

If this occurs every frame, the logs become unusable.

Better approach:

```
Warn once and suppress further occurrences.
```

---

# Prefer Structured Messages

Always prefer parameterized logging instead of string concatenation.

Correct:

```kotlin
logger.info("Loaded scene {}", sceneName)
```

Incorrect:

```kotlin
logger.info("Loaded scene " + sceneName)
```

Benefits:

* avoids unnecessary string allocation
* improves performance
* integrates better with structured logging

---

# Do Not Use println

Engine code must never use:

```
println()
System.out.println()
```

Reasons:

* bypasses logging configuration
* pollutes console output
* cannot be filtered or redirected

Always use the logging system instead.

---

# Logging Exceptions

Exceptions should always be logged with the stacktrace.

Example:

```kotlin
logger.error("Failed to load asset {}", assetPath, exception)
```

Avoid:

```kotlin
logger.error("Failed to load asset")
```

This hides useful diagnostic information.

---

# Logging During Startup

Startup logs should communicate:

* engine version
* environment information
* backend selection
* initialization milestones

These logs help diagnose early startup failures.

Example:

```kotlin
logger.info("Initializing rendering backend: {}", backend)
```

---

# Logging During Shutdown

Shutdown logs should summarize:

* runtime duration
* warnings
* errors
* critical events

These summaries help diagnose problems after application termination.

---

# Common Mistakes

### Logging inside tight loops

Avoid logging inside loops that run frequently.

### Excessive INFO logs

INFO logs should be reserved for **important events**, not diagnostics.

### Missing context

Always include enough context for logs to be meaningful.

Bad example:

```
logger.warn("Invalid state")
```

Better example:

```
logger.warn("Invalid state detected in PhysicsSystem: {}", state)
```

---

# Example Logging Patterns

### Engine Startup

```kotlin
logger.info("Canopy {} launching", version)
```

### Resource Loading

```kotlin
logger.debug("Loaded texture {} in {} ms", textureName, loadTime)
```

### Configuration Fallback

```kotlin
logger.warn("Invalid resolution {}, falling back to {}", invalid, fallback)
```

### Fatal Failure

```kotlin
logger.error("Renderer initialization failed", exception)
```

---

# Summary

Engine logging should be:

* structured
* informative
* minimal during normal operation
* detailed during debugging

Following these guidelines ensures that Canopy logs remain a **powerful diagnostic tool without becoming overwhelming**.