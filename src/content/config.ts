import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Keuken', 'Meubel']),
    image: z.string(),
    date: z.date(),
    order: z.number().optional(),
    render: z.string().optional(),
    description: z.string().optional(),
    details: z.array(z.string()).optional(),
    gallery: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { projects };
