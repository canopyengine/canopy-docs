<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# First project

Let's put the pieces together: a **terminal app**, one **screen**, and a little
scene with a moving node. The example keeps the project small so you can see
where the build, launch and gameplay callbacks fit.

> [!NOTE]
> The movement changes a node's transform. Add terminal text output when you want
> to display it; this example does not open a graphical window.

---

# Working with the Current API

Follow [installation](installation.md) to publish Canopy 0.1.0-dev2 locally.
Create `settings.gradle.kts`, `build.gradle.kts` and `src/main/kotlin/Main.kt`.

```kotlin
// settings.gradle.kts
rootProject.name = "canopy-example"
```

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.4.10"
    application
}
repositories {
    mavenLocal()
    mavenCentral()
}
dependencies {
    implementation("io.canopy:engine:0.1.0-dev2")
    implementation("io.canopy:platforms-terminal:0.1.0-dev2")
}
kotlin { jvmToolchain(25) }
application { mainClass.set("MainKt") }
tasks.withType<JavaExec>().configureEach {
    jvmArgs("--enable-native-access=ALL-UNNAMED")
}
```

Reuse the checked-in demo Gradle wrapper rather than assuming Gradle is installed.

```kotlin
// src/main/kotlin/Main.kt
import io.canopy.engine.app.Screen
import io.canopy.engine.app.screens
import io.canopy.engine.core.nodes.behavior
import io.canopy.engine.core.nodes.types.empty.EmptyNode2D
import io.canopy.engine.math.Vector2
import io.canopy.platforms.terminal.app.terminalApp

class ExampleScreen : Screen() {
    override fun onEnter() {
        EmptyNode2D("Root") {
            EmptyNode2D("Moving") {
                behavior(onUpdate = { delta ->
                    position = position + Vector2(delta, 0f)
                })
            }
        }.asSceneRoot()
    }
}

fun main() = terminalApp {
    screens { start(ExampleScreen()) }
}.launch()
```

Run `./gradlew run` from the application directory (`gradlew.bat run` on Windows).
The terminal host drives the scene; this example updates a transform without
rendering a visible sprite. Use `TerminalApp.renderFrame(lines)` for text output.
The terminal host installs its input system automatically. Stop with Ctrl+C.

Screen initialization uses `onEnter()`. Custom node initialization uses
`nodeInit()`. Old `Screen.setup()` and `Node.create()` examples no longer apply.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
