# Your First Canopy Project

<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

In this guide you will create your **first Canopy project**, launch the engine, and run your first scene.

By the end you will:

* create a new project
* launch the engine
* build a small scene
* run logic every frame

---

# Creating a New Project

The easiest way to start a project is using the **Canopy CLI**.

```bash
canopy new my-game
```

This generates a starter project with the required dependencies and directory structure.

Example project layout:

```
my-game/
├ build.gradle.kts
├ settings.gradle.kts
└ src/
   └ main/
      ├ kotlin/
      │  └ Main.kt
      └ resources/
```

---

# Running the Project

Navigate into the project folder:

```bash
cd my-game
```

Run the project using Gradle:

```bash
./gradlew run
```

A **blank application window** should appear.

This confirms that the engine has started successfully.

---

# Launching the Engine

Open `Main.kt`.

Your entry point should look like this:

```kotlin
fun main() = desktopApp().launch()
```

This code:

1. creates a desktop application
2. initializes the engine
3. starts the runtime loop

---

📌 **Diagram — Engine Startup Flow**

```
<!-- DIAGRAM: engine-startup-flow -->
```

---

# Creating Your First Scene

Next we will create a simple scene.

Update `Main.kt`:

```kotlin
fun main() = desktopApp {

    screens {
        start(DemoScreen())
    }

}.launch()
```

This tells the engine to start with a screen called `DemoScreen`.

---

# Creating a Screen

Create a new file:

```
DemoScreen.kt
```

Example implementation:

```kotlin
class DemoScreen : CanopyScreen {

    override fun setup() {

        EmptyNode("hello-world") {
            behavior(
                onReady = {
                    println("Hello from Canopy!")
                }
            )
        }.asSceneRoot()

    }

}
```

Run the project again.

You should see:

```
Hello from Canopy!
```

---

📌 **Diagram — Scene Node Tree**

```
<!-- DIAGRAM: first-scene-node-tree -->
```

---

# Running Code Every Frame

Nodes can run logic every frame using `onUpdate`.

Modify the node:

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

When you run the project, the console will show the frame counter increasing.

---

📌 **Diagram — Engine Update Loop**

```
<!-- DIAGRAM: engine-update-loop -->
```

---

# What Just Happened

In just a few lines of code you used several core Canopy systems.

| System            | Purpose                         |
| ----------------- | ------------------------------- |
| Nodes             | represent entities in the scene |
| Scenes            | organize nodes into hierarchies |
| Behaviors         | attach logic to nodes           |
| Lifecycle methods | execute code during runtime     |

These systems form the **foundation of the engine architecture**.

---

# Next Steps

Now that your first project runs, explore the core engine concepts.

Recommended next topics:

* **Node System** — how scenes and nodes work
* **Behaviors** — attaching gameplay logic to nodes
* **Events and Signals** — reactive programming in Canopy
* **Contexts** — scoped dependency sharing

Together these systems form the **core architecture of Canopy**.
