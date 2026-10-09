# Canopy Documentation

<p align="center">
  <a href="https://github.com/canopyengine/canopy">
    <img src="/markdown/assets/canopy-logo-no-bg.png" width="350" alt="Canopy Engine logo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0--dev2-red.svg">
  <img src="https://img.shields.io/badge/license-CC--BY--SA--4.0-blue.svg">
  <img src="https://img.shields.io/badge/docs-status-active-brightgreen">
  <img src="https://img.shields.io/badge/engine-stage-experimental-orange">
</p>

This repository contains the **official documentation** for the **Canopy Engine**.

These pages prepare **0.1.0-alpha.1**, the proposed first Maven Central prerelease.
It is **not yet published**: use the pinned source/local installation path until
release validation and publication are approved. Core API work in
[engine PR #208](https://github.com/canopyengine/canopy/pull/208) and namespace
migration [#214](https://github.com/canopyengine/canopy/pull/214) are merged.
Maven coordinates use `io.github.canopyengine`; Kotlin package names are unchanged.
See [installation](markdown/manuals/getting-started/installation.md) for the
exact matching engine/compiler/plugin source revision.

The documentation explains:

* how to **build games using Canopy**
* how the engine’s **core architecture works**
* recommended **design patterns and workflows**
* internal **engine implementation details**
* how you can contribute to the engine

If you are looking for the engine itself, you can visit the main repository here:

**[Engine Repository](https://github.com/canopyengine/canopy)**

---

# Quick Links

| Resource                  | Link                                                                            |
|---------------------------|---------------------------------------------------------------------------------|
| 🚀 Getting Started        | [Start here](markdown/manuals/getting-started/getting-started.md)               |
| 🧠 Architecture Overview  | [Engine architecture](markdown/engine-details/engine-architecture.md)  |
| 🌲 Engine Repository      | [Canopy Engine](https://github.com/canopyengine/canopy)                         |
| 🗺 Project Roadmap        | [Canopy Engine Roadmap](markdown/misc/roadmap.md)                               |

---

# Start Here

If you are new to Canopy, begin with these pages:

➡ **[Getting Started](markdown/manuals/getting-started/getting-started.md)**
➡ **[Architecture Overview](markdown/engine-details/engine-architecture.md)**
➡ **[Node System](markdown/manuals/concepts/core/nodes/nodes.md)**

These pages introduce the fundamental concepts needed to build applications with the engine.

---

# Reading the Documentation

All documentation lives inside the **`markdown/` directory**.

The main entry point is:

➡ **[Documentation Index](markdown/index.md)**

The documentation is divided into several sections.

| Section            | Description                                                  |
|--------------------|--------------------------------------------------------------|
| **Manuals**        | Guides and concepts to get you started and create your games |
| **Engine Details** | Internal engine architecture                                 |
| **Contributing**   | Notes for contributors                                       |

---

# Contributing

Documentation contributions are welcome.

You can help improve the project by:

* fixing typos
* improving explanations
* adding examples
* expanding guides
* clarifying architecture

### Contribution workflow

1. Fork this repository
2. Create a branch for your changes
3. Commit your improvements
4. Open a pull request

Clear documentation helps make the engine **easier to learn and easier to adopt**.

You can read more about contributing to the engine on the [contributor notes](markdown/contributing/contributing.md) page.

---

# Documentation Website

The Astro/Starlight site in **`code/`** builds directly from the Markdown manuals.
The source pages, illustrations and conceptual explanations stay together in
`markdown/`; generated pages are not a second set of documents to maintain.

➡ **[Site development and build instructions](code/README.md)**

From the repository root, run `node scripts/check-docs.mjs`. From `code/`, run
`npm ci` and `npm run build`; the build checks generated links and anchors too.
CI runs **Documentation quality** and **Documentation build** on PRs.

Main changes require a PR, one approving review and squash merging, with the
same deletion/force-push restrictions and bypass settings as the engine.
Agent contributions follow the provenance rules in the contribution guidelines.

---

# Project Status

⚠️ **Canopy is currently in early development.**

The **terminal** and **headless** hosts are enabled. Desktop is currently
excluded from the engine build; graphical and physics integration examples
remain future work. The ecosystem demo currently loads configuration and builds
placeholder nodes, with gameplay still to come.

➡ **[Current snapshot notes](markdown/misc/releases/0.1.0.md)**

Both the engine and the documentation are evolving rapidly and may introduce **breaking changes between versions**.

You can follow development progress here:

➡ **[Project Roadmap](markdown/misc/roadmap.md)**

---

# License

The documentation is licensed under:

**Creative Commons Attribution–ShareAlike 4.0**

See [LICENSE](LICENSE) for details.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
