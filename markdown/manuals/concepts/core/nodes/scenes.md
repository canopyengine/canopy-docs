# Scenes

<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

A **scene** defines a structured hierarchy of nodes that represent part of a game world.

Scenes are the main way games are built in Canopy.

Examples of scenes include:

* a game level
* a menu
* a UI layout
* a simulation environment

Scenes are composed by **combining nodes into a tree structure**.

---

# Quick Example

```kotlin
EmptyNode("root") {

    Player("player")

    Enemy("enemy")

}.asSceneRoot()
```

This creates a scene with a root node and two child nodes.

---

📌 **Diagram — Scene Node Tree**

```
<!-- DIAGRAM: scene-node-tree -->
```

---

# Mental Model

A **scene is simply a node tree**.

```id="scene-mental-model"
Scene
└ Root Node
   ├ Player
   ├ Enemy
   └ UI
```

The **root node defines the entire scene**.

Everything inside the scene exists as children of that root.

---

# Scene Roots

Every scene must have a **root node**.

The root node becomes the **entry point of the scene tree**.

Example:

```kotlin
EmptyNode("root") {

    Sprite2D("logo")

}.asSceneRoot()
```

`asSceneRoot()` registers the node as the scene's root.

---

📌 **Diagram — Scene Root**

```
<!-- DIAGRAM: scene-root -->
```

---

# Scenes and Screens

Scenes are usually created inside **screens**.

Screens control which scene is currently active.

Example:

```kotlin
class DemoScreen : CanopyScreen {

    override fun setup() {

        EmptyNode("root") {

            EmptyNode("hello-node")

        }.asSceneRoot()

    }

}
```

Screens allow games to switch between scenes such as:

* menus
* levels
* gameplay screens

---

📌 **Diagram — Screen and Scene Relationship**

```
<!-- DIAGRAM: screen-scene-relationship -->
```

---

# Scene Composition

Scenes can contain **many nodes**, which can themselves contain other nodes.

Example:

```kotlin
EmptyNode("root") {

    Player("player") {
        Sprite2D("sprite")
        Collider("collider")
    }

    Enemy("enemy")

}
```

This hierarchical structure allows complex systems to be built from simple pieces.

---

📌 **Diagram — Scene Composition**

```
<!-- DIAGRAM: scene-composition -->
```

---

# Reusable Scene Structures

Scenes often represent reusable parts of a game.

Examples:

* player entity
* enemy entity
* UI panels
* game environments

These structures can be reused across different scenes.

---

# Scenes and Behaviors

Nodes inside scenes often use **behaviors** to implement gameplay logic.

Example:

```kotlin
Player("player") {

    behavior(PlayerController())

}
```

Behaviors define **how nodes act during runtime**, while scenes define **how nodes are structured**.

---

# Scenes and the Scene Manager

The **Scene Manager** controls which scene is active.

Typical responsibilities include:

* loading scenes
* replacing scenes
* managing transitions

Example:

```kotlin
sceneManager.replaceScene(GameScene())
```

---

📌 **Diagram — Scene Manager Flow**

```
<!-- DIAGRAM: scene-manager-flow -->
```

---

# When to Create a Scene

Scenes are typically created for large logical sections of a game.

Common examples include:

* main menu
* gameplay level
* pause screen
* simulation environment

Each scene represents a **self-contained part of the game**.

---

# Best Practices

### Keep scenes focused

Each scene should represent a clear gameplay context.

---

### Use node hierarchies

Structure scenes using parent–child relationships.

---

### Separate structure and logic

Use scenes for **structure** and behaviors for **logic**.

---

# Summary

Scenes organize nodes into **structured hierarchies**.

```text
Scene
└ Root Node
   └ Node Tree
```

Scenes allow developers to:

* structure game worlds
* group related nodes
* define reusable gameplay structures

They form one of the **core building blocks of Canopy's architecture**.

---