<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Managers and injection

`Manager`, `ManagersRegistry`, `manager`, `managerOrNull`, `lazyManager`, `InjectionManager`,
`inject` and `lazyInject` live in `io.canopy.engine.core.managers`.

Managers implement application-wide services and callbacks: `onEnter`,
`onUpdate`, `onPhysicsUpdate`, `onResize`, and `onExit`.
Apps register common managers and platform providers before lifecycle entry.

```kotlin
import io.canopy.engine.core.managers.Manager
import io.canopy.engine.core.managers.ManagersRegistry
import io.canopy.engine.core.managers.manager

class Scores : Manager {
    var total = 0
}

fun registerScores() {
    ManagersRegistry.register(Scores())
    manager<Scores>().total += 1
}
```

The global registry resolves concrete classes and assignable manager interfaces.
Duplicate concrete types and overlapping lookup interfaces are rejected.
`lazyManager<T>()` caches the first lookup; avoid accessing it before registration
or keeping it across registry replacement. `unregister(KClass)` removes a
registration but is not a replacement for explicit service cleanup.
Registry exit attempts every manager in registration order, then clears
registrations and resolution cache even when shutdown callbacks fail. The first
failure is rethrown with later distinct failures suppressed; repeating shutdown
does not repeat callbacks. Nested registry exit is harmless. During shutdown,
lookup remains available for dependent cleanup, but registering/removing managers
and dispatching entry, frame, physics or resize callbacks is rejected to prevent
partially shut-down services from being re-entered or skipped.
`withScope` tears down the previous global scope before installing and entering
the new one; it is not a nested per-request dependency scope.

During manager entry, update, physics-update and resize callbacks, registering or
removing managers, replacing the scope and nesting lifecycle dispatch are rejected
with IllegalStateException. Lookups remain available. Make structural changes
outside the callback pass on the engine thread; the registry does not queue them.
If a callback fails, the dispatch guard is released before the error propagates.

## Immediate and delegated lookup

Use `managerOrNull<T>()` for immediate optional access from any application scope, or
`ManagersRegistry.getManagerOrNull(T::class)` when the type is explicit. These return null only
when no matching registration exists; ambiguity and other failures propagate. Required immediate
manager access retains its IllegalStateException for absence.

The similarly named factories in `io.canopy.engine.core.queries` create GlobalDependency delegates:
`val scores by manager<Scores>()` resolves on each read, and `managerOrNull<Scores>()` observes
missing registrations and later recovery. No node reference or tree membership is required.
Required delegated absence throws NoSuchElementException naming the property. Alias imports when
using both forms. See the complete [dependency guide](../dependencies.md) for compilable examples.

## Injectable application objects

InjectionManager stores providers by exact type and invokes them on demand:

```kotlin
import io.canopy.engine.core.managers.InjectionManager
import io.canopy.engine.core.managers.manager

class Settings(val debug: Boolean)

fun registerSettings() {
    manager<InjectionManager>().registerInjectable(Settings::class) {
        Settings(debug = true)
    }
}
```

Use `inject<Settings>()` or `lazyInject<Settings>()` with their corresponding
imports. A provider decides whether to return a shared instance or a new object.
There is no constructor injection or graph resolution. Registration uses the ambient node
removal lifetime when present; an explicit null owner selects application ownership.
Duplicate injectable types fail; teardown clears providers.

Registries and lifecycle dispatch expect one serialized engine thread.
See [manager design](../../../../engine-details/managers.md) for matching, cache and teardown internals.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
