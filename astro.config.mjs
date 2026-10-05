import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Sitio de usuario: se publica en la raíz, sin `base`.
export default defineConfig({
  site: 'https://caarlosfdz.github.io',
  integrations: [sitemap()],
});
