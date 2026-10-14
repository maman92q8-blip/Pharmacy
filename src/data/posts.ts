import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('ar-KW-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 180));
