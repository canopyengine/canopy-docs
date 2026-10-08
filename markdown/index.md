<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Canopy 0.1.0-dev2 documentation

Welcome to **Canopy** — a place to grow a game from small, composable pieces.
Start with a node tree, give its branches behavior, and connect your world's
changing values through signals and contexts.

These manuals explain both the ideas and the APIs. Follow the first-project
path to build something, or explore a concept when you need a deeper answer.

Development snapshot documentation updated on 2026-10-06, including the dependency-scope refactor.
Desktop and proposed gameplay features are not part of the enabled build.

## Getting started

- [Getting started](manuals/getting-started/getting-started.md) — find your footing.
- [Installation](manuals/getting-started/installation.md) — prepare the tools.
- [First project](manuals/getting-started/first-project.md) — grow your first scene.

## Architecture

- [Engine architecture](engine-details/engine-architecture.md)
- [Engine overview](engine-details/engine-details.md)
- [Application runtime and screens](engine-details/runtime.md)
- [JVM headless host evaluation](engine-details/jvm-headless-evaluation.md)
- [Node state, lifecycle and scene dispatch](engine-details/nodes-and-scenes.md)
- [Dependency resolution](engine-details/dependencies.md)
- [Managers and injection design](engine-details/managers.md)
- [Contexts and reactive flow design](engine-details/flows.md)
- [Resources, serialization and persistence design](engine-details/resources-and-data.md)
- [Commands and input routing design](engine-details/commands-and-input.md)
- [Math and transforms](engine-details/math-and-transforms.md)
- [Platform boundaries and development tooling](engine-details/integration-and-tooling.md)
- [Logging](engine-details/log/logging.md)

## Manuals

- [Application lifecycle](manuals/concepts/app/application.md)
- [Screens](manuals/concepts/app/screens.md)
- [Command prompts](manuals/concepts/app/command-prompts.md)
- [Dependency lookups](manuals/concepts/core/dependencies.md)
- [Contexts](manuals/concepts/core/flows/contexts.md)
- [Events, signals, computed values and effects](manuals/concepts/core/flows/events-and-signals.md)
- [Managers and injection](manuals/concepts/core/managers/managers.md)
- [Manager overview](manuals/concepts/core/managers.md)
- [Behaviors](manuals/concepts/core/nodes/behaviors.md)
- [Nodes](manuals/concepts/core/nodes/nodes.md)
- [Scene manager](manuals/concepts/core/nodes/scene-manager.md)
- [Scenes](manuals/concepts/core/nodes/scenes.md)
- [Tree systems](manuals/concepts/core/nodes/tree-systems.md)
- [Assets and resources](manuals/concepts/data/assets-and-resources.md)
- [Content pipeline](manuals/concepts/data/content-pipeline.md)
- [Data systems](manuals/concepts/data/data.md)
- [ID registries](manuals/concepts/data/id-registry.md)
- [JSON](manuals/concepts/data/json.md)
- [Data overview](manuals/concepts/data/overview.md)
- [Parsing and serialization](manuals/concepts/data/parsing-and-serialization.md)
- [Saving and loading](manuals/concepts/data/saving-and-loading.md)
- [TOML](manuals/concepts/data/toml.md)

- [Input actions and events](manuals/concepts/input/input.md)
- [Vectors and transforms](manuals/concepts/math/vectors-and-transforms.md)
- [Application logging](manuals/concepts/logging/logging.md)

## Guides

- [Project structure](manuals/guides/project-structure.md)
- [Testing applications](manuals/guides/testing-applications.md)

## Contributing

- [Prefer clarity](contributing/code-style-guidelines.md)
- [Contributing to Canopy](contributing/contributing.md)
- [Documentation guidelines](contributing/documentation-guidelines.md)
- [GitHub guidelines](contributing/github-guidelines.md)
- [Logging Guidelines](contributing/logging-guidelines.md)
- [Project Guidelines](contributing/project-guidelines.md)
- [Testing Guidelines](contributing/testing-guidelines.md)

## Status and history

- [Project history](misc/articles/introduction.md)
- [0.1.0 development snapshot](misc/releases/0.1.0.md)
- [Releases](misc/releases/releases.md)
- [Roadmap](misc/roadmap.md)

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
