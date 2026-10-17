<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Manager registry and injection design

Managers are application services, not node-tree entries. In the foundation branch, each App owns a linked registration
map, successful-lookup cache and lifecycle guards. ManagersRegistry exposes the active app's state through a singleton
access point; standalone drivers use its fallback scope. All registration, resolution, lifecycle dispatch and teardown belong to the
serialized engine thread. Only one App can run per JVM process. The singleton selects its owned state; it does not
provide thread-local runtime selection or simultaneous independent registry instances.

## Why ownership remains necessary

The scope holds registrations, the lookup cache, lifecycle guards and diagnostic mode for one App. Startup reserves
it before host side effects. A rejected App cannot dispose the active App's managers, and shutdown retains the
reservation through the application exit callback and logging cleanup. A fresh App can then start without inheriting
registrations or diagnostic mode. These safeguards support successive runs and failure recovery.

Async shutdown controls and queued input still cross threads within one App. Their synchronization does not make
registry maps, node state or lifecycle callbacks safe for arbitrary concurrent access. Construction, ownership and
reactive tracking use thread-local contexts for nested operations on the calling thread, not to select different Apps.

For 0.2.0, [host-services issue #224](https://github.com/canopyengine/canopy/issues/224) includes reviewing service
ownership and global lookup. Preserve the one-App contract and ordinary node API while assessing whether one
App-owned service access path can simplify the existing contracts. The final API remains to be designed.

## Lookup and registration

Concrete registration is keyed by runtime class. Duplicate concrete registrations fail. Registration traverses the
candidate's manager type closure and rejects overlap with an existing assignable manager type, excluding the broad
Manager interface. This keeps service-interface lookup unambiguous while allowing unrelated services.

Resolution checks an exact key first, then assignable instances. Zero matches means absence; one match is the result;
multiple matches throw IllegalStateException. Querying the broad Manager interface may be ambiguous. Nullable lookup
returns null only for zero matches and never catches errors. Required direct lookup preserves its IllegalStateException
for absence; required property delegation reports NoSuchElementException through the dependency core.

getManager and getManagerOrNull share the successful-result cache. Misses are not cached. Registration/removal clears
the cache, so optional lookups recover after registration and delegates observe replacements. `has` checks matching
without promising that a broad query is unambiguous. `unregister` resolves assignable registration keys and removes one;
it does not invoke onExit. lazyManager caches a result outside the registry and does not follow cache invalidation.

## Lifecycle and failures

withScope exits the old standalone scope, registers its builder entries, then enters managers. It is not a stack of nested
request scopes. It and direct registry exit are rejected while an App is active. App reserves its scope before host
startup and releases it only after shutdown callbacks and logging cleanup; failed cleanup still releases the reservation.
Entry and normal lifecycle dispatch use registration order; frame dispatch propagates failures.
During entry, frame, physics and resize callbacks, registration/removal, scope replacement and nested lifecycle dispatch
are rejected with IllegalStateException. Lookup remains available. The dispatch guard is released even when a callback
throws, so registration can resume after the caller handles that failure. Apply structural changes outside the dispatch
pass on the same serialized engine thread; mutations are not automatically queued.
During pause, SceneManager receives real time while other managers receive zero frame delta and skip physics callbacks.

Exit guards against nested teardown, attempts every manager callback in registration order and finally clears both maps.
It preserves the first failure with distinct later exceptions suppressed. Lookup remains available during callbacks;
registration/removal and lifecycle redispatch are rejected until exit finishes. Afterward optional access returns null.

## Injection providers

InjectionManager is a separate exact-type provider registry. A provider can return a singleton or create a value per read.
There is no constructor injection or dependency graph. Registration uses ambient NodeLifetime ownership by default;
an explicit null owner selects application ownership, while a node owner removes its provider on tree exit.
The removal callback checks provider identity so an old registration cannot delete a later replacement.

Injection invokes the provider synchronously. Missing providers and mismatches are errors, and provider failures propagate.
Providers and cleanup registrations are cleared at shutdown. Neither inject nor lazyInject is a nullable utility.

## Verification

GlobalDependencyTests verifies matching, cache invalidation, nullable absence, ambiguity and shutdown lookup.
ManagersRegistryTeardownTests verifies teardown failure aggregation and reentrancy guards. NodeCleanupGuaranteeTests
covers injectable ownership and replacement. See [Manager guide](../manuals/concepts/core/managers/managers.md)
and [Dependencies](dependencies.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
