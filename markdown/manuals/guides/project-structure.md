# Project structure

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
Textures, audio, shaders and UI are planned desktop use cases; enabled hosts do
not currently offer those graphical APIs.

The demo's Gradle project is under `engine/0.1.0/`, not its repository root.
Its versioned directory names the target release series; its actual dependency
version is **0.1.0-dev2**. See [installation](../getting-started/installation.md)
for toolchain and [architecture](../../engine-details/engine-architecture.md)
for engine module boundaries.
