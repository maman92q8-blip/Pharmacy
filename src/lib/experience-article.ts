// Shared by the "شارك تجربتك" page (preview in the browser) and /api/experience (the real submission),
// so the article a student previews is exactly the article Moudhi receives.

export const COUNTRIES: { v: string; cat: string }[] = [
  { v: 'بريطانيا', cat: 'uk-ireland' }, { v: 'إيرلندا', cat: 'uk-ireland' },
  { v: 'أمريكا', cat: 'usa-canada' }, { v: 'كندا', cat: 'usa-canada' },
  { v: 'الكويت', cat: 'arab-countries' }, { v: 'الأردن', cat: 'arab-countries' },
  { v: 'مصر', cat: 'arab-countries' }, { v: 'السعودية', cat: 'arab-countries' },
  { v: 'دولة عربية أخرى', cat: 'arab-countries' }, { v: 'دولة أخرى', cat: '' },
];

export const STAGES = ['فاونديشن (Foundation)', 'بكالوريوس صيدلة (BPharm / MPharm)', 'فارم دي (PharmD)', 'ماجستير (MSc)', 'دكتوراه (PhD)', 'بورد أو شهادة مهنية', 'أخرى'];

// The questions, taken from the experiences already on the site. Each becomes a heading in the article.
export const QUESTIONS = [
  { id: 'q-program', q: 'ما هو البرنامج وكم مدته؟', hint: 'نوع البرنامج، عدد السنوات، هل فيه سنة تحضيرية أو تدريب.' },
  { id: 'q-subjects', q: 'ما هي المواد وطبيعة المنهج؟', hint: 'أهم المواد، وهل فيه جانب عملي أو تدريب في مستشفى أو صيدلية.' },
  { id: 'q-admission', q: 'ما هي متطلبات القبول وكيف قدّمت؟', hint: 'المعدل، IELTS أو TOEFL، اختبارات، مقابلة، وكم أخذ التقديم من وقت.' },
  { id: 'q-exams', q: 'كيف طريقة التقييم والامتحانات؟', hint: 'امتحانات، assignments، OSCE، مشروع بحث…' },
  { id: 'q-difficulty', q: 'ما مستوى صعوبة الدراسة؟', hint: 'وكيف تقارنها بالدراسة في الكويت أو المدرسة.' },
  { id: 'q-city', q: 'كيف المنطقة والمعيشة؟', hint: 'الأمان، المواصلات، الجو، المطاعم والجالية العربية.' },
  { id: 'q-housing', q: 'وين سكنت وكم تكلفة المعيشة تقريباً؟', hint: 'سكن جامعي أو خاص، والإيجار الشهري التقريبي.' },
  { id: 'q-after', q: 'شنو بعد التخرج؟', hint: 'الاعتراف بالشهادة في الكويت أو الخليج، فرص العمل والتدريب.' },
  { id: 'q-best', q: 'أحلى شي وأصعب شي في التجربة؟', hint: '' },
  { id: 'q-advice', q: 'نصيحتك لطالب يفكر بنفس الطريق؟', hint: '' },
];

export const MIN_ANSWERS = 3;
export const LIMITS = { short: 120, answer: 4000 };

export interface Submission {
  name: string; anon: boolean; country: string; city: string; university: string;
  stage: string; major: string; years: string; sponsor: string;
  answers: Record<string, string>;   // question id -> answer
}

