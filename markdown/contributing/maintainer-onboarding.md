# Maintainer onboarding

This guide targets the terminal 0.1.0 foundation integration branch. The branch
is under development; the new UiNode API and app-owned runtime are not yet
implemented. Use the matching engine and documentation branches, and check the
engine's `docs/proposals/foundation-integration.md` for remaining work.

You should already understand Kotlin classes, lambdas, delegated properties,
generics and exceptions, and basic Gradle/Git usage. Compiler development also
requires Kotlin IR and compiler-plugin knowledge. The engine documentation
cannot replace those prerequisites.

## Establish a working baseline

Follow [build setup](../manuals/getting-started/build-setup.md), then record your
branch and commit before running the checks:

```sh
git branch --show-current
git rev-parse HEAD
./gradlew test ktlintCheck build coverageReport
```

Use `gradlew.bat` on Windows. Preserve the configured toolchains and compiler
version. Publish matching engine/compiler artifacts locally before running an
external consumer; see [your first project](../manuals/getting-started/first-project.md).
Do not combine an integration engine with a different compiler version.

## Find the owner before changing behavior

| Location in the engine repository | Responsibility |
|---|---|
| `engine/.../app/App.kt`, `EngineLoop.kt` | Startup, frame coordination, pause and shutdown |
| `engine/.../core/managers/ManagersRegistry.kt` | Manager registration, lookup and lifecycle dispatch |
| `engine/.../core/managers/SceneManager.kt` | Scene membership, systems and safe tree mutations |
| `engine/.../core/nodes/` | Node identity, guarded state, hierarchy and lifetimes |
| `engine/.../core/flows/` | Events, signals, computed values, effects and dependency tracking |
| `engine/.../ui/` | UI bindings, retained identity, measurement, layout and focus |
| `engine/.../input/`, `commands/` | Input publication/consumption and typed command execution |
| `engine/.../data/`, `logging/`, `math/` | Resources and saving, logging policy, immutable vectors |
| `platforms/terminal/` | Terminal host, metrics, cell composition and presentation |
| `platforms/headless/`, `adapters/` | Host/backend integrations |
| `tooling/compiler/` | Gradle integration and compiler transforms in separate source sets |
| `tooling/devtools/`, `tooling/launcher/`, `tooling/central/` | Testing helpers, launcher and publication |

The abbreviated engine paths are under `src/main/kotlin/io/canopy/engine/`.
Each area has corresponding tests. Desktop sources are disabled and are not
covered by the enabled-platform build. Rust CLI development is separate.

Read [runtime details](../manuals/guides/runtime-details.md) and
[engine architecture](../engine-details/engine-architecture.md), then trace
one frame through the actual implementation. EngineLoop dispatches fixed steps
before the frame update. App finishes application and manager updates before
UI work. UiManager processes pending bindings, lays out changed content and
paints; the terminal surface presents the combined world/UI frame once.
Effects execute synchronously; UI expressions are queued by subscriptions.
Neither mechanism means conditions are polled every frame.

In the current integration implementation, manager lookup still uses the global
registry. App-local screen configuration is fixed, but the broader runtime
ownership migration is pending. The agreed hosting target is one running App
at a time, not simultaneous applications.

## Prove you can explain and change it

Complete these exercises using the guides and source, without relying on
conversation history:

1. Run an external terminal app, resize it, pause/resume and shut it down.
2. Trace a node from construction to entry, removal, reentry and destruction.
   Explain which state survives removal and what invalidates a retained facade.
3. Trace a signal write into a UI label. Identify subscription, binding,
   measurement, painting and output boundaries separately.
4. Read the screen-isolation tests. Explain why preconfiguring two apps must not
   overwrite their startup blocks.
5. Read the failed-frame tests. Explain why backend abort discards display work
   without undoing gameplay changes, and why an abort error must not hide the
   original error.
6. Change a layout or input behavior, add a regression that fails first, then
   run the [required checks](testing-guidelines.md).
7. Find the compiler's state, construction and UI transforms, and the consumer
   fixtures. Explain why those transforms and engine APIs must ship together.

After the UiNode migration, add a styled reusable component and embed an
ordinary map node. That exercise is an acceptance gate for the completed branch,
not a supported API claim today.

Record any step requiring undocumented knowledge. Fix the guide or diagnostic
alongside the implementation. Independent onboarding is demonstrated by someone
completing these tasks; a documentation page count or estimated learning time
does not establish it.
