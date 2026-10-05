# caarlosfdz.github.io

Portfolio de Carlos Fernández: diseño web, logotipos e identidad y redes sociales para negocios de Cádiz.

Astro (estático) + CSS propio + GSAP/ScrollTrigger + Lenis. Se publicará en https://caarlosfdz.github.io.

> Estado: **fase 1** (sistema de diseño y hero). El brief completo está en `BRIEF.md`.

## Arrancar en local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist
npm run preview  # sirve /dist
```

## Dónde se toca cada cosa

| Quiero… | Archivo |
|---|---|
| Cambiar el color de acento | `src/styles/tokens.css` (variable `--accent`) |
| Rellenar email, WhatsApp e Instagram | `src/config/contacto.ts` |
| Cambiar textos del hero | `src/components/Hero.astro` |
| Añadir o editar un proyecto | un archivo `.md` en `src/content/proyectos/` |
| Sustituir el retrato | `src/assets/carlos-recorte.png` |

`assets-brutos/`, `referencias/` y `BRIEF.md` no se publican: Astro solo sirve `src/` y `public/`.

## Pendientes

- [ ] `email` en `src/config/contacto.ts`
- [ ] `whatsapp` en `src/config/contacto.ts` (botón principal de la web)
- [ ] `instagram` en `src/config/contacto.ts`
- [ ] Elegir el color de acento y borrar `AccentSwitcher.astro` (temporal de la fase 1)
- [ ] Textos marcados con `[REVISAR]` en `src/content/proyectos/`
