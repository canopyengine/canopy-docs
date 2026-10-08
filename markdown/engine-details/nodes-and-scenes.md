<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Node state, lifecycle and scene dispatch

Node is a public facade over private NodeState. The owning SceneManager strongly retains payloads; the facade holds a
weak reference. NodeState holds hierarchy, custom property values, behavior, provider state and cleanup registrations.
Destroying a node releases engine state even when user code retains the facade. This does not revoke independent user
references to values previously obtained from a node.

## State safety

Construction validates the concrete class before allocating retained state and requires a registered SceneManager.
`nodeProperty(initial)` stores values in NodeState and gives the facade a final delegate holding only an immutable key.
Reads and writes validate lifetime. Computed accessors and static/companion declarations are allowed; ordinary fields,
constructor properties, lazy delegates and outer captures are rejected by compiler checks. Runtime NodeDefinition
validation protects Java and precompiled consumers by checking exact supported delegate field types.

GlobalDependency and NodeDependency describe lookups and retain metadata only. AssetDelegate retains an immutable
resource key. They are allowed concrete field types; arbitrary delegates and the sealed Dependency base are not.

## Hierarchy and entry

Children have unique sibling names and linked insertion order. Attach rejects cycles, existing parents, cross-manager
ownership and destroyed nodes. Rename and reparent refresh descendant paths. Public children are immutable
membership snapshots rebuilt after mutations. Context transparency affects searches, not actual parents or inheritance.

The node DSL executes on initial tree entry. Initial entry runs nodeInit and the builder once, then enters behavior and
children. Ready traversal visits children before the parent behavior. Re-entry calls entry hooks without rebuilding the
DSL. Update hooks run before descendants; behavior updates run after descendants. Final engine traversal methods ensure
subclasses cannot omit child traversal by forgetting super. Normal exit visits children before the parent behavior.

Valid detachment preserves state, descendants and context definitions. Removing a child exits and unregisters its subtree;
reattachment establishes a new entry lifetime. Reparenting within an entered tree preserves subscriptions and entry
resources; crossing entered/detached boundaries performs exit/entry.

## Hierarchy depth

Entry, readiness, exit, frame/physics/input dispatch and path refresh currently recurse through descendants.
Their usable depth depends on the JVM stack size, compilation state and callbacks in the application; the engine
has no universal maximum-depth guarantee. Manager subtree indexing and whole-tree dependency lookup use iterative
traversal, but transparent child dependency lookup can recurse through context wrappers.

Prefer broad hierarchies for large populations. Renaming or moving a subtree refreshes every descendant path;
long chains also retain increasingly long path strings. Successful construction alone does not demonstrate that
entry, processing and cleanup can handle the same depth. Treat `StackOverflowError` as a fatal JVM failure rather
than an ordinary callback exception: an interrupted operation may have already changed membership or lifecycle state.

## Cleanup and permanent destruction

| Lifetime mechanism | Boundary |
| --- | --- |
| onRemoval callbacks/jobs | Next tree exit/removal; cancellation registration is one-shot |
| Node lifetime resource slots | Tree exit; reacquire on a subsequent entry |
| onDestroy callbacks | Permanent destruction only |
| NodeState payload | Released at permanent destruction |

NodeLifetime provides thread-local ambient ownership during managed callbacks and restores prior scope in finally.
Resource-specific code registers generic cleanup without coupling Node to reactive or asset implementations.

queueFree marks deletion pending. Destruction occurs after a complete frame/physics traversal, including failed
traversals, so a queued node can still receive callbacks until the boundary. Overlapping requests are deduplicated.
Destruction invalidates the whole subtree first, attempts exit and cleanup, unregisters indexes/groups/system matches,
and disposes payloads in reverse traversal order. First failures are rethrown with later distinct failures suppressed.

After invalidation, gameplay state throws NodeDestroyedException. Identity, validity, deletion status and immutable
exitMetadata remain available for diagnostics. Cleanup hooks should capture resources rather than read destroyed
properties. Fatal JVM errors and coroutine cancellation preserve their types.

## Scene and system indexes

Scene replacement exits/unregisters the old hierarchy, changes the root and emits onSceneReplaced, then registers/builds
the new hierarchy. This is observable ordering, not a transactional rollback guarantee. A failure leaving the old scene
can prevent installing the new one. SceneManager owns ordered node membership, group and matching-system indexes as
well as retained state. Membership uses node identity, so independent registered hierarchies can contain equal path
strings without replacing each other. Path lookup resolves against the hierarchy; no manager path-to-node cache is used.
Rename and same-tree reparenting preserve membership order. Unregistration followed by registration appends a node at
the end. System backfill snapshots that order and rechecks current membership and entered state after callbacks.

Systems initialize before matching nodes are delivered. Adding a system to an entered manager immediately initializes
and backfills it; removal releases matches before onUnregister. Matching uses assignable types and accepted child types.
Phase lists are ordered by ascending priority; membership and phase snapshots invalidate on mutation. During processing,
current membership and entered/pause eligibility are rechecked so removed nodes in an old snapshot are skipped.

FramePre systems precede node updates; FramePost follows. Physics has corresponding pre/post phases. Before/after system
hooks still run while paused; per-node processing requires canProcess. Directly processing matchingNodes requires the
system author to apply gameplay eligibility. Manager exit releases lifetimes/matches but retains reusable scene structure.

## Verification

NodeTests, NodeLifetimeTests, NodeStateSafetyTests, NodeCleanupGuaranteeTests, NodePauseTests and
SceneManagerContractTests exercise lifecycle, mutation, invalid access, cleanup failures, index removal and phase order.
DeepTreeLifecycleTests covers moderate-depth ordering, subtree removal, deferred destruction, input consumption and pause
inheritance. The opt-in `tooling/benchmarks/deep-tree` probe in the engine repository measures sampled stack limits and
operation allocations in isolated JVMs; its results describe that fixture and JVM, not a supported-depth guarantee.
CanopyCompilerTests exercises field/capture restrictions. See [Nodes](../manuals/concepts/core/nodes/nodes.md),
[Tree systems](../manuals/concepts/core/nodes/tree-systems.md) and [Dependency design](dependencies.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
