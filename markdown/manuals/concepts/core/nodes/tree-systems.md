<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

# Tree Systems

Tree Systems are **global processors that operate across the entire scene tree**.

While **behaviors attach logic to individual nodes**, tree systems process **groups of nodes collectively**.

They are typically used for systems such as:

* physics processing
* rendering
* AI updates
* gameplay rules
* world simulation

---

# Mental Model

Tree systems scan the scene tree and process nodes that match their requirements.

```text
Scene Tree
   │
   ├─ Player
   ├─ Enemy
   ├─ Projectile
   └─ Camera
        │
        ▼
Tree System
        │
        ▼
Processes matching nodes
```

📌 **Diagram — Tree System Processing**

<!-- DIAGRAM: tree-system-processing -->

---

# Node Matching

Each system declares **required node types**.

Nodes matching those types are automatically registered into the system.

Example:

```kotlin
class MovementSystem : TreeSystem(
    phase = FramePre,
    requiredTypes = arrayOf(Movable::class)
)
```

Nodes that match the required type are automatically tracked.

```text
Scene Tree
 ├ Player (Movable)
 ├ Enemy (Movable)
 └ Camera
```

The system will process:

```
Player
Enemy
```

---

# Processing Nodes

Systems process matching nodes every update.

Override `processNode`:

```kotlin
override fun processNode(node: Node<*>, delta: Float) {
    // update logic
}
```

Example:

```kotlin
override fun processNode(node: Node<*>, delta: Float) {
    val movable = node as Movable
    movable.position += movable.velocity * delta
}
```

---

# Update Phases

Tree systems execute during specific phases of the engine update loop.

| Phase         | Description            |
| ------------- | ---------------------- |
| `PhysicsPre`  | before physics updates |
| `PhysicsPost` | after physics updates  |
| `FramePre`    | before frame updates   |
| `FramePost`   | after frame updates    |

Example:

```kotlin
class PhysicsSystem : TreeSystem(
    phase = PhysicsPre,
    requiredTypes = arrayOf(RigidBody::class)
)
```

📌 **Diagram — Update Phases**

<!-- DIAGRAM: system-update-phases -->

---

# System Priority

Multiple systems may run during the same phase.

The `priority` determines their execution order.

Higher priority systems run first.

Example:

```kotlin
TreeSystem(
    phase = FramePre,
    priority = 10
)
```

This allows fine control over execution order.

---

# Lifecycle Hooks

Tree systems provide lifecycle hooks that allow custom behavior during execution.

| Hook                       | Description                          |
| -------------------------- | ------------------------------------ |
| `onRegister()`             | called when the system is registered |
| `onUnregister()`           | called when the system is removed    |
| `beforeProcess(delta)`     | called before node processing        |
| `processNode(node, delta)` | processes each matching node         |
| `afterProcess(delta)`      | called after node processing         |
| `onNodeAdded(node)`        | node registered into system          |
| `onNodeRemoved(node)`      | node removed from system             |

Example:

```kotlin
override fun beforeProcess(delta: Float) {
    // prepare system state
}
```

---

# Automatic Node Registration

Nodes are automatically added to systems when they match the required types.

When a matching node enters the tree:

```
node enters scene
      │
      ▼
system.register(node)
```

When the node leaves:

```
node removed
      │
      ▼
system.unregister(node)
```

This allows systems to maintain an up-to-date list of matching nodes.

---

# Creating Systems Inline

Small systems can be created directly using the DSL helper.

```kotlin
createTreeSystem(
    phase = FramePre,
    requiredTypes = arrayOf(Player::class),
    processNode = { node, delta ->
        // custom logic
    }
)
```

This is useful for lightweight systems.

---

# Accessing Systems

Tree systems can be retrieved through the `SceneManager`.

```kotlin
val movementSystem = treeSystem<MovementSystem>()
```

For lazy access:

```kotlin
val movementSystem by lazyTreeSystem<MovementSystem>()
```

---

# Registering Tree Systems

Tree systems are registered when configuring the scene manager.

Example:

```kotlin
sceneManager {

    +PhysicsSystem()

    +MovementSystem()

}
```

Once registered, they run automatically during the engine update loop.

---

# When to Use Tree Systems

Tree systems are ideal when logic must process **many nodes globally**.

Examples include:

* physics integration
* rendering
* AI updates
* collision detection
* simulation rules

---

# When Not to Use Tree Systems

Tree systems should not be used for **entity-specific logic**.

Prefer **behaviors** when logic belongs to a single node.

Examples:

| Use Behavior       | Use Tree System     |
| ------------------ | ------------------- |
| player movement    | physics integration |
| enemy attack logic | enemy AI processing |
| UI widget logic    | rendering           |

---

# Summary

Tree systems process **groups of nodes across the scene tree**.

```text
Scene Tree
     │
     ▼
Tree System
     │
     ▼
Matching Nodes
     │
     ▼
processNode()
```

They allow developers to implement **global gameplay and engine systems** in a structured way.

---

# Related Topics

* **Nodes** — scene structure and entities
* **Behaviors** — per-node logic
* **Scene Manager** — coordinating scene updates
* **Managers** — global engine services
