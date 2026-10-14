# Canopy documentation site

Astro/Starlight presentation of the Canopy documentation. Published installation
guides currently target **0.1.0-alpha.1**; foundation-integration pages identify
**0.1.0-alpha.2** source/local artifacts explicitly. Stable 0.1.0 is planned.
Edit `../markdown/`, then build; generated pages are ignored by Git.

## Development

Use Node.js 22 and the checked-in npm lockfile. From this directory:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`dev` and `build` first run `scripts/sync-docs.mjs`. It copies Markdown into the
manual collection, adds page titles, rewrites document links to site routes, and
copies illustrations. The build then checks generated links and anchors.
No deployment is configured by these commands.

From the repository root, run `node scripts/check-docs.mjs` for source links,
empty documents, and obsolete engine API examples. CI runs both this check and
the site build on PRs and pushes to main.

## Learning-site design review

The first review page is `/design/`, with Forest, Lantern and Ink variants from
the original Canopy logo palette. It includes a visual node tree, an optional
question and a step-by-step frame model. These are browser illustrations, not
Kotlin or engine execution. The whole manual's theme remains unchanged until
the visual direction is selected. See [draft notes](docs/learning-site-draft.md).

After building, run the browser checks:

```sh
npx playwright-core install chromium
npm run test:browser
```

Linux machines that need browser libraries can use `install --with-deps chromium`.
To use an existing Chromium binary, set `CANOPY_CHROMIUM` to its absolute path.
Checks cover interactive controls, bounded/reset states, optional questions,
frame order, keyboard focus, mobile overflow and the exported offline page.
Screenshots and a check report go into `dist/draft-review/`, or the directory
selected by `CANOPY_DRAFT_OUTPUT`. Playwright Core is a development dependency;
the learning page ships no browser-automation or UI framework runtime.

Export a single-file draft after building:

```sh
node scripts/export-design.mjs /path/to/canopy-learning-draft.html
```

It embeds the font, logo, styles and scripts and can be opened locally.
No public deployment is performed by these commands.
