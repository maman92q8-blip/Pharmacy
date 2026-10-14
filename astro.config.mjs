import { defineConfig } from 'astro/config';
import rehypeTidyImports from './src/lib/rehype-tidy-imports.mjs';

export default defineConfig({
  site: 'https://rxperiences.vercel.app',
  markdown: { gfm: true, rehypePlugins: [rehypeTidyImports] },
});
