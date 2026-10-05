import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Astro deja en dist/_astro el PNG original de cada captura aunque la web solo use
// sus versiones WebP. Al terminar la compilación se borran los originales que ningún
// archivo publicado referencia, para no servir megas que nadie usa.
const quitarOriginalesSinUso = () => ({
  name: 'quitar-originales-sin-uso',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const raiz = fileURLToPath(dir);
      const recorrer = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? recorrer(join(d, e.name)) : [join(d, e.name)]));
      const archivos = recorrer(raiz);
      const texto = archivos.filter((f) => /\.(html|css|js|xml|json|txt|svg)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
      for (const f of archivos) {
        if (/\.(png|jpe?g)$/i.test(f) && f.includes('_astro') && !texto.includes(f.split('/').pop())) rmSync(f);
      }
    },
  },
});

// Sitio de usuario: se publica en la raíz, sin `base`.
export default defineConfig({
  site: 'https://caarlosfdz.github.io',
  integrations: [sitemap(), quitarOriginalesSinUso()],
  // El CSS es pequeño: va dentro del HTML para que no bloquee el primer pintado.
  build: { inlineStylesheets: 'always' },
});
