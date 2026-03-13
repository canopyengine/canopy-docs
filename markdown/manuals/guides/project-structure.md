# Project Structure

<p style="display: flex; align-items: center; gap: 10px;">
<a href="/markdown/index.md">
<img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
</a>
</p>

Organizing your project properly helps keep your game **maintainable as it grows**.

While Canopy does not enforce a strict layout, following a consistent structure makes projects easier to navigate and scale.

---

# Typical Project Layout

A minimal Canopy project might look like this:

```
my-game/
├ build.gradle.kts
├ settings.gradle.kts
│
├ src/
│  └ main/
│     ├ kotlin/
│     │  └ com/example/game/
│     │     └ Main.kt
│     │
│     └ resources/
│        ├ textures/
│        ├ audio/
│        └ data/
```

This layout separates **source code** from **assets and data files**.

---

📌 **Diagram — Project Directory Layout**

```
<!-- DIAGRAM: project-directory-layout -->
```

---

# Recommended Folder Organization

As your game grows, you may organize your code like this:

```
src/main/kotlin/com/example/game
├ scenes
├ nodes
├ behaviors
├ systems
└ ui
```

Each folder has a specific purpose.

---

# Folder Responsibilities

| Folder      | Purpose                   |
| ----------- | ------------------------- |
| `scenes`    | reusable node hierarchies |
| `nodes`     | custom node types         |
| `behaviors` | gameplay logic            |
| `systems`   | tree systems              |
| `ui`        | user interface components |

This separation helps keep gameplay systems modular.

---

# Assets and Resources

Assets are stored in the `resources` directory.

Example:

```
resources/
├ textures
├ audio
├ shaders
└ data
```

Examples of resources include:

* images
* audio files
* configuration data
* shaders
* fonts

---

# Growing Your Project

As your project grows, you may split it into **multiple Gradle modules**.

Example:

```
my-game/
├ game-core
├ game-client
├ tools
└ build.gradle.kts
```

Benefits of modular projects:

* faster builds
* clearer separation of systems
* easier tooling and testing

---

# Keep It Simple

Early in development, avoid over-engineering your project layout.

Start simple:

```
src/main/kotlin
```

Add structure only as the project grows.

---

# Next Step

Now that your project is organized, it's time to understand the **core architecture of Canopy**.

Next recommended reading:

➡ **Node System**

The node system defines how scenes, entities, and gameplay structures are built.