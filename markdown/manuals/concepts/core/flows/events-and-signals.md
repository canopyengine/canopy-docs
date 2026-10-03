# Events, signals, computed values and effects

Import these APIs from `io.canopy.engine.core.flows.events`.

## Events

`event()`, `event<A>()`, and `event<A, B>()` create events with zero to two
arguments. `connect` returns an `EventDisconnectHandler`; call `disconnect()`
to unsubscribe. Events also expose listener-based `disconnect`, `clear`,
`size`, and `isEmpty`. `emit` invokes callbacks synchronously on the caller's thread.

```kotlin
import io.canopy.engine.core.flows.events.event

val changed = event<Int>()
val listener: (Int) -> Unit = { value -> check(value >= 0) }
val subscription = changed.connect(listener)
changed.emit(1)
subscription.disconnect()
```

Callbacks are weakly referenced. Retain the callback or disconnect handle for
as long as the subscription is needed; an unowned inline callback may disappear
after garbage collection. Copy-on-write listener storage allows subscription
changes during emission, but does not serialize application state in callbacks.

## Signals

```kotlin
import io.canopy.engine.core.flows.events.signal
import io.canopy.engine.core.flows.events.computed

val health = signal(100)
val alive = computed { health() > 0 }
val current = health()
health.update { it - 10 }
val stillAlive = alive()
```

Read with `signal()`; its internal value is private. `update` replaces the value
and emits only when old and new are unequal. `asSignal()` wraps an existing
value. Callbacks are synchronous; `flow` replays the current value to new
collectors and can drop intermediate values for slow collectors.

Signals require serialized reads/writes on one thread. Volatile visibility is
not atomic read-modify-write. Mutating an object already stored in a signal does
not trigger equality-based notification: prefer replacement immutable values.

## Computed values

`computed { ... }` initializes lazily on first read or observation. Reads of
signals/computed values track dependencies. Recomputations replace subscriptions
with the newly read dependency set. Use `untrack { state() }` to read without
tracking. Keep computed blocks free of state-changing side effects.

## Effects

`effect { ... }` runs immediately and reruns for changes in tracked dependencies.
Retain the returned Effect and call `dispose()` when its owner exits.
Dependencies are discovered after a run. Changes to an already subscribed
dependency during a run request **one coalesced rerun after that run**; effects
that keep changing their dependencies indefinitely can keep rerunning.
A first-run write before subscriptions exist is not guaranteed a rerun.

Effects execute synchronously, not in a background task or frame queue.
Tracking uses thread-local frames; effect/signal state remains intended for one
serialized thread. Dispose disconnects dependencies and suppresses later runs.
