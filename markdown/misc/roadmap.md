# Roadmap

Current source version: **0.1.0-dev2**. The first stable 0.1.0 release
(First Flight) remains a planned milestone; there is no promised release date.
See [current snapshot notes](releases/0.1.0.md).

## Implemented foundation

Nodes, behaviors, tree systems, scene/screen managers, contexts, reactive state,
immutable 2D vectors, assets, parsers, registries and modular JSON saves exist.
Terminal and headless hosts are enabled. Shared lifecycle, fixed-step callbacks,
pause/resume and shutdown controls are present.

## Remaining prototype work

- Complete a playable terminal demo; the ecosystem demo is currently a scaffold.
- Stabilize lifecycle and ownership contracts, query APIs and cleanup behavior.
- Improve documentation, reference coverage and tooling.
- Profile representative scenes before implementing transform caches or pooling.

## Future direction

Restore and validate the currently excluded desktop platform, then develop
graphical rendering, sprites, UI, audio and physics integration. Terminal gameplay,
metrics and project generation also need agreed designs and implementations.
These items are proposals, not capabilities of the enabled build.

Track concrete priorities in the
[engine issue tracker](https://github.com/canopyengine/canopy/issues).
Dependency automation maintains a staging branch, while integration PRs to main
still require human review; it is not a release pipeline.
