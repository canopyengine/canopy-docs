<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Project structure

A clear project layout makes your game **easier to navigate as it grows**.
Canopy does not enforce a game-specific folder structure. Begin with a standard
Gradle application, then group screens, nodes and systems when you need them.

---

# Working with the Current API

A current terminal application can use this standard Gradle layout:

```text
project/
  settings.gradle.kts
  build.gradle.kts
  gradlew / gradlew.bat
  gradle/wrapper/
  src/main/kotlin/example/Main.kt
  src/main/resources/config.toml
```

Organize growing applications into screens, nodes, behaviors, systems and data
packages as needed. These are application choices, not required engine modules.
Terminal resource files can be loaded with `FileSource.Classpath`.
Shared declarative UI can live in its own application package; its terminal backend
is available now. Textures, audio and shaders remain future graphical use cases;
enabled hosts do not currently offer those graphical APIs.

The demo's Gradle project is under `engine/0.1.0/`, not its repository root.
Its versioned directory names the target release series; its actual dependency
version is **0.1.0-dev2**. See [installation](../getting-started/installation.md)
for toolchain and [architecture](../../engine-details/engine-architecture.md)
for engine module boundaries.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
