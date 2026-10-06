<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Contexts and reactive flow design

Contexts provide values by position in the hierarchy. Reactive flows provide notifications and derived state. Neither
system makes a dependency delegate reactive: repeated lookup and change subscriptions are separate mechanisms.

## Context scopes

Context is a transparent Node wrapper for searches. Actual parent links still include it for lifecycle, process modes
and ancestor queries. Keyed providers use String keys (ContextKey supplies a string); typed providers use exact KClass
keys in an independent map. NodeDependency walks from owner toward root and stops at the first registering scope.
A registered null shadows outer values. Providers are invoked on every read; failures are not suppressed.
Reusable exit keeps definitions. Permanent destruction releases them with node payload state.

## Events and connection ownership

EventConnections stores weak references to listeners and handles, with a mutation-invalidated dispatch snapshot.
Retaining a disconnect handle retains its listener. Node-owned handles are retained until exit; unowned listeners
need an application-held listener or handle. Disconnect is idempotent and releases both callback and ownership storage.
During emit, connections removed since the snapshot are skipped; new connections wait for the next dispatch.

Callbacks execute synchronously on the emitting thread with ambient node ownership suppressed. Explicit ownership is
needed for new resources created inside those callbacks. Owning a source and owning a connection are separate:
source destruction disposes outgoing connections; consumer tree exit disconnects that consumer's owned subscription.
Shared sources use an explicit null owner and need explicit disposal when their application lifetime ends.

## Signals, computations and effects

Signal stores the current value and emits only when old != new. Reads via invoke register with the active TrackingContext
frame. update callbacks run synchronously. Volatile visibility does not make read/modify/write atomic or authorize
concurrent access. Its read-only SharedFlow replays one value, buffers changes and drops oldest overflow; slow collectors
may skip intermediate values. Disposing resets replay but does not cancel independently running collector jobs.

Computed evaluates lazily, caches output in a shared internal signal, and diffs the set of tracked inputs after each
calculation. Changing a conditional dependency removes old subscriptions. Computation ownership is fixed at creation,
not at first read. Node-owned computations dispose on exit and must be recreated for re-entry. Derivations run without
ambient ownership and should remain pure.

Effect runs immediately and records signals/computations read by its block. Later subscribed changes rerun it
synchronously. Changes during a running effect coalesce into a requested rerun; a first-run write before subscriptions
exist is not guaranteed another run. Construction failure disposes registrations. Disposing releases the captured
closure and input connections. Shared effects need a retained reference and explicit disposal.

SourceLifetime weakly references its node owner and binds permanent destruction. It rejects use of destroyed sources.
Computed additionally binds tree exit; effects and consumer connections use removal lifetimes. Nested tracking frames
and untrack restore state in finally, rather than leaking the last dependency set into unrelated code.

## Verification

EventTests, SignalTests and ComputedTests cover delivery, equality and tracking. NodeLifetimeTests and
NodeCleanupGuaranteeTests cover source/consumer ownership, disposal, re-entry and shared lifetimes.
See [Contexts](../manuals/concepts/core/flows/contexts.md) and
[Events and reactive values](../manuals/concepts/core/flows/events-and-signals.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
