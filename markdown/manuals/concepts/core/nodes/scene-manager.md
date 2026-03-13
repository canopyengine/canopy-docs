# Scene Manager

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

The **Scene Manager** controls the **active scene tree** during runtime.

It acts as the central coordinator of the engine, managing:

* the active scene root
* the lifecycle of the node tree
* the execution of tree systems
* scene transitions

Most gameplay code interacts with **nodes and behaviors**, while the Scene Manager operates in the background to drive the scene.

---

# Quick Example

```kotlin
EmptyNode("root") {

    Player()

    Enemy()

}.asSceneRoot()
```

This sets the node as the **active scene root**, replacing the current scene.

---

📌 **Diagram — Scene Manager and Scene Root**

<!-- DIAGRAM: scene-manager-root -->

---

# Mental Model

At runtime, the engine processes **one active scene tree**.

The Scene Manager holds the root of that tree and drives the update loop.

📌 **Diagram — Runtime Scene Structure**

<!-- DIAGRAM: runtime-scene-structure -->

Every node in the scene is a descendant of the root node.

---

# Scenes

A **scene** is simply a node tree whose root node is managed by the Scene Manager.

Example structure:

```
Scene
 └ Root
     ├ Player
     ├ Enemy
     └ UI
```

The Scene Manager ensures that this tree is updated every frame.

---

# Setting the Active Scene

A scene becomes active when its root node is assigned to the Scene Manager.

Example:

```kotlin
val root = EmptyNode("root") {
    Player()
    Enemy()
}

sceneManager.currScene = root
```

This replaces the currently active scene.

---

# Using `asSceneRoot`

Canopy provides a helper function to simplify scene activation.

```kotlin
EmptyNode("root") {

    Player()
    Enemy()

}.asSceneRoot()
```

This automatically assigns the node as the active scene root.

---

📌 **Diagram — Scene Replacement**

<!-- DIAGRAM: scene-replacement -->

---

# Scene Updates

The Scene Manager advances the scene during each frame of the application.

Typical update call:

```kotlin
sceneManager.tick(delta)
```

During each tick the engine:

1. runs tree systems
2. updates the node tree
3. executes node behaviors

---

📌 **Diagram — Frame Execution Flow**

<!-- DIAGRAM: scene-frame-flow -->

---

# Registering Tree Systems

Tree systems must be registered with the Scene Manager so they can run during updates.

Example:

```kotlin
sceneManager {
    +RenderSystem()
    +PhysicsSystem()
}
```

These systems will automatically execute each frame.

---

📌 **Diagram — Tree System Registration**

<!-- DIAGRAM: tree-system-registration -->

---

# Accessing the Scene Manager

The Scene Manager can be retrieved from the manager registry.

```kotlin
val sceneManager = manager<SceneManager>()
```

This allows systems or screens to interact with the active scene.

---

# Scene Transitions

Scenes can be replaced during runtime.

Example:

```kotlin
MenuScene().asSceneRoot()
```

This is commonly used when switching between:

* menus
* gameplay
* loading screens

---

📌 **Diagram — Scene Transition**

<!-- DIAGRAM: scene-transition -->

---

# Relationship With Other Systems

The Scene Manager connects several core systems.

📌 **Diagram — Scene Runtime Architecture**

<!-- DIAGRAM: scene-runtime-architecture -->

These systems work together as follows:

| System        | Responsibility                |
| ------------- | ----------------------------- |
| Nodes         | represent scene structure     |
| Behaviors     | implement node logic          |
| Tree Systems  | process nodes globally        |
| Scene Manager | coordinates runtime execution |

---

# When You Use the Scene Manager

You typically interact with the Scene Manager when you need to:

* change the active scene
* register global systems
* advance the scene update loop

Most gameplay logic interacts with **nodes and behaviors instead**.

---

# Summary

The Scene Manager controls the **active scene during runtime**.

```
SceneManager
     │
     ▼
Root Node
     │
     ▼
Node Tree
     │
     ▼
Behaviors + Tree Systems
```

It ensures that:

* scenes run correctly
* systems execute in the right order
* transitions between scenes are handled safely.