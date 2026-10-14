# Learning-site design draft

`/design/` compares three dark directions using the same teaching page:

- Forest: green surfaces, leaf-green controls, bird-yellow highlights.
- Lantern: warm wood-toned surfaces and orange controls, with a rounded reading panel.
- Ink + Forest (selected): charcoal surfaces and restrained green/yellow accents,
  with Forest’s learning-path sidebar, reading column and on-page navigation.

The accents come from the original Canopy logo: leaf `#a2c700`, wood `#fd9500`,
bird `#ffe200`. Backgrounds and readable text are derived neutral shades.
Nunito is self-hosted with its Open Font License in `public/fonts`.

The selected direction is Ink’s colors with Forest’s layout. It now applies to
the Starlight manual as well as the default preview. `ink-palette.css` shares the
logo colors and self-hosted font; `site.css` adapts Starlight’s supported tokens
and styles without replacing its search, sidebar or mobile-menu behavior.
Two small theme overrides select the single dark palette before first paint
and remove the unused light/auto picker.

The manual’s canonical authoring source stays in `markdown/`. Site-only visual
lessons live in `src/content/docs/learn/` as MDX and import the same learning
components as the draft. This is a site foundation, not a completed onboarding
course. No manual rewriting or human writing sign-off is implied.

## Learning blocks

`NodePlayground.astro` illustrates composition with a bounded fish count, a
matching tree and Kotlin fragment, reset controls and a skippable question.
`FrameWalkthrough.astro` walks through a frame manually, with reset and exact
runtime references. Both are browser teaching models, not engine execution.
They use native controls and local state, with no scores, timers, account,
tracking or required completion.

Explain one idea at a time for a reader with basic Kotlin/game knowledge.
Introduce a familiar comparison, state where it stops applying, show code and
an observable result, then link to precise references. Keep implementation
contracts in optional deeper sections. The page's first-project instructions
are a fragment; installing/running the engine still uses the linked guide.

## Review locally or export

From `code/`, build and preview with the normal commands. Open `/design/`.
The selected theme is reflected in `?theme=forest`, `lantern` or `ink`.

After building, export an offline draft:

```sh
node scripts/export-design.mjs /path/to/canopy-learning-draft.html
```

The exported HTML includes its CSS, font, logo, license and learning scripts.
It rewrites manual references to GitHub and omits Astro's online prefetch helper.
It can be opened as a local file; it does not execute Kotlin or the engine.

Source/link checks, the site build and `npm run test:browser` are the repository
checks. Browser checks exercise theme switching, add/remove/reset boundaries,
question/explanation feedback, frame order/reset, keyboard focus, reduced motion
and mobile overflow. The first review was captured at 1440px and 390px widths.
No deployment or domain has been selected.

## First draft validation

The review uses a clean npm install, a 63-page build and generated link/anchor
checks, followed by browser checks. All three themes are checked for horizontal
overflow at 320px and 390px. Native buttons support keyboard activation; the
skip link, optional question and frame reset are exercised. Core text/control
color pairs exceed 4.5:1; this is not a complete accessibility audit. The exported
page is served locally and then checked with browser networking disabled. The
cloud browser prohibits file-URL navigation, so this does not claim a physical
phone or local-file browser test.

The integrated lesson is `/learn/build-a-small-world/`. Navigation separates
first steps, guides, reference, engine internals, maintainer material and release
plans. The existing index and search retain access to every manual page.
Browser checks cover five representative reading routes at 320px, 390px and
1440px, search results, mobile-menu open/Escape and integrated lesson controls.

Remaining work: enrich the beginner path in reviewed batches, add a small set
of optional user/maintainer exercises, and build the
completed aquarium before extracting its starter/tutorial. Real browser-hosted
Kotlin execution, a public deployment/domain and a completed ecosystem are not
implemented by this draft.
