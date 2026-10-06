<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Manager registry and injection design

Managers are global application services, not node-tree entries. ManagersRegistry is a singleton linked registration
map plus a successful-lookup cache. All registration, resolution, lifecycle dispatch and teardown belong to the
serialized engine thread. Separate applications do not have simultaneous independent registry instances.

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

withScope exits the old global scope, registers its builder entries, then enters managers. It is not a stack of nested
request scopes. Entry and normal lifecycle dispatch use registration order; frame dispatch propagates failures.
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
