# Terminal starter

A visible external Canopy consumer: reactive text, buttons, conditional UI,
a command overlay and bounded startup/shutdown smoke. No gameplay framework is
introduced. Requires JDK 25, Kotlin 2.4.10 and matching Canopy `0.1.0-dev2`
artifacts published from engine commit `61122d43706ee9e1e4aa78c84764545be2f46ee9`.

Follow [installation](../../markdown/manuals/getting-started/installation.md)
and [the walkthrough](../../markdown/manuals/getting-started/first-project.md).

```sh
./gradlew -Dmaven.repo.local=/absolute/path/to/canopy-local-maven run
./gradlew -Dmaven.repo.local=/absolute/path/to/canopy-local-maven run --args=--smoke
```

Arrows select buttons; Enter activates. Escape toggles commands in raw mode;
`:console` opens them in line mode. `help`, `add`, `pause`, `resume`, `quit` are
available. Opening the overlay captures input without pausing updates. Resize
interactively to check layout.

The wrapper is copied unchanged from the pinned engine (Gradle 9.8.0). The build
applies `io.github.canopyengine.compiler`; omitting it does not produce an equivalent example.
Both signals have explicit world ownership and are disposed by scene teardown.
The smoke submits add/pause/resume, checks population, runs three updates and requests
normal exit; it is not a keyboard-input test.
