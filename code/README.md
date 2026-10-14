# Canopy documentation site

Astro/Starlight presentation of the Canopy documentation. Published installation
guides currently target **0.1.0-alpha.1**; foundation-integration pages identify
**0.1.0-alpha.2** source/local artifacts explicitly. Stable 0.1.0 is planned.
Edit `../markdown/`, then build; generated pages are ignored by Git.

## Development

Use Node.js 22 and the checked-in npm lockfile. Astro, Starlight and MDX are
pinned to the tested compatible versions; use `npm ci` after pulling updates. From this directory:

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

## Learning-site design

The first review page is `/design/`, with Forest, Lantern and Ink variants from
the original Canopy logo palette. It includes a visual node tree, an optional
question and a step-by-step frame model. These are browser illustrations, not
Kotlin or engine execution. The selected Ink colors and Forest layout now apply
to the Starlight manual, with Nunito, a first-steps sidebar and on-page headings.
The site uses one dark theme; its font and assets are served locally.
See [design notes](docs/learning-site-draft.md).

The integrated visual lesson lives at `/learn/build-a-small-world/`. Site-only
interactive lessons are authored as MDX in `src/content/docs/learn/`; the existing
manual stays canonical in `../markdown/`. Do not edit the generated manual copy.

After building, run the browser checks:

```sh
npx playwright-core install chromium
npm run test:browser
```

Linux machines that need browser libraries can use `install --with-deps chromium`.
To use an existing Chromium binary, set `CANOPY_CHROMIUM` to its absolute path.
Checks cover interactive controls, bounded/reset states, optional questions,
frame order, keyboard focus, mobile overflow and the exported offline page.
They also check the homepage, user guide, runtime reference and maintainer guide
at 320px, 390px and 1440px, plus site search and the mobile navigation.
Screenshots and a check report go into `dist/draft-review/`, or the directory
selected by `CANOPY_DRAFT_OUTPUT`. Playwright Core is a development dependency;
the learning page ships no browser-automation or UI framework runtime.

Export a single-file draft after building:

```sh
node scripts/export-design.mjs /path/to/canopy-learning-draft.html
```

It embeds the font, logo, styles and scripts and can be opened locally.
No public deployment is performed by these commands.

## Incompatible local packages

If startup reports that `astro/jsx/rehype.js` is not exported, your installed
Astro and MDX versions do not match. Pull the integration branch, then run
`npm ci` from `code/` and retry `npm run dev`. `npm ci` replaces `node_modules`
using the committed lockfile. Do not delete or regenerate the lockfile to fix
this error.
