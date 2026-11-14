# Run your game from the IDE

The foundation integration includes `canopyRun` in the Canopy Gradle plugin.
There is no launcher script to copy. Use matching integration engine/compiler
artifacts until this API is published; see [build setup](build-setup.md).

Apply the Canopy plugin and Gradle's `application` plugin as usual, and set
`application.mainClass`. Existing starter projects already do this.

## In IntelliJ IDEA

1. Reload the Gradle project after updating the plugin.
2. Open the Gradle tool window, then **Tasks → application → canopyRun**.
3. Run the task. IDEA creates a reusable run configuration; select it for later runs.

The task builds the application and opens terminal games in their own window.
Keyboard and mouse input reaches the game directly. The window closes when the
game exits. Startup/build failures remain visible in the IDE. Stopping the launch
terminates its owned game process/window through the shared launcher cleanup.

This does not replace the Run button beside `main()` or install an IDE extension.
Select the generated Gradle configuration for the separate-window launch. Native
Main debugging and automatic IDE debugger attachment are separate integrations.

## From a command line

```sh
./gradlew canopyRun
./gradlew canopyRun --args="--seed 42"
```

On Windows use `.\gradlew.bat canopyRun` in PowerShell. For a multi-project build,
select the application module, for example `./gradlew :game:canopyRun`.

The task uses `installDist`, the application's main class and Java toolchain, and
configured `run` JVM options, environment and working directory. Configure these
through the normal Gradle application/run settings. Keep game arguments after
`--args`; quoted values follow Gradle JavaExec parsing.

Terminal projects open a separate window automatically. Headless applications run
without creating one. Windows uses PowerShell, macOS uses Terminal, and Linux
uses an installed kitty, alacritty, xfce4-terminal or xterm. A desktop session is
required for a new window; startup errors explain when it is unavailable.

For automated checks that need no window:

```sh
./gradlew canopyRun --current-terminal --args=--smoke
```

This explicitly inherits Gradle's console streams. It does not turn the IDE/Gradle
console into a native terminal. For interactive SSH sessions, use the standalone
`CanopyLaunch.java --current-terminal` or an installed distribution directly.
Those remain supported alternatives; the bundled task and source launcher share
one implementation. No Rust CLI or new game-code API is required.
