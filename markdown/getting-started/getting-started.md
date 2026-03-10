<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Getting Started

> [!WARNING]
> **Canopy is currently experimental.**
> The engine is still under active development and future versions may introduce **breaking changes**.
> Because of this, it is recommended to use Canopy only for **experiments or test projects** until the API stabilizes.

---

# Adding Canopy to Your Project

To start using **Canopy Engine**, you need to add the engine dependencies to your project.

Canopy is distributed through Maven repositories and can be added using **Gradle** or **Maven**.

---

## Gradle

### Kotlin DSL

```kotlin
dependencies {
    implementation("io.github.canopyengine:core:$canopyVersion")
}
```

### Groovy DSL

```groovy
dependencies {
    implementation "io.github.canopyengine:core:$canopyVersion"
}
```

Replace `canopyVersion` with the version you want to use.

---

## Maven

```xml
<dependency>
    <groupId>io.github.canopyengine</groupId>
    <artifactId>core</artifactId>
    <version>${canopyVersion}</version>
</dependency>
```

---

# Bootstrapping an Application

Once the core dependency is installed, you need to include one of the **application modules**.

These modules provide platform-specific launchers.

| Module         | Purpose                                      |
| -------------- | -------------------------------------------- |
| `app-desktop`  | Desktop applications (Windows, Linux, macOS) |
| `app-terminal` | Terminal-based applications                  |

For this guide we will create a **desktop application**.

---

## Adding the Desktop Launcher

### Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("io.github.canopyengine:app-desktop:$canopyVersion")
}
```

### Gradle (Groovy)

```groovy
dependencies {
    implementation "io.github.canopyengine:app-desktop:$canopyVersion"
}
```

---

### Maven

```xml
<dependency>
    <groupId>io.github.canopyengine</groupId>
    <artifactId>app-desktop</artifactId>
    <version>${canopyVersion}</version>
</dependency>
```

---

# Launching Your First Canopy App

Once the dependencies are added, creating a Canopy application only requires a few lines of code.

Create a `main` function and launch the application:

```kotlin
fun main() = desktopApp().launch()
```

Running this program will open a **blank window**, indicating that the engine has started successfully.

---

📌 **What just happened**

The `desktopApp()` function:

* creates a desktop application environment
* initializes core engine systems
* starts the main application loop

The `launch()` function then starts the engine runtime.

---

# Recommended Project Structure

While Canopy does not enforce a strict project layout, organizing your project into clear modules and directories helps 
keep large projects maintainable.

A typical project might look like this:

```text
my-game/
├─ build.gradle.kts
├─ settings.gradle.kts
│
├─ src/
│  └─ main/
│     ├─ kotlin/
│     │  └─ com/example/game/
│     │     ├─ Main.kt
│     │     │
│     │     ├─ systems/
│     │     │  └─ Holds feature-scoped packages (Combat, Crafting, etc...)
│     │     │
│     │     ├─ entities/
│     │     │  └─ Hold entity-scoped packages (Player, Mobs, NPCs)
│     │     
│     │
│     └─ resources/
│        ├─ textures/
│        ├─ audio/
│        └─ data/
```

---

### Suggested responsibilities

| Folder      | Purpose                     |
| ----------- | --------------------------- |
| `screens`   | Application screens         |
| `scenes`    | Reusable node hierarchies   |
| `nodes`     | Custom node implementations |
| `behaviors` | Reusable gameplay logic     |
| `systems`   | Tree systems                |
| `resources` | Assets and configuration    |

> [!TIP]
> As your project grows, you may split the game into **multiple Gradle modules** for gameplay, tools, or shared libraries.

---

# Creating a Project with the Canopy CLI

The easiest way to start a new project is by using the **Canopy CLI**, which scaffolds a project with the correct structure and dependencies.

Example:

```bash
canopy new my-game
```

This creates a project like:

```text
my-game/
├─ build.gradle.kts
├─ settings.gradle.kts
├─ src/
│  └─ main/
│     ├─ kotlin/
│     │  └─ Main.kt
│     └─ resources/
```

You can run the project with:

```bash
./gradlew run
```

---

## Creating Projects with Templates

The CLI supports project templates:

```bash
canopy new my-game --template kotlin
```

Future templates may include:

* 2D game templates
* terminal simulations
* UI demos
* minimal engine examples

---

# Your First Scene in 60 Seconds

Now that your application launches, let's create a **simple scene**.

In this example we will:

* create a scene
* add a node
* attach behavior
* run logic each frame

---

## Configure the App

```kotlin
fun main() = desktopApp {

    screens {
        start(DemoScreen())
    }

}.launch()
```

---

## Create a Screen

Screens configure and run scenes.

```kotlin
class DemoScreen : CanopyScreen {

    override fun setup() {

        EmptyNode("root") {

            EmptyNode("hello-node") {

                behavior(
                    onReady = {
                        println("Hello from Canopy!")
                    }
                )

            }

        }.asSceneRoot()

    }

}
```

Running the project prints:

```text
Hello from Canopy!
```

---

📌 **Diagram suggestion**

```
Scene
 └─ root
     └─ hello-node
         └─ behavior(onReady)
```

---

## Adding Frame Updates

Let's make a node update every frame.

```kotlin
EmptyNode("root") {

    EmptyNode("counter-node") {

        var counter = 0

        behavior(
            onUpdate = {
                counter++
                println("Frame: $counter")
            }
        )

    }

}.asSceneRoot()
```

Now the node runs logic each frame.

---

📌 **Diagram suggestion**

```
Engine Tick
     │
     ▼
Node Update
     │
     ▼
counter++
```

---

# What You Just Learned

In just a few lines you used several core concepts of Canopy.

| Concept           | Purpose                         |
| ----------------- | ------------------------------- |
| Nodes             | represent entities in the scene |
| Scenes            | define hierarchical structures  |
| Behaviors         | attach logic to nodes           |
| Lifecycle methods | run code during updates         |

These concepts form the foundation of how games are structured in Canopy.

---

# Next Steps

Now that your first application runs, the next topics to explore are:

1️⃣ **Node System** — scenes, nodes, and behaviors
2️⃣ **Events and Signals** — reactive programming in gameplay systems
3️⃣ **Contexts** — scoped dependency sharing

Together these systems form the **core architecture of Canopy Engine**.