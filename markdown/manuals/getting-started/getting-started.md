<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Getting started

Welcome to **Canopy** 🌲

The first step is a small running application. From there, build a node tree,
attach a behavior and watch values change over time. These guides walk through
the pieces in that order, using the platforms that are enabled today.

---

# Working with the Current API

Canopy **0.1.0-dev2** currently supports terminal and headless hosts. Start with
[installation](installation.md), then [a complete first project](first-project.md).

## The runtime model

1. A platform constructs an `App` and drives its shared `EngineLoop`.
2. Managers supply scene, screen, injection and platform services.
3. A screen's `onEnter()` can install a node tree through `asSceneRoot()`.
4. Nodes compose hierarchy; behaviors implement local callbacks.
5. Tree systems process matching nodes before or after frame/physics traversal.

Signals hold values read as `state()` and changed with `state.update { ... }`.
`Vector2` is immutable: assign the result of arithmetic back to node transforms.

Next read [nodes](../concepts/core/nodes/nodes.md),
[behaviors](../concepts/core/nodes/behaviors.md),
[screens](../concepts/app/screens.md), and [project structure](../guides/project-structure.md).
Graphical desktop examples and the proposed ecosystem gameplay remain future work.


---

## Keep Exploring

➡ **[Documentation Index](/markdown/index.md)** — choose the next concept or guide.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
