# Brief del portfolio de Carlos Fernández

Este documento es el encargo completo. Léelo entero antes de empezar.

## Rol

Eres un diseñador-desarrollador frontend senior especializado en portfolios con
mucho motion. Vas a construir mi portfolio personal desde cero en este repo y
dejarlo publicado en GitHub Pages.

## Antes de escribir código

1. Mira las capturas del portfolio de referencia que te pasé en esta
   conversación y todo lo que hay en `assets-brutos/`.
2. Usa la skill `frontend-design` (está en `.claude/skills/`).
3. Preséntame un plan corto: dirección visual (paleta, tipografías, concepto en
   tres líneas), mapa de secciones y lista de animaciones.
4. No construyas nada hasta que yo apruebe ese plan.

## Quién soy

- Carlos Fernández, estudiante de 2º de Grado Superior de Marketing y
  Publicidad, en Cádiz.
- Servicios: diseño web, logotipos e identidad, gestión de redes sociales.
- Cliente objetivo: negocios locales de la provincia de Cádiz (hostelería,
  salud y bienestar, belleza y estética).
- Objetivo de la web: que el dueño de un negocio la vea y me escriba.
- Idioma: español. Tono: cercano, directo, de tú, sin jerga de marketing.

## Contacto (pendiente)

Todavía no tengo cerrados los datos. Guárdalos todos en un único archivo de
configuración, fácil de editar, con estos campos vacíos:

- `email`
- `whatsapp` (botón principal de la web)
- `instagram`

Reglas mientras estén vacíos: no inventes ningún dato ni usuario, no enlaces a
cuentas que no sean mías, y oculta el botón o icono de cada campo sin rellenar.
El botón principal debe verse aunque el WhatsApp esté vacío, con un enlace
provisional a la sección de contacto. Apunta los tres campos en la lista de
pendientes del README.

## Referencia visual

Las capturas de referencia son un portfolio de Behance hecho con imágenes
estáticas, no una web. Quiero convertir ese lenguaje en una web real y animada.

Qué conservar:

- Hero con saludo, mi nombre en color de acento, retrato sobre un círculo de
  color, la palabra gigante "PORTFOLIO" detrás y pastillas flotantes con mis
  servicios alrededor del retrato.
- Alternancia de secciones oscuras y claras con una franja de acento.
- Tipografía display ancha y pesada, sans limpia para texto y manuscrita para
  anotaciones con flechas dibujadas a mano.
- Frases resaltadas tipo subrayador.
- Sección puente a pantalla completa ("¿Sigues ahí? Vamos a lo que importa").
- Proyectos numerados (01, 02, 03) con número gigante en outline y mockups de
  navegador y móvil.
- Fondos con formas fluidas tipo humo y degradados suaves.

Qué no copiar:

- Ni la paleta naranja ni las fuentes exactas: la identidad tiene que ser mía.
- Nada inventado: ni métricas, ni testimonios, ni logos de clientes, ni años de
  experiencia, ni barras de habilidades con nota. Solo datos de este brief.
- Nada de lorem ipsum: redacta el copy real con mis datos y marca con
  `[REVISAR]` lo que yo deba confirmar.

## Color de acento

Por defecto, lima eléctrico `#C6F135` sobre negro `#0B0B0C` y un claro cálido
`#ECE9E4`. Mi retrato es en blanco y negro, así que el acento es el único color
fuerte de la web.

En la fase 1 enséñame el hero en tres versiones para elegir: lima `#C6F135`,
azul cobalto `#2F4BFF` y bermellón `#FF4A1C`. Define el acento como un token
para que cambiarlo sea tocar una sola línea.

## Stack

- Astro (sitio estático) y CSS propio con variables, sin Tailwind.
- GSAP con ScrollTrigger para animaciones y Lenis para scroll suave.
- View Transitions de Astro para el paso entre páginas.
- Fuentes autoalojadas con Fontsource. Imágenes optimizadas con `astro:assets`
  (AVIF/WebP).
- Proyectos como content collection: añadir un proyecto nuevo es añadir un
  archivo, sin tocar componentes.

## Estructura

Home, una página con scroll:

1. Intro de carga breve (máximo 1,5 s, solo en la primera visita).
2. Hero.
3. Marquee infinito con servicios y tipos de trabajo.
4. Sobre mí: texto corto y retrato.
5. Sección puente.
6. Proyectos 01 a 03.
7. Servicios, cómo trabajo (3 o 4 pasos) y herramientas (solo iconos).
8. Formación y trayectoria (timeline breve).
9. Llamada final a contacto y footer.

Página propia por proyecto en `/proyectos/[slug]`: reto, proceso, solución y
resultado, galería, enlace en vivo si existe y "siguiente proyecto" al final.

## Proyectos

### 01 · Nernutri

Web real para una dietista con consulta 100% online.

- URL: https://nernutri.es
- Mi papel: diseño y desarrollo completos.
- Web multipágina: Inicio, Sobre mí, Consulta Online, Servicios, Cómo funciona,
  Testimonios y Contacto, más páginas legales.
- Home: hero con el lema "Come bien. Vive mejor.", marquee de especialidades,
  servicios, proceso en cinco pasos, testimonios y contacto.
- Toda la web lleva a reservar por WhatsApp con el mensaje ya escrito.
- Capturas: `assets-brutos/nernutri-*.png` (11 archivos).
- `[REVISAR]`: qué necesitaba ella y qué ha conseguido con la web.

