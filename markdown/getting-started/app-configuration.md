<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# 1. Configuring your app

Now that you successfully launched your first award-winning blank screen, let's add some sauce to it. The app builder 
allows you to pass configuration to it via a lambda argument. Here you can configure things like:

- Global Managers/Scripts
- [System Manager]()'s [tree systems](/markdown/manuals/core/node-system.md#tree-systems).
- Logic attached to the app's [lifecycle]().
- Configuring [Screens]().
- etc...

Example
````Kotlin
// Main.kt

const val GAME_WIDTH = 1280
const val GAME_HEIGHT = 720

fun main(args: Array<String>) = desktopApp {
    // Configure scene manager
    sceneManager {
        +PhysicsSystem() // Add system
    }

    // Custom app config
    config(
        DesktopCanopyAppConfig(
            title = "Kotlin Rogue",
            screenWidth = GAME_WIDTH,
            screenHeight = GAME_HEIGHT
        )
    )

    // Configure screens
    screens {
        start(DemoScreen()) // Automatically registers and sets this screen as main
    }
}.launch() // Sync launch
````

### Async launch
For most use-cases, launching the app on the main thread is enough, but in case you need some logic where you really need 
to free the main thread, you can asynchronous launch the app

Example

````kotlin
fun main(args: Array<String>){
    
    // Will hold an AppHandler object - use it to close the app
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
````
