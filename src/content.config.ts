import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
    experience: z.boolean().default(false),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const policies = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/content/policies' }),
  schema: z.object({
    title: z.string(),
    title_en: z.string().optional(),
    category: z.enum(['laws', 'licensing', 'pharmacies', 'medicines', 'official']),
    year: z.number().optional(),
    number: z.string().optional(),
    date: z.coerce.date().optional(),
    summary: z.string().optional(),
    url: z.string().url(),
    source: z.string().optional(),
  }),
});

export const collections = { posts, policies };
