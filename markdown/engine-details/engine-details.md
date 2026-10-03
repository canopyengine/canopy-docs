# Engine overview

Canopy 0.1.0-dev2 is an experimental Kotlin/JVM engine centered on node trees,
composable behaviors, reactive values, and backend-independent services.
See [architecture](engine-architecture.md) for module boundaries.

## Available now

- Node hierarchy, paths, groups, behaviors and scene replacement.
- Immutable `Vector2` values and `Node2D` transforms.
- Typed managers, context providers, events, signals, computed values and effects.
- A shared application lifecycle, fixed-step physics dispatch, pause/resume and shutdown handles.
- Terminal hosting with queued keyboard input; a separate LibGDX headless host.
- Backend-neutral asset handles, JSON/TOML codecs, ID registries and modular saves.
- Structured logging, Gradle builds, ktlint, CodeQL and aggregate coverage reporting.

## Current limits

Desktop is excluded from `settings.gradle.kts`. Renderer, sprite, camera, UI,
collision and physics integration examples are not supported by the enabled
platforms. The physics lifecycle dispatches fixed-step callbacks; it does not
by itself supply a physics simulation. There is no supported `canopy new` CLI.
Trees, managers and reactive updates expect serialized lifecycle-thread access.

Use [installation](../manuals/getting-started/installation.md) for the current
toolchain and coordinates, and [snapshot notes](../misc/releases/0.1.0.md) for status.
