// Receives a student's experience from /share-experience and opens it on GitHub as a pull request.
// Nothing is published until Moudhi presses "Merge pull request". Pressing "Close pull request" rejects it.
//
// Setup (once), in Vercel → Project → Settings → Environment Variables:
//   GITHUB_TOKEN        a fine-grained token for this repository only, with
//                       "Contents: Read and write" and "Pull requests: Read and write"
//   GITHUB_REPO         optional, default "maman92q8-blip/Pharmacy"
//   GITHUB_BASE_BRANCH  optional, default "main" (the branch the live site is built from)
import type { APIRoute } from 'astro';
import { validate, buildArticle, slugFor } from '../../lib/experience-article';

export const prerender = false;

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 1_500_000;
const LIMIT_PER_HOUR = 5;
const hits = new Map<string, number[]>();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const env = (k: string) => (import.meta.env as any)[k] || process.env[k] || '';

/** Accept only real JPEG / PNG / WebP images, checked by their first bytes, not by what the browser claims. */
function readPhoto(dataUrl: unknown): { bytes: Buffer; ext: string } | null {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl ?? ''));
  if (!m) return null;
  const bytes = Buffer.from(m[2], 'base64');
  if (bytes.length === 0 || bytes.length > MAX_PHOTO_BYTES) return null;
  const jpg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const png = bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const webp = bytes.subarray(0, 4).toString('latin1') === 'RIFF' && bytes.subarray(8, 12).toString('latin1') === 'WEBP';
  if (jpg) return { bytes, ext: 'jpg' };
  if (png) return { bytes, ext: 'png' };
  if (webp) return { bytes, ext: 'webp' };
  return null;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let raw: any;
  try { raw = await request.json(); } catch { return json({ error: 'الطلب غير صالح.' }, 400); }

  // A hidden field people never see; bots fill it in.
  if (raw?.website) return json({ ok: true });

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || clientAddress || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (recent.length >= LIMIT_PER_HOUR) return json({ error: 'أرسلت أكثر من تجربة خلال وقت قصير. جرّب بعد ساعة.' }, 429);

  const v = validate(raw);
  if (!v.ok) return json({ error: v.error }, 400);
  const d = v.data;

  const photos = (Array.isArray(raw.photos) ? raw.photos : []).slice(0, MAX_PHOTOS).map(readPhoto);
  if (photos.some((p: unknown) => !p)) return json({ error: 'إحدى الصور غير مدعومة أو حجمها كبير. استخدم صور JPG أو PNG.' }, 400);

  const token = env('GITHUB_TOKEN');
  if (!token) return json({ error: 'not-configured' }, 503);
  const repo = env('GITHUB_REPO') || 'maman92q8-blip/Pharmacy';
  const base = env('GITHUB_BASE_BRANCH') || 'main';
  const api = env('GITHUB_API_URL') || 'https://api.github.com';

  const gh = async (path: string, method = 'GET', body?: unknown) => {
    const res = await fetch(`${api}/repos/${repo}${path}`, {
      method,
      headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'content-type': 'application/json', 'user-agent': 'rxperiences-site' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`GitHub ${method} ${path} → ${res.status} ${(await res.text()).slice(0, 200)}`);
    return res.json();
  };

  try {
    const date = new Date().toISOString().slice(0, 10);
    const id = `${slugFor(d)}-${date}-${Math.random().toString(36).slice(2, 6)}`;
    const branch = `experience/${id}`;
    const head = await gh(`/git/ref/heads/${encodeURIComponent(base)}`);
    await gh('/git/refs', 'POST', { ref: `refs/heads/${branch}`, sha: head.object.sha });

    const images: string[] = [];
    for (const [i, p] of (photos as { bytes: Buffer; ext: string }[]).entries()) {
      const file = `public/images/experiences/${id}-${i + 1}.${p.ext}`;
      await gh(`/contents/${file}`, 'PUT', { message: `صورة لتجربة ${d.university}`, content: p.bytes.toString('base64'), branch });
      images.push(`/images/experiences/${id}-${i + 1}.${p.ext}`);
    }

    const { markdown, title, who } = buildArticle(d, { date, images });
    await gh(`/contents/src/content/posts/${id}.md`, 'PUT', { message: `تجربة جديدة: ${title}`, content: Buffer.from(markdown, 'utf8').toString('base64'), branch });

    await gh('/pulls', 'POST', {
      title: `تجربة جديدة: ${title}`,
      head: branch,
      base,
      body: [
        `**من:** ${who}  `,
        `**الجامعة:** ${d.university} – ${d.country}  `,
        `**الصور:** ${images.length}`,
        '',
        '### للنشر',
        '1. انتظري رابط المعاينة من Vercel (يظهر تحت خلال دقيقتين) وافتحيه لتشوفين المقال بشكله في الموقع.',
        '2. للتعديل: **Files changed** ← النقاط الثلاث بجانب الملف ← **Edit file**.',
        '3. للنشر: اضغطي **Merge pull request** ثم **Confirm merge**. يظهر المقال في الموقع خلال دقيقة.',
        '4. للرفض: اضغطي **Close pull request** تحت.',
        '',
        '---',
        '',
        markdown.replace(/^---[\s\S]*?---\n/, ''),
      ].join('\n'),
    });

    recent.push(now); hits.set(ip, recent);
    return json({ ok: true });
  } catch (e) {
    console.error('experience:', e);
    return json({ error: 'failed' }, 502);
  }
};
