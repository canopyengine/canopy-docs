---
title: Node System
parent: Core
nav_order: 1
permalink: /manuals/core/node-system/
---

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="{{ '/' | relative_url }}">
    <img src="{{ '/assets/canopy-icon.png' | relative_url }}" width="50" alt="Canopy Engine logo">
  </a>
</p>

---
# Node Systen

**The **Node System** is the backbone of the engine, and without it, the rest of the systems wouldn't be possible.**

If you're already familiar with the concepts but need an example, skip into the [tldr](#using-it-all-together).
## Nodes and Scenes


Every level, character, object, UI, menu, and even text can be described as a **Scene**. Think of it as a container for 
a part of your game.

Equivalent to:

* **_Unity and Unreal_**: levels/prefabs

* **_Godot_**: scenes


A scene is made of a number of components in a **tree-hierarchy**, so you can have **children-parent** relations between
them. These components are called **Nodes**!

Equivalent to:

* **_Unity_**: GameObjects with Components

* **_Unreal_**: Actors/Components hierarchy

* **_Godot_**: nodes


Each node has its own purpose, so you can have:


* **Animation** nodes - for managing and playing animations 🎞️

* **Physics** nodes - for handling things like collisions, area detections, or even ray-casts 💥

* **Visual** nodes - for displaying things like sprites

* **Much more**!

* Even you can create **custom nodes** if need be!


You can then weave them together to create your game, and even reuse them across different scenes!

> [!IMPORTANT]
> Nodes are the most basic unit of the system, but scenes can also be composed of nested scenes!

<p align="center">
    <img src="/assets/scene-diagram.png" width="500" alt="Scene Diagram">
</p>

### Defining a Scene's structure

```kotlin
EmptyNode("root"){
    
    ExampleNode(/* node props */){
        /* Define nested nodes!! */
    }
    
    // You can also nest scenes!!
    ExampleScene(/* scene props*/)
    
}.asSceneRoot() // Automatically replaces SceneManager's current scene
```

### Lifecycle Methods
* **nodeEnterTree** - called when the node is added to the tree.
* **nodeExitTree** - called when the node is removed to the tree.
* **nodeReady** - called when the node and all its children are ready to be processed.
* **nodeUpdate** - called on **game tick**, which can be irregular.
* **nodePhysicsUpdate** - called on **game physics tick**, which are regular.

> [!TIP]
> Use **nodeUpdate** for tasks which you don't mind to be processed at irregular intervals.

> [!TIP]
> Use **nodePhysicsUpdate** for tasks which should be done at regular intervals.

## Custom node behaviors with...Behaviors

Each node can have a custom behavior outside its defined type via **Behaviors**.

First, you need to create a custom behavior. You can do this by extending the **_Behavior_** class.

```kotlin
class PlayerController(
    node: Player,
    // Custom parameters
    private val playerSpeed: Float = PLAYER_SPEED,
) : Behavior<Player>(node) {
    
    /* Put your custom logic here and use it on the **lifecycle methods** */
    
}
```

You can also define them using the utility method
```kotlin
val behaviour = behavior<EmptyNode>(
    onReady = {
        val parent = parent ?: return@behavior
        childCount.merge(parent.name, 1) { old, new -> old + new }
        if (name !in childCount) {
            childCount[name] = 0
        }
    },
)
```

Then, you simply pass them into the node
```kotlin
EmptyNode("root", script = behavior){/* ... */}
```

### Lifecycle Methods
* **onEnterTree** - called when the node enters the tree.
* **onExitTree** - called when the node exits the tree.
* **onReady** - called when the node and its children are ready to be processed.
* **onUpdate** - called on **game tick**, which can be irregular.
* **onPhysicsUpdate** - called on **game physics tick**, which are regular.

### Coding guidelines
 You can use **node lifecycles** for your node logic if the behavior is closely connected to it. 

> Example: Player node where you define the **Player Controller** logic inside it.

If you want **modularity** and **separation of concerns**, you can use **behaviors**.

> [!IMPORTANT]
> For **Input Management**, check the [input handling]() section.

## Scene Manager

What is currently displayed and processed by the engine is defined by the **root node** and its tree.
This defines the tree, and it's managed by a singleton object called the **Scene Manager**.

> [!TIP]
> You can see more about managers [here]().

You can access it in order to:

* Replace the **root node**.
* Manage **global systems**.

### Setting Scene Manager
```kotlin
/* Main.kt */
class Main : KtxGame<KtxScreen>() {
    
    override fun create(){
        val sceneManager = SceneManager{
            // Register global system
            RenderSystem()
        }
        
        // Register it as a global manager
        ManagersRegistry.apply{
            register(SceneManager)
        }        
    }
}
```

