// Capsy, the RXperiences assistant. Runs on Vercel as a small server function.
// With ANTHROPIC_API_KEY set (Vercel → Project → Settings → Environment Variables) it answers with Claude,
// using only the site's content. Without a key, or if the AI is unavailable, it falls back to a simple search.
import type { APIRoute } from 'astro';
import { getIndex, catalogue, search, type Item } from '../../lib/capsy-index';

export const prerender = false;

const MAX_INPUT = 400;          // characters per question
const MAX_TURNS = 6;            // earlier messages sent for context
const LIMIT = 20;               // questions per visitor per 10 minutes
const hits = new Map<string, number[]>();

type Out = { reply: string; links: { label: string; href: string; external: boolean }[]; found: boolean; mode: 'ai' | 'search' };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

const toLink = (it: Item) => ({ label: it.title, href: it.href, external: it.external });

const RULES = `أنت "Capsy"، المساعد اللطيف لموقع RXperiences (موقع موضي أمان عن الصيدلة في الكويت والخليج). شكلك كبسولة دواء وردية.
مهمتك: تساعد الزائر يلقى اللي يبيه من محتوى الموقع فقط (المقالات والتجارب، الدراسات، قرارات وزارة الصحة، المراجع) الموجود في القائمة تحت.

القواعد:
- جاوب بالعربي وباللهجة الكويتية الخفيفة، بجمل قصيرة وواضحة (٣ جمل كحد أقصى غالباً).
- اعتمد فقط على القائمة. لا تخترع مقالات ولا دراسات ولا أرقام ولا روابط ولا معلومات طبية.
- إذا طلب ملخص دراسة: لخّصها فقط من "ملخص الموقع" المكتوب لها. إذا ما فيه ملخص، قل إن الملخص مو متوفر بالموقع وأعطه رابط الدراسة.
- إذا طلب تجربة أو موضوع (مثلاً لندن): رشّح أنسب ١ إلى ٣ عناصر من القائمة.
- لا تعطي نصائح طبية أو جرعات أو تشخيص؛ قل له يراجع الصيدلي أو الطبيب.
- إذا الشي اللي يبيه مو موجود بالقائمة: found=false، وقل له بلطف إنه حالياً مو متوفر، وإنه يقدر يتواصل ويشارك رأيه والتجارب اللي يبي يشوفها.
- إذا السؤال ما له علاقة بالصيدلة أو بالموقع، اعتذر بلطف ووضّح شنو تقدر تساعد فيه.

رد دائماً بـ JSON فقط، بدون أي نص قبله أو بعده، بهذا الشكل:
{"reply": "نص الرد", "ids": ["post:..."], "found": true}
حيث ids هي معرّفات العناصر من القائمة (بين الأقواس المربعة) بالضبط، ومن صفر إلى ثلاثة عناصر.`;

async function askClaude(key: string, items: Item[], history: { role: 'user' | 'assistant'; content: string }[], page: string): Promise<Out | null> {
  const base = import.meta.env.CAPSY_API_URL || process.env.CAPSY_API_URL || 'https://api.anthropic.com';
  const model = import.meta.env.CAPSY_MODEL || process.env.CAPSY_MODEL || 'claude-haiku-5-5';
  const res = await fetch(`${base}/v1/messages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model,
      max_tokens: 500,
      system: [
        { type: 'text', text: RULES },
        // the catalogue is identical for every visitor, so it is cached to keep each question cheap
        { type: 'text', text: `القائمة:\n\n${catalogue(items)}`, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `الزائر الآن في الصفحة: ${page}` },
      ],
      messages: history,
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) { console.error('capsy: AI error', res.status, (await res.text()).slice(0, 300)); return null; }
  const data = await res.json();
  const text: string = (data.content ?? []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  let parsed: any;
  try { parsed = JSON.parse(m[0]); } catch { return null; }
  if (typeof parsed.reply !== 'string') return null;
  // only links to things that really exist on the site
  const byId = new Map(items.map((it) => [it.id, it]));
  const links = (Array.isArray(parsed.ids) ? parsed.ids : []).map((id: string) => byId.get(id)).filter(Boolean).slice(0, 3).map((it: Item) => toLink(it));
  return { reply: parsed.reply.slice(0, 900), links, found: parsed.found !== false, mode: 'ai' };
}

function fallback(items: Item[], q: string): Out {
  const wantsSummary = /ملخص|لخص|لخّص|summary/i.test(q);
  let results = search(items, q);
  if (wantsSummary) { const s = results.filter((r) => r.it.kind === 'study' || r.it.kind === 'policy'); if (s.length) results = s; }
  if (!results.length) {
    return { reply: 'حالياً هذا الموضوع مو متوفر بالموقع.', links: [], found: false, mode: 'search' };
  }
  const top = results[0].it;
  if (wantsSummary && (top.kind === 'study' || top.kind === 'policy')) {
    return {
      reply: top.summary ? `ملخص «${top.title}»: ${top.summary}` : 'ملخص هذه الدراسة مو مكتوب بالموقع، بس هذا رابطها:',
      links: [toLink(top)], found: true, mode: 'search',
    };
  }
  return { reply: 'هذي أقرب الصفحات لسؤالك:', links: results.slice(0, 3).map((r) => toLink(r.it)), found: true, mode: 'search' };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  // basic limit so the assistant can't be used to run up costs
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || clientAddress || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= LIMIT) return json({ reply: 'سألت أسئلة كثيرة بوقت قصير، جرّب بعد شوي.', links: [], found: true, mode: 'search' }, 429);
  recent.push(now); hits.set(ip, recent);

  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'bad request' }, 400); }
  const message = String(body?.message ?? '').trim().slice(0, MAX_INPUT);
  if (!message) return json({ error: 'empty' }, 400);
  const page = String(body?.page ?? '/').slice(0, 200);
  const history = (Array.isArray(body?.history) ? body.history : [])
    .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string')
    .slice(-MAX_TURNS)
    .map((m: any) => ({ role: m.role, content: m.content.slice(0, 900) }));
  // the conversation must start with the visitor and alternate
  while (history.length && history[0].role !== 'user') history.shift();
  const turns = [...history, { role: 'user' as const, content: message }]
    .filter((m, i, a) => i === 0 || m.role !== a[i - 1].role);

  const items = await getIndex();
  const key = import.meta.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  let out: Out | null = null;
  if (key) {
    try { out = await askClaude(key, items, turns, page); } catch (e) { console.error('capsy:', e); }
  }
  return json(out ?? fallback(items, message));
};
