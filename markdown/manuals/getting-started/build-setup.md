<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Build setup reference

This page is for adding Canopy to an existing Kotlin project, upgrading an older
project or building the engine itself. For your first project, follow
[installation](installation.md). You do not need to understand this reference
before running the starter.

> [!WARNING]
> Canopy is **experimental**. These instructions target `0.1.0-alpha.1`; APIs may
> change before the first stable release.

---

# Versions and build configuration

These instructions target **0.1.0-alpha.1**. Use **JDK 25**, the checked-in
**Gradle 9.8.0** wrapper, and **Kotlin 2.4.10**. Avoid an older compiler when
consuming this snapshot's Kotlin metadata.

## Published release

The engine, compiler, Gradle plugin implementation and plugin marker are available
from Maven Central under the same immutable `0.1.0-alpha.1` version. Keep their
versions aligned. The terminal starter clean build and smoke run have been verified
with remote repositories and without `mavenLocal()` or a composite engine build.

Use JDK 25 for your game. Compiler and Gradle plugin artifacts target JDK 17 for
host compatibility; game users do not need to build those tooling artifacts.

## Required compiler integration

Apply the general Canopy compiler Gradle plugin to every game module declaring custom nodes. A
library dependency alone cannot install a compiler plugin in a separate build.
The plugin marker, implementation and compiler artifact are published alongside
the enabled engine modules.

In `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
    }
}
```

In each game module's `build.gradle.kts`:

```kotlin
plugins {
    kotlin("jvm") version "2.4.10"
    id("io.github.canopyengine.compiler") version "0.1.0-alpha.1"
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
    mavenCentral()
}

dependencies {
    implementation("io.github.canopyengine:engine:0.1.0-alpha.1")
    implementation("io.github.canopyengine:platforms-terminal:0.1.0-alpha.1")
}

kotlin { jvmToolchain(25) }
```

Use `io.github.canopyengine:platforms-headless:0.1.0-alpha.1` instead for headless hosting.
Headless hosting does not supply the terminal renderer, keyboard input or
terminal filesystem asset manager. Desktop is excluded from the current build.

If Gradle cannot resolve a Canopy dependency, check the `io.github.canopyengine` group,
version and `mavenCentral()` in both plugin and application repositories. There is no supported
CLI project generator; start with the [first project](first-project.md) or the
[demo repository](https://github.com/canopyengine/canopy-demos).


## Maven namespace migration

This source snapshot uses the verified GitHub namespace `io.github.canopyengine`.
The migration is [engine PR #214](https://github.com/canopyengine/canopy/pull/214);
it is merged and included in the published alpha.
Previous `io.canopy:<artifact>` dependencies become `io.github.canopyengine:<artifact>`,
and the Gradle plugin ID changes from `io.canopy.compiler` to
`io.github.canopyengine.compiler`. The new ID also places the plugin marker under
the verified namespace. Kotlin imports such as `io.canopy.engine.ui.UiRoot` stay unchanged.

There are no relocation artifacts or old plugin aliases. Update coordinates and
use matching `0.1.0-alpha.1` artifacts from Central.

## Optional source development

Engine contributors can still publish a matching source checkout into an isolated
local repository. The release preparation source is
[`28f37c8e36d157d6ca8da1ecfbca1c3ebf86d3ee`](https://github.com/canopyengine/canopy/commit/28f37c8e36d157d6ca8da1ecfbca1c3ebf86d3ee).
Install JDK 25 and JDK 17 so Gradle can discover both build toolchains.

```sh
git clone https://github.com/canopyengine/canopy.git
cd canopy
git checkout 28f37c8e36d157d6ca8da1ecfbca1c3ebf86d3ee
./gradlew -Dmaven.repo.local="$PWD/../canopy-local-maven" publishToMavenLocal
```

For that development workflow only, add `mavenLocal()` before Central in both
consumer repository blocks and pass the same absolute `-Dmaven.repo.local` path
to the consumer. On Windows use `gradlew.bat`. Never upload changed artifacts
under the already published alpha version; use a separate development version.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
