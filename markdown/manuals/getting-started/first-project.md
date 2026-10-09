# First project: a visible terminal application

Use the checked-in [terminal starter](../../../examples/terminal-starter/README.md).
It includes a pinned Gradle wrapper, complete compiler-plugin configuration and
source that actually renders text, buttons and conditional content.

## Build and run

Follow [installation](installation.md) to publish the pinned engine and tooling
into an isolated local Maven repository. Clone this documentation repository,
then run:

```sh
cd canopy-docs/examples/terminal-starter
./gradlew -Dmaven.repo.local=/absolute/path/to/canopy-local-maven run
```

Use JDK 25. On Windows use `gradlew.bat`. In an interactive terminal, use arrows
to focus a button and Enter to activate it. Escape opens/closes the bottom command
editor. In line-mode input, enter `:console` to open it. Type `help`, `add`,
`pause`, `resume` or `quit`. The prompt captures gameplay keys while open;
opening it does not pause the app. Pause/resume is explicit. Resize the terminal
to see layout adapt.

For a finite noninteractive process check:

```sh
./gradlew -Dmaven.repo.local=/absolute/path/to/canopy-local-maven run --args=--smoke
```

The smoke submits add/pause/resume, checks population and exits after three updates.
It proves command dispatch, startup and shutdown, not keyboard
interaction or resize behavior; check those interactively.

## What the example does

1. `terminalApp` supplies the terminal host, input and rendering.
2. `onEnter` constructs a world node and two signals explicitly owned by it.
3. `UiRoot` builds the visible interface. Signal reads in text and `if` conditions
   are observed through the compiler plugin; callbacks run when actions occur.
4. The command prompt changes the same population signal as the button.
5. `asSceneRoot()` installs the world in the active scene. Terminal hosting
   registers prompt focus and presentation.
6. `quit` requests application exit. Scene destruction cleans up the world-owned
   signals, UI observers and prompt. No manual signal disposal is needed here.

The population is a deliberately tiny interaction example, not an ecosystem
simulation or a fixed-step gameplay clock. Follow the source before introducing
systems: one state source is shared by actions, commands and presentation.

Detachment is not destruction: `removeChild` preserves reusable node state;
use `queueFree()` for permanent removal. The example relies on scene destruction
at shutdown rather than leaving detached nodes unowned.

The complete source and build files are maintained in the starter directory,
rather than duplicated here. There is no required CLI project generator.
