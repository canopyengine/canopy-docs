# Canopy documentation

Documentation for **Canopy 0.1.0-dev2**, checked against engine main commit
`27019353589d8eb36adb04e387ca6749a0d5379f` on 2026-10-03.
This is a development snapshot; APIs can change before the first stable release.

- [Documentation index](markdown/index.md)
- [Installation](markdown/manuals/getting-started/installation.md)
- [First project](markdown/manuals/getting-started/first-project.md)
- [Architecture](markdown/engine-details/engine-architecture.md)
- [Contribution guidelines](markdown/contributing/contributing.md)
- [Current snapshot notes](markdown/misc/releases/0.1.0.md)
- [Roadmap](markdown/misc/roadmap.md)

The Markdown files in `markdown/` are the source of truth. The Astro/Starlight
site in `code/` generates its manual pages from those files at build time.
See [site development](code/README.md) for commands.

Enabled engine platforms are terminal and headless. Desktop is currently excluded
from the engine build; graphical and physics examples are future work.
The [ecosystem demo](https://github.com/canopyengine/canopy-demos) currently loads
configuration and builds placeholder nodes; its full simulation is planned.

## Checks and review

Run `node scripts/check-docs.mjs`, then `npm ci` and `npm run build` in `code/`.
CI requires documentation quality and site build checks. Changes to `main`
require a PR, one human approval, and squash merging. Agent contributions must
use the provenance conventions in the GitHub contribution guidelines.
