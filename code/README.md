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
