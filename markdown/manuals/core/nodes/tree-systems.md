<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Tree Systems

**Tree Systems** are global systems that process nodes across the entire scene tree.

While **behaviors** attach logic to individual nodes, tree systems operate at a higher level and are responsible for
processing groups of nodes.

Tree systems are typically used for systems such as:

- rendering
- physics
- input processing
- AI scheduling
- gameplay simulation

---

# Concept

Tree systems scan the scene tree and process nodes that match specific types.

📌 **Tree Processing**

```text
Scene Tree
   │
   ├─ Player (Sprite2D)
   ├─ Enemy  (Sprite2D)
   └─ UI     (Label)
   │
   ▼
RenderSystem processes Sprite2D nodes
````

This allows systems to operate on many nodes without attaching behaviors to each one.

---

# Why Tree Systems Exist

Tree systems solve problems where logic needs to operate on **many nodes simultaneously**.

Examples include:

* rendering every visible sprite
* updating physics bodies
* resolving collisions
* running simulation steps

These tasks are better handled by centralized systems rather than individual node behaviors.

---

# Behaviors vs Tree Systems

Both behaviors and tree systems implement logic, but they operate at different levels.

| Feature    | Behaviors        | Tree Systems                    |
| ---------- | ---------------- | ------------------------------- |
| Scope      | single node      | entire scene tree               |
| Purpose    | gameplay logic   | global processing               |
| Attachment | attached to node | registered globally             |
| Example    | `Move`, `Jump`   | `RenderSystem`, `PhysicsSystem` |

📌 **Comparison**

```text
Node
 └─ Behavior → affects one node

Scene
 └─ TreeSystem → processes many nodes
```

---

# Creating a Tree System

Tree systems are created by extending the `TreeSystem` class.

Example:

```kotlin
class RenderSystem(
    worldWidth: Float,
    worldHeight: Float
) : TreeSystem(
    UpdatePhase.FramePost,
    Sprite2D::class,
    AnimatedSprite2D::class
) {
    // system logic
}
```

In this example, the system processes nodes of type:

```
Sprite2D
AnimatedSprite2D
```

---

# Registering a Tree System

Tree systems must be registered in the **SceneManager**.

Example:

```kotlin
sceneManager {
    +RenderSystem(GAME_WIDTH, GAME_HEIGHT)
}
```

Once registered, the system will automatically run during the engine update cycle.

---

# Update Phases

Tree systems run during specific **update phases**.

The phases determine when the system executes relative to the node update lifecycle.

| Phase         | Description           |
| ------------- | --------------------- |
| `PhysicsPre`  | before physics update |
| `PhysicsPost` | after physics update  |
| `FramePre`    | before frame update   |
| `FramePost`   | after frame update    |

---

📌 **Execution Order**

```text
PhysicsPre
   │
   ▼
Node Physics Update
   │
   ▼
PhysicsPost
   │
   ▼
FramePre
   │
   ▼
Node Frame Update
   │
   ▼
FramePost
```

This system ensures that subsystems execute in a predictable order.

---

# Fetching a Tree System

Tree systems can be retrieved from the scene manager when needed.

Example:

```kotlin
val physicsSystem = treeSystem<PhysicsSystem>()
```

You can also lazily retrieve them:

```kotlin
val physicsSystem by lazyTreeSystem<PhysicsSystem>()
```

This allows nodes or behaviors to interact with global systems.

---

# Typical Tree Systems

Canopy provides several built-in tree systems, including:

```text
RenderSystem
PhysicsSystem
InputSystem
```

These systems handle core engine functionality.

---

# When to Use Tree Systems

Use tree systems when logic must operate across **multiple nodes in the scene**.

Examples:

* rendering all sprites
* physics simulation
* collision detection
* centralized AI processing

If logic only affects a single node, prefer using **Behaviors** instead.

---

# Summary

Tree systems provide centralized processing for groups of nodes.

```text
Scene Tree
   │
   ▼
Tree System
   │
   ▼
Processes matching node types
```

Together with **nodes** and **behaviors**, tree systems form the core architecture used to implement game logic in Canopy.