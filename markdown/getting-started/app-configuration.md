<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Configuring Your App

Now that you have successfully launched your first blank window, it's time to configure your application.

Canopy apps are created through an **app builder DSL**. This builder allows you to define the main systems and configuration your game will use at startup.

Through the app builder, you can configure things such as:

* global managers and scripts
* the **Scene Manager** and its **Tree Systems**
* application lifecycle logic
* screens
* platform-specific app configuration

This is the main entry point of your game.

---

# The App Builder

A Canopy app is usually created by passing a configuration lambda to an app launcher such as `desktopApp`.

Example:

```kotlin id="q1vna8"
const val GAME_WIDTH = 1280
const val GAME_HEIGHT = 720

fun main(args: Array<String>) = desktopApp {

    sceneManager {
        +PhysicsSystem()
    }

    config(
        DesktopCanopyAppConfig(
            title = "Kotlin Rogue",
            screenWidth = GAME_WIDTH,
            screenHeight = GAME_HEIGHT
        )
    )

    screens {
        start(DemoScreen())
    }

}.launch()
```

This creates and launches a desktop application with:

* a configured **Scene Manager**
* a desktop window configuration
* an initial screen

---

📌 **Diagram suggestion**

```text id="6ue7io"
main()
  │
  ▼
desktopApp { ... }
  ├─ sceneManager { ... }
  ├─ config(...)
  └─ screens { ... }
  │
  ▼
launch()
  │
  ▼
Application starts
```

---

# Configuring the Scene Manager

The `sceneManager {}` block allows you to configure the **Scene Manager** before the application starts.

This is where you typically register **Tree Systems** that should be active globally.

Example:

```kotlin id="u4slv6"
sceneManager {
    +PhysicsSystem()
}
```

In this example, the `PhysicsSystem` is added to the Scene Manager and will participate in processing the active scene tree.

Use this section for systems such as:

* physics
* rendering
* input
* custom global tree systems

---

📌 **Diagram suggestion**

```text id="vsahk7"
SceneManager
  ├─ PhysicsSystem
  ├─ RenderSystem
  └─ CustomTreeSystem
```

---

# Configuring the App Window

The `config(...)` block is used to provide platform-specific application settings.

For desktop apps, this usually means passing a `DesktopCanopyAppConfig`.

Example:

```kotlin id="urmk0m"
config(
    DesktopCanopyAppConfig(
        title = "Kotlin Rogue",
        screenWidth = GAME_WIDTH,
        screenHeight = GAME_HEIGHT
    )
)
```

Common configuration includes:

* window title
* screen width and height
* other platform-specific settings

This configuration determines how the application window is created when the game launches.

---

# Configuring Screens

The `screens {}` block defines the application's screens.

Example:

```kotlin id="5yzo83"
screens {
    start(DemoScreen())
}
```

`start(...)` both:

* registers the screen
* sets it as the initial screen

Screens are commonly used to represent major application states such as:

* main menu
* gameplay
* pause menu
* settings

---

📌 **Diagram suggestion**

```text id="zv6vck"
Application
  │
  ▼
Screens
  ├─ MainMenuScreen
  ├─ GameScreen
  └─ SettingsScreen

Initial screen → DemoScreen
```

---

# Putting It All Together

A typical app configuration combines the Scene Manager, app config, and screens in one place.

```kotlin id="yl86d5"
const val GAME_WIDTH = 1280
const val GAME_HEIGHT = 720

fun main(args: Array<String>) = desktopApp {

    sceneManager {
        +PhysicsSystem()
    }

    config(
        DesktopCanopyAppConfig(
            title = "Kotlin Rogue",
            screenWidth = GAME_WIDTH,
            screenHeight = GAME_HEIGHT
        )
    )

    screens {
        start(DemoScreen())
    }

}.launch()
```

This pattern is a good default for most Canopy applications.

---

# Launching the App

Once the builder is configured, the application can be started.

## Synchronous Launch

For most projects, launching on the main thread is enough.

```kotlin id="v1m6lw"
fun main(args: Array<String>) = desktopApp {

    // configuration...

}.launch()
```

This starts the application immediately on the current thread.

---

# Asynchronous Launch

In some situations, you may want to keep the main thread available for other logic and launch the app on another thread instead.

For this, use `launchAsync()`.

Example:

```kotlin id="jivd91"
fun main(args: Array<String>) {

    val app = desktopApp {

        sceneManager {
            +PhysicsSystem()
        }

        config(
            DesktopCanopyAppConfig(
                title = "Kotlin Rogue",
                screenWidth = GAME_WIDTH,
                screenHeight = GAME_HEIGHT
            )
        )

        screens {
            start(DemoScreen())
        }

    }.launchAsync()

    /* Other tasks... */
}
```

`launchAsync()` returns an **app handler**, which can be used to interact with or close the application later.

---

📌 **Diagram suggestion**

```text id="v0y7fg"
Main Thread
  ├─ launchAsync()
  ├─ receives AppHandler
  └─ continues running other logic

Secondary Thread
  └─ runs Canopy app
```

---

# When to Use Each Launch Mode

Use `launch()` when:

* the app should run directly on the current thread
* you do not need extra thread coordination
* you want the simplest startup flow

Use `launchAsync()` when:

* the main thread must keep doing other work
* the app needs to be launched separately
* you want access to an app handler

For most games, `launch()` is the default choice.

---

# Summary

The app builder is the main place where a Canopy application is configured.

It allows you to:

* register global tree systems
* configure the application window
* define screens
* choose how the application launches

A typical startup flow looks like this:

```text id="5nlvjo"
Configure app
   ↓
Configure scene manager
   ↓
Configure app settings
   ↓
Configure screens
   ↓
Launch application
```

This gives you a single, structured place to define how your game starts.