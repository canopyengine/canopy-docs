<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="/markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>

# Project Guidelines

[All contribution topics](../index.md#contributing)

This document aims to provide guidelines for topics not discussed on other pages, but as crucial as any.

# Bug reports, feature proposals and pull requests
For topics regarding bug reports, proposing new features and contributing to pull requests, refer to the 
[Contributor Guidelines](https://github.com/canopyengine/canopy/blob/main/CONTRIBUTING.md) page.

# Adding new dependencies

During development, some features may need dependencies which are not present in the project. Notably, you should always
discuss with the rest of the community, as blindly adding dependencies to the project may harm the engine.

When adding a new dependency, you should:

## Update ``libs.versions.toml``

This document lets you alias dependencies so that they can be reused across modules

### 1. Create a new version entry
Versions are grouped by their domain(kotlin/gdx/toml/logging) and you should do the same. 
You create new version entries under the ``[versions]`` section.

````toml
newDependency = "0.1.0"
````

> [!NOTE]
> Version aliases should be camel case.

### 2. Create a new library entry
Similar to versions, you should group library entries by domain. They are defined inside the ``[libraries]`` section.

````toml
newDependency-someModule = { module = "org.example.group:module", version.ref = "newDependency" }
newDependency-otherModule = { module = "org.example.group:module", version.ref = "newDependency" }
````

Some important notes:

* Library entries should be named with the convention ``group-module``, as this will convert into ``group.module`` in the 
``build.gradle.kts`` files.
* Unless strictly needed, for multiple modules of the same group, create only one version entry and reuse them across
all modules.
* Similar to version naming, group and module naming should be camel case.

## Update the module's ``build.gradle.kts``

### 3. Add the dependency to the modules
You can now add the dependency to the target modules(and only them), using one of Gradle's dependency configurations:

| Configuration               | What it Means                                                                                     | Use When                                                                        | Do NOT Use When                                                                               |
|-----------------------------| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **`implementation`**        | Dependency is **internal to the module** and not exposed to other modules.                        | The dependency is only used **inside the module implementation**.               | The dependency **appears in public APIs** (method return types, parameters, exposed classes). |
| **`api`**                   | Dependency becomes **part of the module's public API** and is visible to modules depending on it. | Your public classes **expose types from this dependency**.                      | The dependency is **only used internally** (prefer `implementation`).                         |
| **`compileOnly`**           | Dependency is needed **only at compile time**, not included in runtime or packaging.              | Provided by the runtime environment (e.g., servlet container, annotation APIs). | Your application **needs the dependency at runtime**.                                         |
| **`runtimeOnly`**           | Dependency is **not needed to compile**, but required at runtime.                                 | Runtime drivers, logging implementations, service loaders.                      | Your code **directly imports classes from it**.                                               |
| **`testImplementation`**    | Dependency used **only for compiling and running tests**.                                         | Testing frameworks and libraries (JUnit, Mockito).                              | Production code needs it.                                                                     |
| **`testRuntimeOnly`**       | Dependency needed **only when running tests**, not compiling them.                                | Test engines or runtime extensions.                                             | Test source code directly imports classes from it.                                            |
| **`annotationProcessor`**   | Dependency that **generates code at compile time** via annotation processing.                     | Libraries like Lombok, MapStruct, Dagger processors.                            | The dependency is needed in runtime code.                                                     |
| **`testCompileOnly`**       | Compile-only dependency but **only for test sources**.                                            | Test APIs provided by the environment but not packaged.                         | Tests require the dependency at runtime.                                                      |
| **`testAnnotationProcessor`** | Annotation processors used **only in tests**.                                                     | Code generation for test sources.                                               | Processor is required in main code.                                                           |

**Current example** (`engine/build.gradle.kts`):

```kotlin
dependencies {
    api(projects.tooling.utils)
    api(libs.coroutines.core)
    implementation(libs.tomlkt)
    testImplementation(libs.junit.jupiter)
}
```

Choose configurations based on actual public API exposure. Follow the current
module build scripts rather than historical split-engine module names.

# Adding a new module

Agree the design with a maintainer first. Consider whether an existing module can
own the behavior, keep dependencies small, and avoid feature-only fragmentation.
Existing user or maintainer approval of the design satisfies this requirement.

### 1. Choose the appropriate repository area

Use `engine/` for backend-independent engine code, `adapters/` for backend
integration, `platforms/` for application hosts, and `tooling/` for development
utilities. Most engine features belong in the existing `:engine` module.

An approved module must have:

- A Kotlin `build.gradle.kts` and ignored generated `build/` output.
- Production sources under `src/main/kotlin` and tests under `src/test/kotlin`.
- A package matching its area, such as `io.canopy.adapters.<backend>`.
- A kebab-case module name and short package segments.

### 2. Configure build.gradle.kts

Enable the Kotlin JVM and ktlint plugins. Add serialization only if needed. Keep
shared settings in the root build script and module-specific dependencies here.

```kotlin
plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.ktlint)
    `java-library`
}

dependencies {
    implementation(projects.engine)
}
```

### 3. Update settings.gradle.kts

Include the module once in the appropriate group, for example:

```kotlin
include(":adapters:my-backend")
```

Run `./gradlew projects` to inspect the module list, then run
`./gradlew test ktlintCheck build`. Do not disable existing modules or tests to
make the new module pass. State any pre-existing verification limits.

# Versioning
As with any software project, Canopy is target of continuous development and that means it needs a way to identify each 
``release``.

Canopy uses the [Semantic Versioning](https://bytebytego.com/guides/what-do-version-numbers-mean/) rules.

In summary, each Canopy release follows the format``MAJOR.MINOR.PATCH``

| Part      | Meaning                            |
| --------- | ---------------------------------- |
| **MAJOR** | Breaking changes to the public API |
| **MINOR** | Backward-compatible new features   |
| **PATCH** | Backward-compatible bug fixes      |

## Pre-release tags
Next to the semantic version, we also append a **pre-release** tag(stable releases omit this tag).

> [!IMPORTANT]
> When releasing a build with the same version and pre-release tag, append a sequential identifier next to it, in the following format:
> MAJOR.MINOR.PATCH-<PRE-RELEASE-TAG><IDENTIFIER>

Example
````
1.0.0-rc1
1.0.0-rc2
````

The default tags are:

### dev (Development)

**Purpose:** Active development builds.

A **dev version** represents code that is still under active development. Features may be incomplete, APIs may change, 
and the software may be unstable.

**Characteristics**

* Features still being added
* Frequent breaking changes
* Often built automatically from the main development branch
* Mostly used by contributors or early testers

**Example**

```
2.0.0-dev1 
```

**When to use**

* Internal development
* Testing new features early
* Continuous integration builds

**Stability**

Very unstable.

---

### alpha

**Purpose:** Early preview of new functionality.

An **alpha release** is the first stage where a version is packaged for testing. Major features may exist but are still incomplete or poorly tested.

**Characteristics**

* Core features are being implemented
* Some features may still be missing
* APIs can still change significantly
* Used for early external testing

**Example**

```
2.0.0-alpha
2.0.0-alpha1
2.0.0-alpha2
```

**When to use**

* Early testers
* Developers experimenting with upcoming features

**Stability**

Unstable but more structured than `dev`.

---

### beta

**Purpose:** Feature-complete testing phase.

A **beta release** means that the planned features are mostly finished. The focus shifts from adding features to **fixing bugs and improving stability**.

**Characteristics**

* Feature complete
* API mostly stable
* Wider public testing
* Bug fixes and performance improvements

**Example**

```
2.0.0-beta1
2.0.0-beta2
```

**When to use**

* Public testing
* Early adopters
* Integration testing with other systems

**Stability**

Moderately stable but still not production-ready.

---

### rc (Release Candidate)

**Purpose:** Final verification before the stable release.

A **release candidate (RC)** is a version that is expected to become the final release unless critical bugs are discovered.

**Characteristics**

* No new features allowed
* API frozen
* Only critical bug fixes
* Final compatibility testing

**Example**

```
2.0.0-rc1
2.0.0-rc2
```

If no major issues appear:

```
2.0.0
```

**When to use**

* Final testing before release
* Production validation environments

**Stability**

Very stable and close to production-ready.

### Stable Release (No Pre-Release Tag)

In **Semantic Versioning**, a **stable release** is a version **without any pre-release tag**. This means the release has completed its documented acceptance criteria. For a pre-1.0 project,
this does not imply an indefinitely stable API or an unspecified support promise.

Example:

```text
2.3.0
```

Unlike versions such as:

```text
2.3.0-beta
2.3.0-rc.1
```

a version **without a suffix** is the official finalized release.

---

**Purpose**

A stable release represents the **final version of a release cycle** after development, testing, and verification stages are complete.

It is intended for:

* production environments
* general users
* long-term maintenance

---

**Characteristics**

* fully tested and verified
* no experimental features
* documented public API and compatibility policy
* validated against the release acceptance criteria
* receives bug fixes through patch releases

---

### Example Release Progression

A typical progression might look like:

```text
1.5.0-dev
1.5.0-alpha1
1.5.0-beta1
1.5.0-beta2
1.5.0-rc1
1.5.0 <-- stable release
```

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
## Current engine baseline

This guidance targets 0.1.0-alpha.1: JDK 25, Kotlin 2.4.10 and the Gradle 9.8.0
wrapper. Desktop is excluded; terminal and headless are enabled. See the
[current architecture](../engine-details/engine-architecture.md) and
[snapshot notes](../misc/releases/0.1.0.md).
