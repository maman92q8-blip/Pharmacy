import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import rehypeTidyImports from './src/lib/rehype-tidy-imports.mjs';

export default defineConfig({
  site: 'https://rxperiences.vercel.app',
  // pages stay static; only /api/capsy (the assistant) runs as a server function
  adapter: vercel(),
  markdown: { gfm: true, rehypePlugins: [rehypeTidyImports] },
});
