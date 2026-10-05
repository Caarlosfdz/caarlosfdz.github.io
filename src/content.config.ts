import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Añadir un proyecto = añadir un archivo .md en src/content/proyectos/.
const proyectos = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/proyectos' }),
  schema: z.object({
    orden: z.number(),
    titulo: z.string(),
    estado: z.enum(['publicado', 'proximamente']).default('publicado'),
    etiqueta: z.string().default(''),
    aviso: z.string().default(''),
    resumen: z.string().default(''),
    papel: z.string().default(''),
    url: z.string().default(''),
    reto: z.string().default(''),
    proceso: z.string().default(''),
    solucion: z.string().default(''),
    resultado: z.string().default(''),
  }),
});

export const collections = { proyectos };
