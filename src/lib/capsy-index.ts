// Everything Capsy is allowed to talk about, built from the site's own content.
// Each item gets a short id (e.g. "post:pharmd-in-america") so the AI can only point to things that exist.
import { getCollection } from 'astro:content';
import { categories, policyCategories } from '../data/site';
import { getPosts, formatDate } from '../data/posts';

export interface Item {
  id: string;
  kind: 'post' | 'study' | 'policy' | 'resource';
  title: string;
  href: string;          // where the link goes
  external: boolean;
  text: string;          // what Capsy knows about it
  summary?: string;      // the summary written on the site (studies, policies)
}

// Markdown -> plain text (no images, no html, links keep their words)
const plain = (md = '') => md
  .replace(/<[^>]+>/g, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/[*_#>`|]/g, ' ')
  .replace(/ /g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

let cache: Item[] | null = null;

export async function getIndex(): Promise<Item[]> {
  if (cache) return cache;
  const items: Item[] = [];

  for (const p of await getPosts()) {
    const cats = p.data.categories.map((c) => categories[c]?.name).filter(Boolean).join('، ');
    items.push({
      id: `post:${p.id}`, kind: 'post', title: p.data.title, href: `/posts/${p.id}`, external: false,
      text: `${cats}. ${formatDate(p.data.date)}. ${plain(p.body).slice(0, 1400)}`,
    });
  }
  for (const s of await getCollection('library')) {
    const d = s.data;
    items.push({
      id: `study:${s.id}`, kind: 'study', title: d.title, href: d.url, external: true,
      text: [d.country, d.topic, d.journal, d.year, d.authors].filter(Boolean).join(' | '),
      summary: d.summary,
    });
  }
  for (const p of await getCollection('policies')) {
    const d = p.data;
    items.push({
      id: `policy:${p.id}`, kind: 'policy', title: d.title, href: d.url, external: true,
      text: [policyCategories[d.category], d.number && `رقم ${d.number}`, d.title_en, d.year].filter(Boolean).join(' | '),
      summary: d.summary,
    });
  }
  for (const r of await getCollection('resources')) {
    const d = r.data;
    items.push({
      id: `resource:${r.id}`, kind: 'resource', title: d.name, href: d.url, external: true,
      text: `${d.desc ?? ''} ${d.free ? 'مجاني' : 'مدفوع جزئياً'}`,
    });
  }
  cache = items;
  return items;
}

/** The catalogue as text for the AI's instructions. */
export function catalogue(items: Item[]) {
  const label = { post: 'مقال/تجربة', study: 'دراسة', policy: 'قرار/قانون', resource: 'مرجع' };
  return items.map((it) =>
    `[${it.id}] (${label[it.kind]}) ${it.title}\n${it.text}${it.summary ? `\nملخص الموقع: ${it.summary}` : ''}`
  ).join('\n\n');
}

// ---------- Simple search, used when no AI key is set or the AI is unavailable ----------
const norm = (s: string) => s.toLowerCase()
  .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[ًٌٍَُِّْـ]/g, '');

// Words people type -> words that appear in the content
const SYNONYMS: Record<string, string[]> = {
  'لندن': ['london', 'ucl', 'kings', 'لندن', 'بريطانيا'],
  'بريطانيا': ['بريطانيا', 'uk', 'سكوتلاندا', 'مانشستر', 'نوتنغهام', 'كارديف', 'ريدنق', 'reading'],
  'امريكا': ['امريكا', 'usa', 'pharmd', 'فارم دي', 'philadelphia'],
  'كندا': ['كندا', 'canada'],
  'ايرلندا': ['ايرلندا', 'ireland', 'dublin'],
  'الاردن': ['الاردن', 'jordan'],
  'فارم': ['فارم دي', 'pharmd'],
  'ماستر': ['ماجستير', 'ماستر', 'msc', 'master'],
  'ماجستير': ['ماجستير', 'ماستر', 'msc', 'master'],
  'بورد': ['بورد', 'bcps', 'board'],
  'تطبيق': ['تطبيق', 'تطبيقات', 'app'],
  'دراسه': ['study', 'دراسه'],
};
const STOP = new Set(['ابي', 'ابغى', 'اريد', 'عن', 'في', 'من', 'على', 'الى', 'هذي', 'هذا', 'شنو', 'وش', 'ممكن', 'لو', 'سمحت', 'تجربه', 'تجارب', 'مقال', 'مقالات', 'عطني', 'اعطني', 'ملخص', 'لخص', 'لي', 'و', 'او', 'the', 'a', 'of',
  // words in almost every page: they say nothing about the topic
  'دراسه', 'دراسات', 'الدراسه', 'صيدله', 'الصيدله', 'صيدلي', 'الصيدلي', 'صيادله', 'الصيادله', 'pharmacy', 'طالب', 'طلاب', 'الطلبه', 'جامعه', 'الجامعه', 'بحث', 'ابحاث']);

export function search(items: Item[], q: string) {
  const wantsStudy = /دراس|بحث|ابحاث|study|journal/i.test(norm(q));
  const wantsPolicy = /قرار|قانون|وزار|سياس|ترخيص/.test(norm(q));
  const words = norm(q).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1 && !STOP.has(w));
  const terms = new Set<string>();
  for (const w of words) {
    terms.add(w);
    for (const [k, v] of Object.entries(SYNONYMS)) if (w.includes(norm(k))) v.forEach((x) => terms.add(norm(x)));
  }
  return items
    .map((it) => {
      const title = norm(it.title), body = norm(`${it.text} ${it.summary ?? ''}`);
      let score = 0;
      for (const t of terms) { if (title.includes(t)) score += 3; else if (body.includes(t)) score += 1; }
      if (score > 0 && wantsStudy && it.kind === 'study') score += 3;
      if (score > 0 && wantsPolicy && it.kind === 'policy') score += 3;
      return { it, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}
