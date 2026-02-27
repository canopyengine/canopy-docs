---
title: Getting Started
parent: Home
nav_order: 1
has_children: true
permalink: /getting-started/
---

<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# 0. Getting Started

> [!WARNING]
> Before you start, take into consideration the engine is very unstable and future versions may be released with breaking changes.
> For that reason, it's not recommended to use ``Canopy`` outside of test projects, as it may break your games.

## Adding ``Canopy`` to your project 

**To get started with ``Canopy Engine``, you need to set up your development environment.**

### Gradle
Kotlin DSL:
```kotlin
"implementation"("io.github.canopyengine:core", "$canopyVersion") // replace with real version
```

Groovy:
````groovy
implementation "io.github.canopyengine:core" version "$canopyVersion" // replace with real version
````

####  Maven projects
````xml
<dependency>
    <group-id>io.github.canopyengine</group-id>
    <artifact-id>app-desktop</artifact-id>
</dependency>
````

## Bootstrapping an app

In order to bootstrap your first game, you simply need to import one of the available ``app-*`` modules available.
For the sake of simplicity, let's create a graphical game, so let's import the ``app-desktop``, which allows your app to
run on any x86/x64 machine(Windows, Linux and some MacOS versions).

#### Gradle
Kotlin DSL:
```kotlin
"implementation"("io.github.canopyengine:app-desktop", "$canopyVersion") // replace with real version
```
Groovy:
````groovy
implementation "io.github.canopyengine:app-desktop" version "$canopyVersion" // replace with real version
````

####  Maven projects
````xml
<dependency>
    <group-id>io.github.canopyengine</group-id>
    <artifact-id>app-desktop</artifact-id>
</dependency>
````

### Launch!

Now the only thing that's left is to configure the app and launch it! For that we only need to go to our main file and
configure the app.

Example:

````kotlin
fun main() = desktopApp().launch()
````

... and that's it! If you run your code, a black window should pop up.

Now you're ready to explore ``Canopy`` and create awesome games!
