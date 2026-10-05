import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Añadir un proyecto = añadir un archivo .md en src/content/proyectos/.
// Las imágenes se indican con rutas relativas a src/assets (ver nernutri.md).
const proyectos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      orden: z.number(),
      titulo: z.string(),
      estado: z.enum(['publicado', 'proximamente']).default('publicado'),
      etiqueta: z.string().default(''),
      aviso: z.string().default(''),
      resumen: z.string().default(''),
      papel: z.string().default(''),
      url: z.string().default(''),
      barra: z.string().default(''), // texto de la barra del navegador del mockup
      reto: z.string().default(''),
      proceso: z.string().default(''),
      solucion: z.string().default(''),
      solucionLista: z.array(z.object({ titulo: z.string(), items: z.array(z.string()) })).default([]),
      resultado: z.string().default(''),
      portada: image().optional(),
      segunda: image().optional(),
      tercera: image().optional(),
      movil: image().optional(),
      galeria: z.array(z.object({ imagen: image(), alt: z.string(), pie: z.string().default('') })).default([]),
    }),
});

export const collections = { proyectos };
