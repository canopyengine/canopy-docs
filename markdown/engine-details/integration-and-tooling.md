<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Platform boundaries and development tooling

The engine defines runtime contracts, input/data interfaces and diagnostics. Adapters integrate external libraries;
platforms compose an application host. Backend-specific behavior belongs in those layers, not in dependency or node
resolution. The [architecture table](engine-architecture.md) lists enabled Gradle modules.

## Enabled hosts and excluded code

TerminalApp composes Mordant input, terminal file entries, CommandPromptHost and terminal presentation. Async producers
publish queued input; its synchronous frame loop drives the shared EngineLoop. HeadlessApp launches the LibGDX
HeadlessHost. Platform-specific host controls are installed through App.installBackendHandle.

Desktop source remains excluded by settings.gradle.kts because stale platform/adapter references need repair.
Graphics, animation and physics files there are not verified by the enabled build. Document their status as unavailable
rather than copying desktop-only types into runnable examples. No platform is silently disabled to satisfy tests.

## Compiler and runtime contract

The compiler is a Gradle included build with isolated Gradle-host and compiler-host artifacts. The io.canopy.compiler
plugin compiles supported ordinary Node properties into guarded NodeState slots and installs mandatory node-state
checks. Consumer compilation must use compatible compiler/tooling/runtime versions. The internal NodePropertyTransform
runs separately before validation; CanopyCompilerRule service providers and NodeStateRule remain validation-only.
The transform removes instance payload fields, preserves declaration order and rewrites field accesses through guarded
runtime hooks. Slot identities include the declaring class and property, so inherited same-named properties remain
independent. Zero/null defaults preserve JVM reads before initialization. Existing engine delegates remain untouched.

NodeDefinition stays strict and unchanged: Java, previously compiled or missing-plugin consumers with unmanaged instance
fields are rejected before state allocation. No trusted marker exempts transformed classes. Unsupported property forms
receive source diagnostics, and runtime-hook incompatibility reports CANOPY_NODE_PROPERTY_ABI. Physical field reflection,
Java field access and field-based persistence need migration; see [custom node state](../manuals/concepts/core/nodes/nodes.md#compiler-enforced-custom-state).
Resource/reactive ownership remains explicit and independent of automatic storage.

After validation, NodeConstructionTransform wraps ordinary Node constructor calls in the inline runtime rollback
boundary. Successful nested boundaries commit to their enclosing boundary, including nonlocal returns. Failure releases
only newly constructed participants and preserves the original exception. Builders guard initialization callbacks;
Java, reflection and precompiled factories require the explicit `nodeConstruction` fallback. Boundaries are synchronous
and game-thread confined. Known eager suspension and constructor callable references receive source diagnostics.
See [failed construction](../manuals/concepts/core/nodes/nodes.md#failed-construction) for cleanup and migration limits.

## Test tooling and verification

AppTestDriver can enter/frame/resize/stop an app without launching its backend, or delegate launch and launchAsync.
In-memory asset entries let persistence/resource tests avoid filesystem services. Prefer deterministic observable
contracts over sleeps and execution-order assumptions; registry tests reset global state around each test.

The engine targets JDK 25; the compiler host uses its configured JDK 17 toolchain. Use the checked-in wrapper and
version catalog rather than old module examples. Root test, ktlintCheck and build include the compiler build.
coverageReport aggregates JVM and compiler tests and enforces the configured 60% line gate. Report desktop exclusion
and any unavailable check; do not lower the gate, skip tests or reinterpret a site build as code-example compilation.

Structured logging uses io.canopy.engine subsystem names and immutable node diagnostics. Hot loops avoid routine
per-node messages. Intentional terminal rendering is distinct from engine diagnostics. Read
[Logging design](log/logging.md) for routing and configuration; source locations and causes/suppressed cleanup failures
help diagnose lifecycle errors without reading disposed state.

CanopyCompilerTests and compiler Gradle integration tests verify consumer rules and plugin wiring. CanopyAppTests,
CanopyScreenTests and enabled platform tests exercise host composition. See
[Testing an application](../manuals/guides/testing-applications.md) and
[Installation](../manuals/getting-started/installation.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
