import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPosts() {
  const posts = await getCollection('posts', (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('ar-KW-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' });

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 180));

/** Reading time in correct Arabic: "قراءة في دقيقة" / "دقيقتين" / "3 دقائق" / "12 دقيقة" */
export const readingLabel = (body = '') => {
  const n = readingTime(body);
  if (n === 1) return 'قراءة في دقيقة';
  if (n === 2) return 'قراءة في دقيقتين';
  if (n <= 10) return `قراءة في ${n} دقائق`;
  return `قراءة في ${n} دقيقة`;
};

/** First known category of a post (used for its colour band) */
export const mainCategory = (post: Post, known: Record<string, unknown>) =>
  post.data.categories.find((c) => c in known);

/** "مقال واحد" / "مقالان" / "3 مقالات" / "12 مقالاً" */
export const articlesLabel = (n: number) =>
  n === 1 ? 'مقال واحد' : n === 2 ? 'مقالان' : n >= 3 && n <= 10 ? `${n} مقالات` : `${n} مقالاً`;
