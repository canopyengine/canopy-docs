<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Scene Manager

The **Scene Manager** is responsible for managing the **active scene tree** and coordinating the execution of **tree systems**.

It acts as the central orchestrator of the runtime scene.

The Scene Manager controls:

- the root node of the scene
- the lifecycle of the node tree
- the execution of tree systems
- scene transitions

---

# Concept

At runtime, the engine processes a **single active scene tree**.

The Scene Manager holds the root of that tree and drives the update loop.

📌 **Scene Runtime Structure**

```text
SceneManager
     │
     ▼
Root Node
     │
     ▼
Node Tree
````

All nodes in the scene are descendants of the root node.

---

# Scenes

A **scene** is simply a node tree whose root node is managed by the Scene Manager.

Example:

```text
Scene
 └─ Root
     ├─ Player
     ├─ Enemy
     └─ UI
```

The Scene Manager ensures that this tree is updated every frame.

---

# Setting the Active Scene

To display a scene, its root node must be assigned to the Scene Manager.

Example:

```kotlin
val root = EmptyNode("root") {
    Player()
    Enemy()
}

sceneManager.currScene = root
```

This replaces the currently active scene tree.

---

# Using `asSceneRoot`

Canopy provides a convenience function to set a node as the active scene root.

Example:

```kotlin
EmptyNode("root") {

    Player()

    Enemy()

}.asSceneRoot()
```

This automatically replaces the current scene with the node.

---

📌 **Scene Replacement**

```text
Current Scene
     │
     ▼
SceneManager
     │
     ▼
New Root Node
```

---

# Scene Updates

The Scene Manager is responsible for advancing the scene each frame.

Typical update flow:

```kotlin
sceneManager.tick(delta)
```

During a tick, the following occurs:

1. tree systems run in their configured phases
2. node lifecycle updates are executed
3. behaviors attached to nodes are updated

---

📌 **Frame Execution**

```text
SceneManager.tick()
       │
       ▼
Run Tree Systems
       │
       ▼
Update Node Tree
       │
       ▼
Update Behaviors
```

This ensures consistent execution order.

---

# Registering Tree Systems

Tree systems must be registered with the Scene Manager.

Example:

```kotlin
sceneManager {
    +RenderSystem()
    +PhysicsSystem()
}
```

Registered systems will automatically run during the update loop.

---

📌 **System Registration**

```text
SceneManager
   │
   ├─ RenderSystem
   ├─ PhysicsSystem
   └─ InputSystem
```

These systems process nodes during the scene update.

---

# Accessing the Scene Manager

The Scene Manager can be accessed through the manager registry.

Example:

```kotlin
val sceneManager = manager<SceneManager>()
```

This allows systems or screens to interact with the active scene.

---

# Scene Transitions

Scenes can be replaced at runtime.

Example:

```kotlin
MenuScene().asSceneRoot()
```

This pattern is commonly used when switching between:

* menus
* gameplay
* loading screens

---

📌 **Scene Transition**

```text
Menu Scene
     │
     ▼
SceneManager
     │
     ▼
Game Scene
```

---

# Relationship With Other Systems

The Scene Manager connects several core engine systems.

📌 **Scene Architecture**

```text
SceneManager
     │
     ├─ Root Node
     │    └─ Node Tree
     │
     └─ Tree Systems
```

* **Nodes** represent structure
* **Behaviors** add modular logic
* **Tree Systems** process groups of nodes
* **Scene Manager** coordinates execution

---

# When to Use the Scene Manager

You interact with the Scene Manager when you need to:

* replace the current scene
* register global systems
* advance the scene update loop
* access the active scene tree

Most gameplay code interacts with nodes and behaviors rather than the manager directly.

---

# Summary

The Scene Manager is the runtime controller of the active scene.

```text
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

It ensures that the scene tree is updated and that all systems run in the correct order.

Together with **nodes**, **behaviors**, and **tree systems**, the Scene Manager forms the core runtime architecture of Canopy.