
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