### 02 · Tarjeta de socio IKEA (proyecto académico)

Trabajo de clase: landing de captación de un programa de fidelización, con
panel de administración. Es un ejercicio ficticio sin relación con IKEA, y eso
tiene que verse claro en la tarjeta del proyecto y en su página, con una
etiqueta "Proyecto académico" y una línea de aviso.

- Hecho con Google Apps Script y Google Sheets como base de datos.
- Landing: hero con tarjeta animada, ventajas, proceso en tres pasos, cuatro
  niveles, simulador de puntos, testimonios, formulario de alta con protección
  de datos y chat de asistente.
- Panel de administración: acceso con usuario, dashboard de altas, ajustes de
  marca y colores con vista previa de la tarjeta, gestión de beneficios,
  niveles, FAQ y testimonios, y listado de solicitudes con exportación a CSV.
- Enlace en vivo:
  https://script.google.com/a/macros/lassalinassf.es/s/AKfycbwVayPsFmNhJ5CnQ9nLZo05iMDrBLgUApIhMVFG4Do8lDUrqI30omeY0M81MZb_OGW5/exec
- Capturas: `assets-brutos/mueble-*.png` (13 archivos; 01 a 08 son la landing y
  09 a 13 el panel).

### 03 · Newsletter (pendiente)

Deja la tarjeta y su página como "Próximamente", bien diseñadas, con todos los
campos vacíos en su archivo de contenido para que yo los rellene sin tocar
componentes.

## Material en `assets-brutos/`

- `carlos-retrato.png`: mi retrato en blanco y negro sobre fondo gris liso.
  Quítale el fondo para usarlo recortado en el hero. Si no consigues un recorte
  limpio (pelo y orejas), dímelo y lo hago yo en Photoshop; mientras tanto,
  intégralo con el fondo tal cual.
- Las capturas de proyectos son de secciones sueltas y con anchos distintos.
  Úsalas dentro de mockups de navegador y móvil, recortadas si hace falta. No
  las estires ni las amplíes por encima de su tamaño real.

## Animaciones

- Scroll suave global con Lenis sincronizado con ScrollTrigger.
- Hero: titular que entra por líneas con máscara, "PORTFOLIO" con parallax,
  círculo que escala detrás del retrato y pastillas que flotan en bucle y
  reaccionan un poco al ratón.
- Marquee que acelera según la velocidad de scroll y se pausa al pasar el ratón.
- Sobre mí: el resaltado se pinta sobre las frases clave al hacer scroll.
- Sección puente fijada, con el texto revelándose palabra a palabra.
- Proyectos: tarjetas apiladas o scroll horizontal fijado, mockups con
  inclinación 3D, números con parallax y cursor personalizado "Ver proyecto".
- Flechas y anotaciones manuscritas en SVG que se dibujan al entrar en pantalla.
- Botones magnéticos y microinteracciones al pasar el ratón.
- Fondos fluidos con CSS (degradados y ruido), sin vídeos pesados.

Reglas de motion:

- Animar solo `transform` y `opacity`, a 60 fps.
- Respetar `prefers-reduced-motion`: versión sin movimiento y con todo el
  contenido visible.
- En móvil: sin secciones fijadas, sin cursor personalizado y con animaciones
  simplificadas.
- El scroll siempre lo controla el usuario.
- Ningún contenido puede depender de una animación para ser visible: si el
  JavaScript falla, la web se lee entera.

## Requisitos técnicos

- Mobile first, correcto de 360 px a 1920 px.
- Lighthouse en móvil: rendimiento 90 o más, accesibilidad 95 o más.
- HTML semántico, contraste AA, foco visible, navegable con teclado y textos
  alternativos reales.
- SEO: título y descripción por página, Open Graph con imagen, favicon, sitemap
  y página 404 con el mismo estilo.

## Despliegue

- Repo `Caarlosfdz/caarlosfdz.github.io`, que se publica en
  https://caarlosfdz.github.io (sitio de usuario, sin subcarpeta).
- Workflow de GitHub Actions que construya y publique en Pages en cada push a
  `main`.
- Cuando haga falta activar Pages con origen "GitHub Actions" en los ajustes
  del repo, dime exactamente dónde pulsar.
- Deja documentado en el README cómo pasar a un dominio propio.
- `assets-brutos/`, `referencias/` y este brief no deben publicarse en la web.

## Forma de trabajar

Por fases, parando al final de cada una para que yo revise:

- F1: estructura, sistema de diseño (tokens de color, tipografía y espaciado) y
  hero, con las tres versiones de color.
- F2: resto de la home.
- F3: páginas de proyecto.
- F4: responsive, rendimiento, accesibilidad y pulido de animaciones.
- F5: despliegue y comprobación en la URL pública.

En cada fase: levanta el servidor, comprueba el resultado en el navegador en
escritorio y en móvil, corrige lo que veas mal antes de enseñármelo, haz commit
y push a `main`, y enséñame capturas del resultado.

Explícame las cosas de forma corta y paso a paso, con una sola acción cada vez
cuando necesites que yo haga algo.

## Entregable

Web publicada y un README que explique cómo arrancar en local, cambiar textos,
añadir un proyecto, sustituir imágenes y rellenar los datos de contacto.