const clean = (s: unknown, max: number) => String(s ?? '').replace(/\r/g, '').trim().slice(0, max);
// short fields (name, university…) are always one line
const one = (s: unknown, max: number) => clean(String(s ?? '').replace(/\s+/g, ' '), max);
// Text a student types must never be read as Markdown structure or YAML: strip leading markers and html.
const safeLine = (s: string) => s.replace(/<[^>]*>/g, '').replace(/^\s*(#+|---+|>+|```)\s*/, '').trim();
const yaml = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ');

/** Normalise and validate. Returns the cleaned submission or the first problem, in Arabic. */
export function validate(raw: any): { ok: true; data: Submission } | { ok: false; error: string } {
  const d: Submission = {
    name: one(raw?.name, LIMITS.short), anon: !!raw?.anon,
    country: one(raw?.country, LIMITS.short), city: one(raw?.city, LIMITS.short),
    university: one(raw?.university, LIMITS.short), stage: one(raw?.stage, LIMITS.short),
    major: one(raw?.major, LIMITS.short), years: one(raw?.years, LIMITS.short), sponsor: one(raw?.sponsor, LIMITS.short),
    answers: {},
  };
  for (const q of QUESTIONS) { const a = clean(raw?.answers?.[q.id], LIMITS.answer); if (a) d.answers[q.id] = a; }
  if (!d.anon && !d.name) return { ok: false, error: 'اكتب اسمك، أو اختر «أفضّل ما يظهر اسمي».' };
  if (!COUNTRIES.some((c) => c.v === d.country)) return { ok: false, error: 'اختر الدولة.' };
  if (!d.university) return { ok: false, error: 'اكتب اسم الجامعة.' };
  if (!STAGES.includes(d.stage)) return { ok: false, error: 'اختر المرحلة.' };
  if (Object.keys(d.answers).length < MIN_ANSWERS) return { ok: false, error: `جاوب على ${MIN_ANSWERS} أسئلة على الأقل.` };
  if (raw?.consent !== true) return { ok: false, error: 'وافق على النشر في الخطوة الأخيرة.' };
  return { ok: true, data: d };
}

/** The article in the site's format (same as src/content/posts/*.md). */
export function buildArticle(d: Submission, opts: { date?: string; images?: string[] } = {}) {
  const cat = COUNTRIES.find((c) => c.v === d.country)?.cat ?? '';
  const stage = d.stage.replace(/\s*\(.*\)\s*/, '');
  const title = safeLine(`تجربة ${stage}${d.major ? ` ${d.major}` : ''} في ${d.university}`);
  const answers = QUESTIONS.filter((q) => d.answers[q.id]).map((q) => ({ q: q.q, a: d.answers[q.id] }));
  const date = opts.date ?? new Date().toISOString().slice(0, 10);
  const who = d.anon ? `طالب/ة من ${d.country}` : safeLine(d.name);
  const facts = [
    `**الجامعة:** ${safeLine(d.university)}`,
    d.city && `**المدينة:** ${safeLine(d.city)}`,
    `**الدولة:** ${d.country}`,
    `**المرحلة:** ${d.stage}${d.major ? ` – ${safeLine(d.major)}` : ''}`,
    d.years && `**سنوات الدراسة:** ${safeLine(d.years)}`,
    d.sponsor && `**جهة الابتعاث:** ${safeLine(d.sponsor)}`,
  ].filter(Boolean).join('  \n');
  // each line the student wrote becomes its own paragraph
  const para = (a: string) => a.split(/\n+/).map(safeLine).filter(Boolean).join('\n\n');
  const body = answers.map((x) => `## ${x.q}\n\n${para(x.a)}`).join('\n\n');
  const images = opts.images ?? [];
  const extra = images.slice(1).map((src) => `![](${src})`).join('\n\n');
  const excerpt = safeLine(answers[0]?.a.split(/\n/)[0] ?? '').slice(0, 160);
  const markdown = `---
title: "${yaml(title)}"
date: ${date}
categories: [${cat ? `"${cat}"` : ''}]
experience: true
${images[0] ? `image: "${images[0]}"` : '# image: "/images/اسم-الصورة.jpg"'}
excerpt: "${yaml(excerpt)}"
---

${facts}
${extra ? `\n${extra}\n` : ''}
${body}

**تجربة: ${who}**
`;
  return { markdown, title, who, cat };
}

/** File-name friendly id from the university name, e.g. "university-of-manchester". */
export function slugFor(d: Submission) {
  return (d.university.toLowerCase().match(/[a-z0-9]+/g) || ['experience']).slice(0, 5).join('-');
}
