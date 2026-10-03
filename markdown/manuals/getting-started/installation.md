<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Installation

Before growing your first scene, give your project a working engine snapshot.
The current workflow builds Canopy from source and publishes its modules to your
local Maven repository. You can then use those modules in your own Gradle app.

> [!WARNING]
> Canopy is **experimental**. These instructions target `0.1.0-dev2`; APIs may
> change before the first stable release.

---

# Working with the Current API

These instructions target **0.1.0-dev2**. Use **JDK 25**, the checked-in
**Gradle 9.8.0** wrapper, and **Kotlin 2.4.10**. Avoid an older compiler when
consuming this snapshot's Kotlin metadata.

## Build the engine locally

```sh
git clone https://github.com/canopyengine/canopy.git
cd canopy
./gradlew publishToMavenLocal
```

On Windows use `gradlew.bat`. This publishes the enabled modules to your local
Maven repository. These instructions do not assume a Maven Central release.

## Application dependencies

```kotlin
repositories {
    mavenLocal()
    mavenCentral()
}

dependencies {
    implementation("io.canopy:engine:0.1.0-dev2")
    implementation("io.canopy:platforms-terminal:0.1.0-dev2")
}

kotlin { jvmToolchain(25) }
```

Use `io.canopy:platforms-headless:0.1.0-dev2` instead for headless hosting.
Headless hosting does not supply the terminal renderer, keyboard input or
terminal filesystem asset manager. Desktop is excluded from the current build.

If Gradle cannot resolve a Canopy dependency, check the `io.canopy` group,
version, local publication and `mavenLocal()` repository. There is no supported
CLI project generator; start with the [first project](first-project.md) or the
[demo repository](https://github.com/canopyengine/canopy-demos).


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
