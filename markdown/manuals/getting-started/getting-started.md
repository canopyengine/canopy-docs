# Getting Started

<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

> ⚠️ **Experimental software**
>
> Canopy is currently under active development and the API may change between versions.
> It is recommended to use the engine for **experiments and prototypes** until the API stabilizes.

---

# Goal

In this guide you will:

* launch a Canopy application
* create your first scene
* run logic every frame

By the end, you will understand the **basic execution model of the engine**.

---

# Quick Start

Create a minimal Canopy application:

```kotlin
fun main() = desktopApp().launch()
```

Run the program and a **blank window** will appear.

This means the engine has started successfully.

---

# What Happened

`desktopApp()` creates a desktop runtime environment.

`launch()` then:

* initializes the engine
* starts the application loop
* opens the window

From here you can start building scenes.

---

# Creating Your First Scene

Now let's create a simple scene with a node.

```kotlin
fun main() = desktopApp {

    screens {
        start(DemoScreen())
    }

}.launch()
```

---

## Creating a Screen

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

Running the program prints:

```
Hello from Canopy!
```

📌 **Diagram — Scene Node Tree**

```
<!-- DIAGRAM: first-scene-tree -->
```

---

# Updating Every Frame

Nodes can run logic every frame using `onUpdate`.

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

Each frame the counter increases.

📌 **Diagram — Engine Update Flow**

```
<!-- DIAGRAM: engine-update-loop -->
```

---

# Core Concepts Introduced

In this short example you used several key systems of Canopy.

| Concept           | Description                     |
| ----------------- | ------------------------------- |
| Nodes             | represent entities in the scene |
| Scenes            | hierarchical node structures    |
| Behaviors         | logic attached to nodes         |
| Lifecycle methods | hooks executed during runtime   |

These systems form the foundation of how games are structured in Canopy.

---

# Project Structure

A typical Canopy project may look like this:

```
my-game/
├ build.gradle.kts
├ settings.gradle.kts
│
├ src/
│  └ main/
│     ├ kotlin/
│     │  └ com/example/game/
│     │     ├ Main.kt
│     │     ├ systems/
│     │     ├ entities/
│     │
│     └ resources/
│        ├ textures/
│        ├ audio/
│        └ data/
```

### Suggested responsibilities

| Folder    | Purpose                     |
| --------- | --------------------------- |
| scenes    | reusable scene structures   |
| nodes     | custom node implementations |
| behaviors | gameplay logic              |
| systems   | tree systems                |
| resources | assets and configuration    |

> 💡 As your project grows, you may split the game into **multiple Gradle modules**.

---

# Using the Canopy CLI

The easiest way to create a new project is with the **Canopy CLI**.

```bash
canopy new my-game
```

This generates a starter project with the recommended structure.

Run the project with:

```bash
./gradlew run
```

---

# Next Steps

Now that your first application runs, explore the core systems of the engine.

* **Node System** — structure of scenes and entities
* **Behaviors** — attach logic to nodes
* **Events and Signals** — reactive programming
* **Contexts** — scoped dependency sharing

Together these systems form the **core architecture of Canopy Engine**.