### Replacing the root node

You can manually replace the **root node** by accessing it through the **Scene Manager**.

```kotlin
/* ExampleLevel.kt  */

/* ... */

val sceneManager = ManagersRegistry.get(SceneManager::class)

val root = EmptyNode("root"){/* ... */ }

sceneManager.currScene = root

/* ... */
```

You can do the same by simply using the utility function **_asSceneRoot_**
```kotlin
/* ... */

EmptyNode("root"){ /* ... */ }.asSceneRoot()

/* ... */
```

## Tree Systems
Other than node-scoped behaviors, you can also define systems that span the whole tree. These **global tree systems**
are registered in the SceneManager and **automatically scan nodes** by their types, and have their own lifecycles.


**Canopy** already provides builtin **Tree Systems**, responsible for things like rendering, physics, input... but you can
also define them by extending the **_TreeSystem_** abstract class.

```kotlin
class RenderSystem(
    worldWidth: Float,
    worldHeight: Float,
) : TreeSystem(
    UpdatePhase.FrameAfterScene,
    Sprite2D::class,
    AnimatedSprite2D::class
) {/*...*/}
```
You can also use the **_treeSystem_** function to define it in-place.
```kotlin
treeSystem(/* system definition */)
```

### UpdatePhase
Tree systems are batched and executed in different phases, based on their priority. The phases are executed in the following order:

1. **PhysicsPre** - run systems at physics tick **before** processing the tree.
2. **PhysicsPost** - run systems at physics tick **after** processing the tree.
3. **FramePre** - run systems at irregular ticks **before** processing the tree.
4. **FramePost** - run systems at irregular ticks **after** processing the tree.

> [!NOTE]
> Inside each phase, you can prioritize the execution order of a system through its **priority** field.
---

## Using it all together

By using **nodes**, **scenes**, **behaviors**(or embedded node logic) and **tree systems**, we are able to create decoupled
and effective logic, in a way that you don't have to imperatively think about how you need to connect everything.

### Example: Bouncing ball game (no physics)

In order to visualize the flow between all these different parts, let's make a simple game where a ball bounces around the screen's edges.

> [!NOTE]
> We'll assume you're familiar with topics such as [project scaffolding](), [screens]() and fetching data about the [app]().

1. First, we need to render a **Render System** in order to display sprites.

```kotlin

const val GAME_WIDTH = 1280F
const val GAME_HEIGHT = 720F

class BouncingExample : CanopyGame {
    override fun create() {
        // Register and setup global managers - global access to data across screens and nodes
        ManagersRegistry.apply {
            register(
                SceneManager {
                    // Register global systems here
                    RenderSystem(GAME_WIDTH, GAME_HEIGHT)
                },
            )
        }.setup()

        addScreen(DemoScreen())
        setScreen<DemoScreen>()
    }
}

```

2. Now, we'll create a **Screen**.

```kotlin
class DemoScreen : CanopyScreen {
    private val logger = logger<DemoScreen>()

    // Screen resources
    val image = assetsManager.loadTexture("ball.png", FileSource.Internal) {
        setFilter(Linear, Linear)
    }

    // Entities
    override fun show() {
        /* We'll set the structure here */
    }
    
    override fun render(delta: Float) {
        super.render(delta)
        sceneManager.tick(delta)
    }

    override fun dispose() {
        super.dispose()
        image.disposeSafely()
    }
}

```

3. Now, we'll define both the scene's structure and the bouncing logic

```kotlin
override fun show(){
    logger.info { "Show" }
    
    var direction : Vector2 = Vector2.ZERO /* Keep track of ball movement direction */

    EmptyNode("root") {

        // Ball - simple Sprite
        Sprite2D(
            "logo-2", 
            texture = image, 
            behavior = behavior<EmptyNode>(
                onReady = {
                  direction = /*Random Vector 2*/ * BALL_SPEED  
                },
                onPhysicsUpdate = {
                    
                    if(position.y !in TOP_COORDINATE..BOTTOM_CORDINATE)
                        direction.y *= 1
                    if(position.x !in LEFT_COORDINATE..RIGHT_COORDINATE)
                        direction.x *= 1
                    
                    position += direction // Update position
                },
            )
        )

    }.asSceneRoot() // Replaces tree
}
```

And... that's it! Now you have a ball that bounces around. You can improve it if you want, make the ball a class of itself,
extract the behavior, and make the movement more realistic if you want.

!! [Insert screenshot of working demo] !!

---

Canopy 2026