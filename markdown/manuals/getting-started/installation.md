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

PR #208 is merged. This starter targets engine commit
[`61122d43706ee9e1e4aa78c84764545be2f46ee9`](https://github.com/canopyengine/canopy/commit/61122d43706ee9e1e4aa78c84764545be2f46ee9), not a moving review branch.
The development version is still `0.1.0-dev2`: pin the source revision as well as
its version, because different revisions can publish the same development coordinate.

```sh
git clone https://github.com/canopyengine/canopy.git
cd canopy
git checkout 61122d43706ee9e1e4aa78c84764545be2f46ee9
./gradlew -Dmaven.repo.local="$PWD/../canopy-local-maven" publishToMavenLocal
```

Install JDK 25 for engine compilation and JDK 17 for the compiler tooling;
Gradle must be able to discover both toolchains. The compiler artifact runs in
the Kotlin compiler host; the separate Gradle plugin runs in Gradle. Keep all
published Canopy artifacts from this same checkout.

On Windows use `gradlew.bat` and an absolute local repository path. The isolated
repository avoids accidentally mixing these artifacts with older development
publications. This workflow does not assume a Maven Central release.

When building the starter, pass the **same absolute repository path**:

```sh
./gradlew -Dmaven.repo.local=/absolute/path/to/canopy-local-maven run
```

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
    id("io.github.canopyengine.compiler") version "0.1.0-dev2"
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
`io.github.canopyengine:canopy-compiler-gradle` runs in Gradle and resolves
`io.github.canopyengine:canopy-compiler` for the Kotlin compiler. Users only apply the plugin ID
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
    implementation("io.github.canopyengine:engine:0.1.0-dev2")
    implementation("io.github.canopyengine:platforms-terminal:0.1.0-dev2")
}

kotlin { jvmToolchain(25) }
```

Use `io.github.canopyengine:platforms-headless:0.1.0-dev2` instead for headless hosting.
Headless hosting does not supply the terminal renderer, keyboard input or
terminal filesystem asset manager. Desktop is excluded from the current build.

If Gradle cannot resolve a Canopy dependency, check the `io.github.canopyengine` group,
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

## Maven namespace migration

This source snapshot uses the verified GitHub namespace `io.github.canopyengine`.
The migration is [engine PR #214](https://github.com/canopyengine/canopy/pull/214);
use its pinned revision above while it is under review.
Previous `io.canopy:<artifact>` dependencies become `io.github.canopyengine:<artifact>`,
and the Gradle plugin ID changes from `io.canopy.compiler` to
`io.github.canopyengine.compiler`. The new ID also places the plugin marker under
the verified namespace. Kotlin imports such as `io.canopy.engine.ui.UiRoot` stay unchanged.

Rebuild/publish matching artifacts from the pinned migration revision; the older
9c1e0f9 build publishes the previous coordinates. There are no relocation artifacts
or old plugin aliases. Version remains 0.1.0-dev2; this migration does not declare
a Maven Central release. Continue using the isolated local repository until
remote publication, signing and immutable release versions are validated.
