import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
  integrations: [starlight({
    title: 'Canopy 0.1.0-dev2',
    social: [{ icon: 'github', label: 'Canopy', href: 'https://github.com/canopyengine/canopy' }],
    sidebar: [{ label: 'Documentation', autogenerate: { directory: 'manual' } }],
  })],
});
