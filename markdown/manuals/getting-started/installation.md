# Installation

<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

This guide explains how to install **Canopy Engine** and add it to your project.

Canopy is distributed through **Maven repositories** and can be used with build tools such as **Gradle** or **Maven**.

> ⚠️ **Experimental software**
>
> Canopy is currently under active development and future versions may introduce **breaking changes**.

---

# Requirements

Before installing Canopy, ensure your environment includes:

| Tool   | Required         |
| ------ | ---------------- |
| JDK    | 17 or newer      |
| Gradle | 8+ (recommended) |
| Maven  | optional         |

Gradle is the **recommended build system**.

---

# Adding the Engine Dependency

The core engine module is distributed as:

```
io.github.canopyengine:core
```

Replace `$canopyVersion` with the version you want to use.

---

## Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("io.github.canopyengine:core:$canopyVersion")
}
```

---

## Gradle (Groovy DSL)

```groovy
dependencies {
    implementation "io.github.canopyengine:core:$canopyVersion"
}
```

---

## Maven

```xml
<dependency>
    <groupId>io.github.canopyengine</groupId>
    <artifactId>core</artifactId>
    <version>${canopyVersion}</version>
</dependency>
```

---

# Application Modules

The **core engine** provides the runtime systems, but applications also need a **platform launcher module**.

Available launchers:

| Module         | Purpose                                      |
| -------------- | -------------------------------------------- |
| `app-desktop`  | desktop applications (Windows, macOS, Linux) |
| `app-terminal` | terminal-based applications                  |

---

# Installing the Desktop Launcher

For most projects you will want the **desktop launcher**.

---

## Gradle (Kotlin DSL)

```kotlin
dependencies {
    implementation("io.github.canopyengine:app-desktop:$canopyVersion")
}
```

---

## Gradle (Groovy DSL)

```groovy
dependencies {
    implementation "io.github.canopyengine:app-desktop:$canopyVersion"
}
```

---

## Maven

```xml
<dependency>
    <groupId>io.github.canopyengine</groupId>
    <artifactId>app-desktop</artifactId>
    <version>${canopyVersion}</version>
</dependency>
```

---

# Verifying the Installation

Create a minimal application:

```kotlin
fun main() = desktopApp().launch()
```

Run the application.

If the installation is successful, a **blank window will appear**.

---

# Using the Canopy CLI

The easiest way to create a new project is with the **Canopy CLI**.

```bash
canopy new my-game
```

This command creates a project with the recommended structure and dependencies.

Example project:

```
my-game/
├ build.gradle.kts
├ settings.gradle.kts
└ src/
   └ main/
      ├ kotlin/
      │  └ Main.kt
      └ resources/
```

Run the project with:

```bash
./gradlew run
```

---

# Templates

The CLI supports project templates.

Example:

```bash
canopy new my-game --template kotlin
```

Future templates may include:

* 2D starter project
* terminal simulation
* UI demo
* minimal engine example

---

# Troubleshooting

### Gradle cannot resolve the dependency

Ensure the repository is available in your build configuration:

```kotlin
repositories {
    mavenCentral()
}
```

---

### Application window does not appear

Verify that the **desktop module** is installed:

```
io.github.canopyengine:app-desktop
```

---

# Next Step

After installation, continue with the **Getting Started guide** to create your first scene and run gameplay logic.

➡️ **Next: [Getting Started](getting-started.md)**