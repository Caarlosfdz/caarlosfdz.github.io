# caarlosfdz.github.io

Portfolio de Carlos Fernández: diseño web, logotipos e identidad y redes sociales para negocios de Cádiz y alrededores.

Astro (estático) + CSS propio + GSAP/ScrollTrigger + Lenis. Se publicará en https://caarlosfdz.github.io.

> Estado: **fase 3** (home y páginas de proyecto). El brief completo está en `BRIEF.md`.

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
| Añadir o editar un proyecto | un archivo `.md` en `src/content/proyectos/` (ver abajo) |
| Sustituir el retrato | `src/assets/carlos-recorte.png` |

`assets-brutos/`, `referencias/` y `BRIEF.md` no se publican: Astro solo sirve `src/` y `public/`.

## Pendientes

- [ ] `email` en `src/config/contacto.ts`
- [ ] `whatsapp` en `src/config/contacto.ts` (botón principal de la web)
- [ ] `instagram` en `src/config/contacto.ts`
- [ ] Textos marcados con `[REVISAR]` en `src/content/proyectos/`

## Añadir un proyecto

1. Copia las capturas a `src/assets/proyectos/`.
2. Duplica `src/content/proyectos/nernutri.md`, cámbiale el nombre (será la URL: `/proyectos/nombre/`) y rellena los campos.
3. En `portada`, `segunda`, `tercera`, `movil` y `galeria` usa rutas como `../../assets/proyectos/mi-captura.png`.
4. `orden` decide la posición y el número gigante (01, 02, 03…). Con `estado: proximamente` se enseña como "Próximamente".

No hay que tocar ningún componente: la home y la página del proyecto se generan solas.
