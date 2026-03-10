<p style="display: flex; align-items: center; gap: 12px;">
  <a href="index.md">
    <img src="assets/canopy-icon.png" width="56" alt="Canopy Engine logo">
  </a>
</p>

# Canopy Engine Documentation

**Canopy Engine** is a **2D game engine written in Kotlin**, built around a **node-based architecture**, **modular gameplay logic**, and **reactive systems**.

These docs will help you:

- build games with **Canopy**
- understand the engine’s **core architecture**
- learn recommended **patterns and workflows**
- explore the engine’s **internal systems**

---

## Start Here

If you are new to Canopy, follow this path:

1. [Getting Started](getting-started/getting-started.md)  
2. [Architecture Overview](/manuals/core/architecture-overview/)  
3. [Node System](/manuals/core/node-system/)  

This path gives you the fastest introduction to how Canopy applications are structured.

---

## A Quick Taste of Canopy

Canopy applications are configured through a Kotlin DSL.

```kotlin
fun main() = desktopApp {

    screens {
        start(GameScreen())
    }

}.launch()
````

Scenes are built from nodes arranged in a tree:

```kotlin
EmptyNode("root") {

    Player()

    Enemy()

    UI()

}.asSceneRoot()
```

This is the core mental model of the engine:

```text
App → Screen → Scene → Nodes → Behaviors → Systems
```

---

## Documentation Sections

### Getting Started

The **Getting Started** section is the best place to begin.

It covers:

* installing and setting up Canopy
* launching your first application
* configuring the app builder
* creating your first scene

➡ [Go to Getting Started](getting-started/getting-started.md)

---

### Manuals

The **Manuals** contain the main engine documentation.

This section covers the systems you will use to build games, including:

* architecture overview
* nodes and scenes
* behaviors and tree systems
* events, signals, and contexts
* data handling, parsing, and saving

This is the main reference for day-to-day Canopy development.

---

### Engine Details

The **Engine Details** section focuses on the internals of Canopy.

This section is useful if you want to:

* contribute to the engine
* understand internal architecture decisions
* explore implementation details

---

## Recommended Reading Paths

### For new users

```text
Getting Started
   ↓
Configuring Your App
   ↓
Screens
   ↓
Architecture Overview
   ↓
Node System
```

### For gameplay programming

```text
Node System
   ↓
Behaviors
   ↓
Events & Signals
   ↓
Contexts
   ↓
Common Patterns
```

### For data-driven games

```text
Handling Data
   ↓
Assets Manager
   ↓
Parsing Data
   ↓
IdRegistry
   ↓
Saving Data
   ↓
Content Pipeline
```

---

## About the Documentation

> [!WARNING]
> **Canopy is under active development.**
> Both the engine and the documentation may change and may introduce breaking changes.

The documentation is licensed under the
[**Creative Commons Attribution-ShareAlike 4.0 International License**](https://creativecommons.org/licenses/by-sa/4.0/).

---

Have fun building with Canopy.
— **The Canopy Team**
