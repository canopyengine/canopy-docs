import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(site, "dist");
const target = path.resolve(
  process.argv[2] || path.join(dist, "canopy-learning-draft.html"),
);
const data = (file, mime) =>
  `data:${mime};base64,${fs.readFileSync(path.join(dist, file)).toString("base64")}`;
let html = fs.readFileSync(path.join(dist, "design/index.html"), "utf8");
html = html.replace(
  /<link rel="stylesheet" href="([^"]+)"[^>]*>/g,
  (_, href) => {
    const css = fs
      .readFileSync(path.join(dist, href), "utf8")
      .replace(
        /url\(["']?\/fonts\/nunito-latin\.woff2["']?\)/g,
        `url("${data("fonts/nunito-latin.woff2", "font/woff2")}")`,
      );
    return `<style>${css}</style>`;
  },
);
// Astro's link-prefetch helper is unnecessary in a downloadable, single-page draft.
html = html.replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/g, "");
html = html.replace(/<link rel="preload"[^>]*>/g, "");
html = html.replace(
  'src="/markdown/assets/canopy-icon.png"',
  `src="${data("markdown/assets/canopy-icon.png", "image/png")}"`,
);
html = html.replaceAll(
  'href="/fonts/Nunito-LICENSE.txt"',
  'href="https://github.com/canopyengine/canopy-docs/blob/codex/agent/docs/foundation-integration/code/public/fonts/Nunito-LICENSE.txt"',
);
html = html.replace(/href="\/manual\/([^"]*)"/g, (_, value) => {
  const [route, anchor] = value.split("#");
  const source = route.replace(/\/$/, "") || "index";
  return `href="https://github.com/canopyengine/canopy-docs/blob/codex/agent/docs/foundation-integration/markdown/${source}.md${anchor ? "#" + anchor : ""}"`;
});
html = html.replaceAll(
  'href="/"',
  'href="https://github.com/canopyengine/canopy-docs"',
);
const license = fs.readFileSync(
  path.join(dist, "fonts/Nunito-LICENSE.txt"),
  "utf8",
);
const escapedLicense = license
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");
html = html.replace(
  "</head>",
  `<template id="bundled-font-license">${escapedLicense}</template></head>`,
);

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, html);
console.log(`Exported self-contained draft: ${target}`);
