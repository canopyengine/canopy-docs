<p style="display: flex; align-items: center; gap: 10px;">
  <a href="/markdown/index.md">
    <img src="/markdown/assets/canopy-icon.png" width="50" alt="Canopy Engine logo">
  </a>
</p>

# Roadmap

Current source version: **0.1.0-dev2**. The first stable 0.1.0 release
(First Flight) remains a planned milestone; there is no promised release date.
See [current snapshot notes](releases/0.1.0.md).

## Implemented in merged main

[Engine PR #208](https://github.com/canopyengine/canopy/pull/208) combines the
housekeeping and minimum UI work and merged on 2026-10-08. These APIs are in `main`,
but stable 0.1.0 publication and demo validation remain release gates.

Nodes, behaviors, node-type-matching tree systems, scene/screen managers,
contexts, reactive state, immutable 2D vectors, assets, parsers, registries and
modular JSON saves exist. Terminal and headless hosts are enabled. Shared lifecycle,
fixed-step callbacks, explicit pause/resume and shutdown controls are present.

Housekeeping validates lifetime, ownership, callback mutation, cleanup and query
contracts. The compiler supplies guarded ordinary Node property storage and
synchronous construction rollback. Minimum platform-independent declarative UI
supplies layouts, text, actions/buttons, reactive expressions, keyed content and
focus. The terminal backend paints these elements and a live bottom command
overlay, adapting to terminal geometry changes.

## Remaining 0.1.0 release work

The agreed release goal is a terminal-ready engine with validated core systems
and **minimum declarative UI**, not the complete future UI framework.

- Merge and validate the consolidated engine and documentation revisions.
- Complete the command-driven ecosystem demo. Its existing code is a scaffold,
  not a playable simulation. Use rabbits and foxes on a small seeded grid, with
  simple needs, basic cover/detection, fleeing/hunting, bounded readable events,
  day/night and clear/rain. Manual environment commands change the current state;
  the seeded natural cycle then continues.
- Represent a day as nine phases: dawn, early morning, late morning, midday,
  afternoon, dusk, early night, midnight and late night. Phases 1–6 are day;
  phases 7–9 are night. Real-time pacing is configured separately.
- Demonstrate responsive layouts, command focus, resizing, pause/resume and clean
  shutdown together. Opening the command overlay keeps simulation running;
  pause-on-open is an optional demo/player configuration, not engine default behavior.
- Validate immutable-version publication and installation in a fresh external
  consumer with matching engine/compiler/plugin artifacts.
- Finish release notes, supported-limit documentation and runnable extension examples.
- Decide whether a simple CLI belongs in 0.1.0; no project generator is implemented.

Feature freeze follows validation of those workflows. Fix demo-blocking gaps
with the smallest necessary change; broader features do not gate this release.

## Future direction

Restore and validate the excluded desktop platform, then develop graphical
rendering, sprites, audio and physics integration. A full UI widget suite and
additional UI backends extend the existing shared layout/component contracts.
Advanced metrics and project generation also require agreed designs and
implementations. Profile representative scenes before adding transform caches
or pooling. These are future capabilities, not guarantees of the enabled build.

Track concrete priorities in the
[engine issue tracker](https://github.com/canopyengine/canopy/issues).
Dependency automation maintains a staging branch, while integration PRs to main
still require human review; it is not a release pipeline.

---

<p align="center">
  Canopy Engine Documentation • 2026
</p>
