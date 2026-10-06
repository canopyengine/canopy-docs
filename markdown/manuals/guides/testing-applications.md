<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md"><img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo"></a>
</p>

# Testing applications without a host loop

Use the checked-in engine wrapper for tests and the Canopy compiler plugin for consumer node declarations. Application
logic can exercise entry, frames, resize and teardown without opening a terminal or launching the headless host.

## Drive the shared lifecycle

The tooling/devtools module provides testHeadlessApp and appTestDriver:

```kotlin
import io.canopy.devtools.app.testHeadlessApp
import io.canopy.engine.core.managers.SceneManager
import io.canopy.engine.core.managers.manager
import io.canopy.engine.core.nodes.types.empty.EmptyNode

fun exerciseScene() {
    val driver = testHeadlessApp {
        onEnter {
            manager<SceneManager>().currScene = EmptyNode("World")
        }
    }
    driver.start()
    try {
        driver.frame(1f / 60f)
        driver.resize(800, 600)
        check(manager<SceneManager>().currScene?.name == "World")
    } finally {
        driver.stop()
    }
}
```

Declare the devtools dependency in the test configuration of projects that need this driver. The function runs on the
calling test thread and does not launch a backend. start initializes real managers; frame performs physics steps plus a
variable update. Use exact deltas to test ordering without sleeping. launch and launchAsync are available for separate
host integration tests.

## Keep global state isolated

ManagersRegistry is global. Standalone registry tests reset it before and after each case; application tests stop their
driver in finally. Do not run tests that mutate the same global registry concurrently. Prefer in-memory AssetEntry and
WritableAssetEntry fixtures for files, persistence and loaders. Seed any randomness and avoid network services.

Use observable assertions for entry order, node membership, optional lookup recovery, resource release and error behavior.
Keep bug regressions with the implementation. Compiler consumer fixtures test both supported declarations and actionable
rejection of unmanaged state; successful runtime tests alone do not prove compiler integration.

## Run the repository checks

```powershell
.\gradlew.bat test ktlintCheck build coverageReport
```

On other systems use ./gradlew with the same tasks. The configured toolchains, wrapper and version catalog determine
versions. coverageReport enforces the current aggregate line gate; do not lower it to accommodate a change.
Desktop is already excluded from settings, so enabled checks do not validate its graphics/physics files. State that
limitation when reporting results.

See [Testing guidelines](../../contributing/testing-guidelines.md),
[Integration design](../../engine-details/integration-and-tooling.md) and [Application lifecycle](../concepts/app/application.md).

---

[Documentation index](/markdown/index.md)

<p align="center">Canopy Engine Documentation • 2026</p>
