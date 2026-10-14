// Tidies the HTML of articles imported from the old WordPress site, at build time only.
// The Markdown files are never changed. It:
//  1. turns a paragraph that is only a bold line (e.g. **ما هي متطلبات الجامعة؟**) into a real heading,
//     so readers (and screen readers) get proper sections and a contents list;
//  2. turns runs of paragraphs that start with "–" or "•" into a real bulleted list;
//  3. marks blocks written only in English as left-to-right, so their punctuation reads correctly;
//  4. lazy-loads images inside articles;
//  5. joins a paragraph that is only punctuation (a lone ':') onto the paragraph before it;
//  6. replaces the non-breaking spaces the old site put between every word, which stopped lines from wrapping.

const isWs = (n) => n.type === 'text' && !n.value.trim();
const isBr = (n) => n.type === 'element' && n.tagName === 'br';
const textOf = (n) => (n.type === 'text' ? n.value : (n.children || []).map(textOf).join(''));

function boldOnly(p) {
  if (p.type !== 'element' || p.tagName !== 'p') return null;
  const kids = p.children.filter((k) => !isWs(k) && !isBr(k));
  if (kids.length !== 1) return null;
  const k = kids[0];
  if (k.type !== 'element' || (k.tagName !== 'strong' && k.tagName !== 'b')) return null;
  const t = textOf(k).trim();
  if (!t || t.length > 120) return null;
  return k;
}

const DASH = /^\s*[–•]\s*/;
function dashPara(p) {
  if (p.type !== 'element' || p.tagName !== 'p') return false;
  const first = p.children.find((k) => !isWs(k));
  return !!first && first.type === 'text' && DASH.test(first.value);
}
function stripDash(p) {
  const first = p.children.find((k) => !isWs(k));
  first.value = first.value.replace(DASH, '');
  return p.children;
}

function walk(node, fn) {
  fn(node);
  (node.children || []).forEach((c) => walk(c, fn));
}

export default function rehypeTidyImports() {
  return (tree) => {
    let hasH2 = false;
    walk(tree, (n) => { if (n.type === 'element' && n.tagName === 'h2') hasH2 = true; });
    const level = hasH2 ? 'h3' : 'h2';

    // Only top-level paragraphs of the article are considered.
    const out = [];
    const kids = tree.children;
    for (let i = 0; i < kids.length; i++) {
      const n = kids[i];
      const strong = boldOnly(n);
      if (strong) { out.push({ type: 'element', tagName: level, properties: {}, children: strong.children }); continue; }
      if (dashPara(n)) {
        // collect a run of dash paragraphs (whitespace text between them is allowed)
        const run = [n]; let j = i + 1;
        while (j < kids.length) {
          if (isWs(kids[j])) { j++; continue; }
          if (dashPara(kids[j])) { run.push(kids[j]); j++; continue; }
          break;
        }
        if (run.length >= 2) {
          out.push({ type: 'element', tagName: 'ul', properties: {}, children: run.map((p) => ({ type: 'element', tagName: 'li', properties: {}, children: stripDash(p) })) });
          i = j - 1; continue;
        }
      }
      if (n.type === 'element' && n.tagName === 'p' && /^[\s:：.،؛]+$/.test(textOf(n))) {
        const prev = [...out].reverse().find((k) => !isWs(k));
        if (prev && prev.type === 'element' && prev.tagName === 'p') { prev.children.push({ type: 'text', value: textOf(n).trim() }); continue; }
      }
      out.push(n);
    }
    tree.children = out;

    const BLOCKS = new Set(['p', 'li', 'h2', 'h3', 'h4', 'blockquote']);
    walk(tree, (n) => {
      if (n.type === 'text' && n.value.includes('\u00A0')) n.value = n.value.replace(/\u00A0/g, ' ');
      if (n.type === 'element' && BLOCKS.has(n.tagName) && !(n.properties && n.properties.dir)) {
        const t = textOf(n);
        if (/[A-Za-z]/.test(t) && !/[\u0600-\u06FF]/.test(t)) n.properties = { ...n.properties, dir: 'ltr' };
      }
      if (n.type === 'element' && n.tagName === 'img') {
        n.properties = { ...n.properties, loading: 'lazy', decoding: 'async' };
      }
    });
  };
}
