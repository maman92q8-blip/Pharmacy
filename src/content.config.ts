import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

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

const resources = defineCollection({
  loader: file('src/data/resources.yaml'),
  schema: z.object({
    section: z.enum(['courses', 'youtube', 'references', 'apps']),
    name: z.string(),
    desc: z.string().optional(),
    url: z.string().url(),
    free: z.boolean().default(true),
  }),
});

const library = defineCollection({
  loader: file('src/data/library.yaml'),
  schema: z.object({
    region: z.enum(['kuwait', 'gcc']),
    country: z.string(),
    title: z.string(),
    authors: z.string().optional(),
    journal: z.string().optional(),
    year: z.number().optional(),
    topic: z.string().optional(),
    summary: z.string().optional(),
    url: z.string().url(),
  }),
});

export const collections = { posts, policies, resources, library };
