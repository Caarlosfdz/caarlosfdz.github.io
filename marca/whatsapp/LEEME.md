# Banner de WhatsApp Business

Portada del perfil (1600 × 900 px). Esta carpeta no se publica con la web: Astro solo publica `src/` y `public/`.

- `banner-whatsapp-a.jpg`, `-b.jpg`, `-c.jpg`: las tres variantes listas para subir.
- `simulacion/`: cómo queda cada una con la foto de perfil encima. Solo sirven para revisar, no se suben. La A está ajustada a WhatsApp de PC (`a-pc-500.jpg`: solo se ve hasta 500 px y la foto es un círculo de 300 px) y `a-entero.jpg` muestra el banner completo; B y C siguen con las medidas anteriores (16:9 y franja 2,3:1).
- `banner.html`: el diseño. Usa los tokens, fuentes, humo, grano y retrato de la web. Ábrelo con `?v=a|b|c`; añade `&sim=1` para ver la foto encima y `&guias=1` para ver las zonas seguras.
- `generar.mjs`: vuelve a sacar los JPG (`node marca/whatsapp/generar.mjs`, necesita `playwright-core`).
