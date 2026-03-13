<p style="display: flex; align-items: center; gap: 12px;">
<a href="index.md">
<img src="assets/canopy-icon.png" width="56" alt="Canopy Engine logo">
</a>
</p>

# Canopy Engine Documentation

**Canopy Engine** is a **2D game engine written in Kotlin**, built around a **node-based architecture**, **modular gameplay logic**, and **reactive systems**.

These docs will help you:

* build games using **Canopy**
* understand the engine’s **core architecture**
* learn recommended **design patterns**
* explore the engine’s **internal systems**

---

# A Quick Taste of Canopy

Canopy applications are configured through a **Kotlin DSL**.

```kotlin
fun main() = desktopApp {

    screens {
        start(GameScreen())
    }

}.launch()
```

Scenes are built from **nodes arranged in a tree**.

```kotlin
EmptyNode("root") {

    Player()

    Enemy()

    UI()

}.asSceneRoot()
```

The core mental model of the engine is:

```text
Application
   ↓
Screens
   ↓
Scenes
   ↓
Nodes
   ↓
Behaviors
   ↓
Tree Systems
```

This layered structure helps keep gameplay code **modular and scalable**.

---

# Start Here

If you are new to Canopy, follow this recommended path:

1. **[Getting Started](manuals/getting-started/getting-started.md)**
2. **[Architecture Overview](manuals/core/architecture-overview.md)**
3. **[Node System](manuals/core/node-system.md)**

This path introduces the fundamental concepts needed to structure a Canopy project.

---

# Documentation Sections

The documentation is divided into several sections, each serving a different purpose.

---

## Getting Started

The **Getting Started** section introduces the basics of using Canopy.

It covers:

* installing the engine
* launching your first application
* configuring the app builder
* creating your first scene

➡ **[Go to Getting Started](manuals/getting-started/getting-started.md)**

---

## Manuals

The **Manuals** contain the primary engine documentation.

These pages describe the systems used to build games, including:

* engine architecture
* nodes and scenes
* behaviors and tree systems
* events, signals, and contexts
* data handling and content pipelines

This is the section you will use most often when developing with Canopy.

---

## Guides

The **Guides** provide practical advice and workflows for building games with Canopy.

Examples include:

* structuring a game project
* building gameplay systems
* working with data-driven content
* implementing save systems

Guides focus on **real-world usage patterns** rather than individual engine features.

---

## Engine Details

The **Engine Details** section documents the **internal architecture of the engine**.

These pages are mainly intended for:

* engine contributors
* developers exploring internal design decisions
* users debugging advanced engine behavior

If you are simply building a game, you usually **do not need to read this section**.

---

# Recommended Reading Paths

Different readers may want to explore the documentation in different ways.

---

### For new users

```text
Getting Started
   ↓
Architecture Overview
   ↓
Node System
   ↓
Scenes
```

This path introduces the **core runtime architecture**.

---

### For gameplay programming

```text
Node System
   ↓
Behaviors
   ↓
Tree Systems
   ↓
Events & Signals
   ↓
Contexts
```

This path focuses on **gameplay logic and runtime systems**.

---

### For data-driven games

```text
Content Pipeline
   ↓
Assets Manager
   ↓
Parsing and Serialization
   ↓
ID Registry
   ↓
Saving and Loading
```

This path explains **how game data flows through the engine**.

---

# About the Documentation

> [!WARNING]
> **Canopy is under active development.**
> Both the engine and the documentation may change and may introduce breaking changes.

The documentation is licensed under the
[**Creative Commons Attribution-ShareAlike 4.0 International License**](https://creativecommons.org/licenses/by-sa/4.0/).

---

Have fun building with Canopy.
— **The Canopy Team**