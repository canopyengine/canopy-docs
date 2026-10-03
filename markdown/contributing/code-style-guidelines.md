
!!!!DRAFT!!!

### Prefer clarity

Code should be easy to read and reason about.
Avoid unnecessary abstractions or overly complex implementations.

---

### Follow existing patterns

Before introducing a new system:

* explore existing modules
* follow established architectural patterns
* avoid introducing inconsistent design choices

Consistency across the engine is more important than clever solutions.

---

### Document public APIs

Public engine APIs should include documentation comments.

Example:

```kotlin id="ewm6fe"
/**
 * Replaces the current scene with the given root node.
 */
fun asSceneRoot()
```

Clear documentation ensures that engine behavior remains understandable to users and contributors.

---
## Current engine baseline

This guidance targets 0.1.0-dev2: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).
