# Managers and injection

`Manager`, `ManagersRegistry`, `manager`, `lazyManager`, `InjectionManager`,
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
Registry exit calls managers and then clears registrations and resolution cache.
`withScope` tears down the previous global scope before installing and entering
the new one; it is not a nested per-request dependency scope.

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
There is no constructor injection, graph resolution or automatic scope support.
Duplicate injectable types fail; teardown clears providers.

Registries and lifecycle dispatch expect one serialized engine thread.
