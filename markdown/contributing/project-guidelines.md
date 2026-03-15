<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>

# Project Guidelines

<!-- TOC -->
* [Project Guidelines](#project-guidelines)
* [Bug reports, feature proposals and pull requests](#bug-reports-feature-proposals-and-pull-requests)
* [Adding new dependencies](#adding-new-dependencies)
  * [Update ``libs.version.toml``](#update-libsversiontoml)
    * [1. Create a new version entry](#1-create-a-new-version-entry)
    * [2. Create a new library entry](#2-create-a-new-library-entry)
  * [Update the module's ``build.gradle.kts``](#update-the-modules-buildgradlekts)
    * [3. Add the dependency to the modules](#3-add-the-dependency-to-the-modules)
* [Adding a new module](#adding-a-new-module)
    * [1. Create the module inside ``engine`` root folder](#1-create-the-module-inside-engine-root-folder)
    * [2. Configure build.gradle.kts](#2-configure-buildgradlekts)
    * [3. Update ``settings.gradle.kts``](#3-update-settingsgradlekts)
* [Versioning](#versioning)
  * [Pre-release tags](#pre-release-tags)
    * [dev (Development)](#dev-development)
    * [alpha](#alpha)
    * [beta](#beta)
    * [rc (Release Candidate)](#rc-release-candidate)
    * [Stable Release (No Pre-Release Tag)](#stable-release-no-pre-release-tag)
    * [Example Release Progression](#example-release-progression)
<!-- TOC -->

This document aims to provide guidelines for topics not discussed on other pages, but as crucial as any.

# Bug reports, feature proposals and pull requests
For topics regarding bug reports, proposing new features and contributing to pull requests, refer to the 
[Contributor Guidelines](https://github.com/canopyengine/canopy/blob/main/CONTRIBUTING.md) page.

# Adding new dependencies

During development, some features may need dependencies which are not present in the project. Notably, you should always
discuss with the rest of the community, as blindly adding dependencies to the project may harm the engine.

When adding a new dependency, you should:

## Update ``libs.version.toml``

This document lets you alias dependencies so that they can be reused across modules

### 1. Create a new version entry
Versions are grouped by their domain(kotlin/gdx/toml/logging) and you should do the same. 
You create new version entries under the ``[versions]`` section.

````toml
newDependecy = "0.1.0"
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

**Example**:

Below is part of the ``core`` module dependencies
````kotlin
dependencies {
    // Canopy
    api(projects.engine.utils)
    api(projects.engine.logging)

    // Logging
    api(libs.slf4j.api)
    runtimeOnly(libs.logback.classic)
}
````

And next is the ``app-core`` module dependencies

````kotlin
dependencies {
    // Canopy deps
    implementation(projects.engine.core)
    implementation(projects.engine.logging)
    implementation(projects.engine.data.dataCore)

    // Ktx
    api(libs.ktx.app)
    api(libs.ktx.assets.async)
    api(libs.ktx.assets)
    api(libs.ktx.async)
}
````

Each module and configuration has a different meaning behind it

* We use ``api`` when referencing canopy modules in ``core`` and not in ``app-core`` because we want ``core`` to expose
mandatory modules, such as utils and logging, without the user needing to explicitly define them in its configuration setup.
* We use ``implementation`` to reference them in ``app-core`` because we want the user to explicitly configure 
the ``core`` module in its configuration setup.
* In ``core``, we use ``runtimeOnly`` when referencing logback, because we don't need any compilation done on logback,
and just need to use it on runtime.

---

# Adding a new module
> [!CAUTION]
> Adding a new module is a decision that cannot be made in a whim. You should thoroughly discuss it with a maintainer, 
> and only then consider it. Before that, please discuss other possibilities, as a new module is a very critical decision.

When adding a new module, you'll have to have some architecture decisions in mind:

* Can this logic be part of an already-existing module? - If so, you should consider adding it before creating a new module.
* Can this module be as atomic as possible? I.e. can this module have as little dependencies from other modules as possible.
* Can this module be expanded by other features? - Can other people expand on this module, or is it feature-only? 
If so please reconsider adding it to the project.

To add a new module, the first step is to:

### 1. Create the module inside ``engine`` root folder

Every module must be located inside the ``engine`` root folder. Inside, if there is already a ``modules wrapper`` folder
where your module can be created, please do so. If not, you can create it directly inside the engine folder.

Each module must contain:

* A .gitignore that ignores folders like .build.
* A build.gradle.kts file - For coherence, groovy files are not allowed.
* A src folder with:
  * src/main/kotlin/io/canopy/engine/<path_to_your_module>
  * (optional) src/test/kotlin/io/canopy/engine/<path_to_your_module>

> [!IMPORTANT]
> Your module should be named using kebab case (example: my-module)

> [!IMPORTANT]
> It's highly recommended you use a single word (or two at most) for your package name.
> If more than two words are needed, you should divide each word into a folder.

> [!NOTE]
> The Canopy Teams may deem fit to move your module with others in a ``wrapper`` folder.

### 2. Configure build.gradle.kts

Your ``build.gradle.kts`` should only have configuration specific to the module, as any general configuration is already
done in the root ``build.gradle.kts``.

Example(input module):

````kotlin
plugins {
    alias(libs.plugins.kotlin.serialization) // Allows serialization with kotlinx
    alias(libs.plugins.ktlint) // Allows linting - mandatory
}

dependencies {
    // Canopy
    implementation(projects.engine.core)
    implementation(projects.engine.data.dataCore)
    implementation(projects.engine.data.dataSaving)
    implementation(projects.engine.utils)
    implementation(projects.engine.logging)
}
````

> [!CAUTION]
> Your module must enable the ``ktlint`` plugin, as code coherence is a founding principle.

### 3. Update ``settings.gradle.kts``

In the root ``setting.gradle.kts`` you must include your module, as shown below:

````kotlin
include(":engine:my-module") // if inside a wrapper use :engine:wrapper:my-module
````

**List synced modules**

````bash
./gradlew projects
````

You should see your module listed

**Build the project**

````bash
./gradlew build
````

> [!NOTE]
> If using IntelliJ, check their [Modules](https://www.jetbrains.com/help/idea/creating-and-managing-modules.html#multimodule-projects) guide.

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

In **Semantic Versioning**, a **stable release** is a version **without any pre-release tag**. This means the software is considered **production-ready and fully supported**.

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
* stable public API
* safe for production use
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