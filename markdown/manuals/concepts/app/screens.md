<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Screens

Screens represent **high-level application states** in a Canopy app.

Examples of screens include:

* main menu
* gameplay
* pause menu
* settings
* loading screens

Each screen manages its own logic and typically defines the **scene tree** that should be active while the screen is displayed.

---

# How Screens Fit Into the App

Screens sit between the **application** and the **scene tree**.

They are responsible for:

* creating scenes
* advancing the scene manager
* managing resources used by that screen

---

📌 **Diagram suggestion**

```text id="9pxk1e"
Application
   │
   ▼
Screen
   │
   ▼
Scene Root
   │
   ▼
Node Tree
```

---

# Registering Screens

Screens are registered in the **app builder** using the `screens {}` block.

Example:

```kotlin id="wrc4zy"
desktopApp {

    screens {
        start(DemoScreen())
    }

}.launch()
```

`start(...)` both:

* registers the screen
* sets it as the **initial screen**

---

📌 **Diagram suggestion**

```text id="xg19y6"
screens {
   start(DemoScreen)
}

Application start
   │
   ▼
DemoScreen becomes active
```

---

# Creating a Screen

Screens implement the `CanopyScreen` interface.

Example:

```kotlin id="s3m67u"
class DemoScreen : CanopyScreen {

    override fun setup() {

    }

    override fun render(delta: Float) {

    }

}
```

Screens typically perform two tasks:

* **create the scene tree**
* **advance the scene manager**

---

# Screen Lifecycle

Screens have a lifecycle similar to nodes.

| Method          | Purpose                               |
| --------------- | ------------------------------------- |
| `setup()`       | called when the screen becomes active |
| `render(delta)` | called every frame                    |
| `dispose()`     | called when the screen is destroyed   |

---

📌 **Diagram suggestion**

```text id="ex1t5r"
Screen activated
   │
   ▼
setup()
   │
   ▼
render() loop
   │
   ▼
dispose()
```

---

# Creating the Scene Tree

A screen usually creates the scene tree during `setup()`.

Example:

```kotlin id="p3c6df"
class DemoScreen : CanopyScreen {

    override fun setup() {

        EmptyNode("root") {

            EmptyNode("hello")

        }.asSceneRoot()

    }

}
```

`asSceneRoot()` replaces the current scene managed by the **Scene Manager**.

---

📌 **Diagram suggestion**

```text id="a0ov0e"
DemoScreen.setup()
      │
      ▼
Create scene root
      │
      ▼
SceneManager.setRoot(root)
```

---

# Advancing the Scene

The scene tree must be processed every frame.

This is usually done in the `render()` method.

Example:

```kotlin id="3my5zo"
override fun render(delta: Float) {
    sceneManager.tick(delta)
}
```

This advances:

* node updates
* physics updates
* tree systems

---

📌 **Diagram suggestion**

```text id="nqbr0s"
render(delta)
    │
    ▼
SceneManager.tick()
    │
    ▼
Node lifecycle updates
```

---

# Managing Resources

Screens often load and dispose resources such as:

* textures
* audio
* fonts

Example:

```kotlin id="46fcbp"
class DemoScreen : CanopyScreen {

    val texture = manager<AssetsManager>()
        .loadTexture("ball.png")

    override fun dispose() {
        texture.dispose()
    }

}
```

Loading resources inside the screen ensures they are released when the screen is destroyed.

---

# Typical Screen Example

Putting everything together:

```kotlin id="1v4w0g"
class DemoScreen : CanopyScreen {

    override fun setup() {

        EmptyNode("root") {

            EmptyNode("example")

        }.asSceneRoot()

    }

    override fun render(delta: Float) {
        sceneManager.tick(delta)
    }

}
```

---

# When to Use Multiple Screens

Use different screens when the application changes state.

Examples:

| Screen           | Purpose          |
| ---------------- | ---------------- |
| `MainMenuScreen` | start menu       |
| `GameScreen`     | gameplay         |
| `PauseScreen`    | pause overlay    |
| `SettingsScreen` | configuration UI |

This keeps application states separated and easier to manage.

---

📌 **Diagram suggestion**

```text id="z5y0hd"
Application
  │
  ├─ MainMenuScreen
  ├─ GameScreen
  ├─ PauseScreen
  └─ SettingsScreen
```

---

# Summary

Screens represent **major states of your application**.

They are responsible for:

* creating scenes
* updating the scene manager
* managing screen-specific resources

The typical flow is:

```text id="mt9k3n"
Application start
      │
      ▼
Activate Screen
      │
      ▼
Screen.setup()
      │
      ▼
Create Scene
      │
      ▼
render() loop
      │
      ▼
SceneManager.tick()
```

Screens act as the **bridge between the application and the scene tree**.
