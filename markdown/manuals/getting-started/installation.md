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

## Required compiler integration

Apply the general Canopy compiler Gradle plugin to every game module declaring custom nodes. A
library dependency alone cannot install a compiler plugin in a separate build.
Source builds publish the plugin marker, implementation and compiler artifact
alongside the enabled engine modules with `publishToMavenLocal`.

In `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
    }
}
```

In each game module's `build.gradle.kts`:

```kotlin
plugins {
    kotlin("jvm") version "2.4.10"
    id("io.canopy.compiler") version "0.1.0-dev2"
}
```

Use the Kotlin version pinned by the matching Canopy release. The plugin supplies
its compiler dependency automatically and checks every Kotlin compilation,
including test sources and indirect node subclasses. Classes need no annotation.
Ordinary supported Node `val`/`var` properties are compiled into guarded engine-owned storage, including constructor
properties and custom accessors. Explicit `by nodeProperty(...)` remains compatible. Unsupported field-dependent forms
produce source-located diagnostics; runtime hooks must match the compiler artifact. See
[custom node state and migration](../concepts/core/nodes/nodes.md#compiler-enforced-custom-state) for supported forms,
explicit ownership and JVM field compatibility. Java and precompiled classes are also validated at runtime before
state allocation; a missing plugin must not be used as a way to bypass the storage contract.
Ordinary Node constructor calls also receive synchronous rollback protection. Java and dynamic factories need an
explicit boundary; see [failed construction](../concepts/core/nodes/nodes.md#failed-construction).

Both execution hosts are packaged by the single `tooling/compiler` module:
`io.canopy:canopy-compiler-gradle` runs in Gradle and resolves
`io.canopy:canopy-compiler` for the Kotlin compiler. Users only apply the plugin ID
above; no manual compiler dependency is required.

### Compiler rules

The plugin installs Canopy's compile-time rules. Node-state safety is mandatory;
future rules use the same plugin ID and installation. Engine contributors add a
`CanopyCompilerRule` implementation and register its fully qualified name in
`META-INF/services/io.canopy.tooling.compiler.CanopyCompilerRule`. Rules receive
source declarations, including classes, properties and functions, and report
errors through the shared diagnostic context. No registrar or traversal change
is required. Providers must be visible to the compiler plugin classloader and
use the pinned Kotlin version; independently loaded Kotlin plugin jars do not
automatically share providers. See the [compiler extension guide](https://github.com/canopyengine/canopy/blob/main/tooling/compiler/README.md).

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
