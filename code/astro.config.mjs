import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
export default defineConfig({
  integrations: [
    starlight({
      title: "Canopy learn",
      logo: { src: "../markdown/assets/canopy-icon.png" },
      customCss: ["./src/styles/site.css"],
      components: {
        ThemeProvider: "./src/components/site/ThemeProvider.astro",
        ThemeSelect: "./src/components/site/ThemeSelect.astro",
      },
      social: [
        {
          icon: "github",
          label: "Canopy",
          href: "https://github.com/canopyengine/canopy",
        },
      ],
      sidebar: [
        {
          label: "First steps",
          items: [
            {
              label: "Get comfortable",
              slug: "manual/manuals/getting-started/getting-started",
            },
            {
              label: "Prepare your tools",
              slug: "manual/manuals/getting-started/installation",
            },
            { label: "Build a small world", slug: "learn/build-a-small-world" },
            {
              label: "Run your first project",
              slug: "manual/manuals/getting-started/first-project",
            },
            {
              label: "Understand the pieces",
              slug: "manual/manuals/guides/understanding-canopy",
            },
          ],
        },
        {
          label: "Guides",
          autogenerate: { directory: "manual/manuals/guides" },
          collapsed: true,
        },
        {
          label: "Reference",
          autogenerate: { directory: "manual/manuals/concepts" },
          collapsed: true,
        },
        {
          label: "Inside the engine",
          autogenerate: { directory: "manual/engine-details" },
          collapsed: true,
        },
        {
          label: "For maintainers",
          autogenerate: { directory: "manual/contributing" },
          collapsed: true,
        },
        {
          label: "Releases and plans",
          autogenerate: { directory: "manual/misc" },
          collapsed: true,
        },
        { label: "Documentation index", slug: "manual/index" },
      ],
    }),
  ],
});
