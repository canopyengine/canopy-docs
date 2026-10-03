# First project

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
