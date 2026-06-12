const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const ROOT = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const OUT_DIR = path.join(ROOT, 'public', 'blog');
const SITEMAP = path.join(ROOT, 'public', 'sitemap.xml');
const SHELL_SOURCE = path.join(ROOT, 'public', 'about.html');
const BASE_URL = 'https://tradevada.com';
const SIGNUP_URL = 'https://app.tradevada.com/signup';
const DEFAULT_OG = '/img/blog/og-default.png';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
}

function parseFrontMatter(raw) {
  if (!raw.startsWith('---')) return [{}, raw];
  const parts = raw.split('---');
  if (parts.length < 3) return [{}, raw];
  const meta = {};
  for (const line of parts[1].trim().split('\n')) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  return [meta, parts.slice(2).join('---')];
}

function loadShell() {
  const src = fs.readFileSync(SHELL_SOURCE, 'utf-8');
  const styles = (src.match(/<style[\s\S]*?<\/style>/g) || []).join('\n');
  const navMatch = src.match(/<nav class="top"[\s\S]*?<\/nav>/);
  const footMatch = src.match(/<footer[\s\S]*?<\/footer>/);
  const fontLinks = (src.match(/<link[^>]*(fonts\.googleapis|fonts\.gstatic)[^>]*>/g) || []).join('\n');
  const iconLinks = (src.match(/<link[^>]*(icon|apple-touch)[^>]*>/g) || []).join('\n');
  const gaMatch = src.match(/<script async src="https:\/\/www\.googletagmanager\.com[^>]*><\/script>\s*<script>[\s\S]*?<\/script>/);
  const ga = gaMatch ? gaMatch[0] : '';
  if (!navMatch || !footMatch) throw new Error('could not extract nav/footer from ' + SHELL_SOURCE);
  const absolutize = html => html
    .replace(/href="(?!https?:|\/|#|mailto:)([^"]+)"/g, 'href="/$1"')
    .replace(/src="(?!https?:|\/|data:)([^"]+)"/g, 'src="/$1"');
  return {styles, nav: absolutize(navMatch[0]), footer: absolutize(footMatch[0]), fontLinks, iconLinks, ga};
}

const BLOG_CSS = `<style>
.blog-main{max-width:1060px;margin:0 auto;padding:36px 22px 70px}
.blog-hero{text-align:center;padding:16px 0 26px;position:relative}
.blog-hero .blog-eyebrow{display:inline-block;font-size:11.5px;font-weight:800;letter-spacing:0.22em;text-transform:uppercase;color:var(--primary);background:var(--primary-soft);border:1px solid rgba(124,58,237,.25);border-radius:999px;padding:6px 14px;margin-bottom:16px}
.blog-hero h1{font-size:46px;font-weight:800;letter-spacing:-0.035em;margin:0 0 12px;color:var(--text);line-height:1.12}
.blog-hero h1 .accent{background:linear-gradient(135deg,#9b6cff 0,#7c3aed 55%,#6516d9 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.blog-hero p{color:var(--muted);font-size:16px;margin:0}
.blog-hero-banner{margin:0 0 36px;border-radius:18px;overflow:hidden;border:1px solid var(--border);box-shadow:0 22px 54px -22px rgba(12,14,38,0.35)}
.blog-hero-banner img{width:100%;height:300px;object-fit:cover;display:block}
@media (max-width:599px){.blog-hero-banner img{height:170px}}
.blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:36px}
.blog-card{display:flex;flex-direction:column;gap:10px;background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:0 14px 38px -18px rgba(12,14,38,0.18);transition:border-color .15s,transform .15s,box-shadow .15s;text-decoration:none;position:relative;overflow:hidden}
.blog-card-img{margin:-22px -22px 4px;height:170px;overflow:hidden;border-bottom:1px solid var(--border)}
.blog-card-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .25s}
.blog-card:hover .blog-card-img img{transform:scale(1.04)}
.blog-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#9b6cff,#7c3aed 60%,transparent);opacity:0;transition:opacity .15s}
.blog-card:hover{border-color:var(--primary);transform:translateY(-3px);box-shadow:0 22px 48px -16px rgba(124,58,237,.35)}
.blog-card:hover::before{opacity:1}
.blog-card h2{font-size:19px;font-weight:800;letter-spacing:-0.02em;line-height:1.3;color:var(--text);margin:0}
.blog-card p{color:var(--muted);font-size:13.5px;line-height:1.55;margin:0;flex:1}
.blog-card-meta{color:var(--dim);font-size:11.5px;font-weight:600}
.blog-card.featured{grid-column:1 / -1;flex-direction:row;align-items:stretch;gap:0;padding:0;background:linear-gradient(135deg,rgba(124,58,237,.07),var(--panel) 55%)}
.blog-card.featured .blog-feat-img{flex:0 0 42%;overflow:hidden}
.blog-card.featured .blog-feat-img img{width:100%;height:100%;object-fit:cover;display:block;min-height:280px;transition:transform .25s}
.blog-card.featured:hover .blog-feat-img img{transform:scale(1.03)}
.blog-card.featured .blog-feat-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:12px;padding:30px 32px}
.blog-card.featured h2{font-size:28px;letter-spacing:-0.03em;line-height:1.2}
.blog-card.featured p{font-size:15px;line-height:1.6}
.blog-card.featured .blog-feat-arrow{flex-shrink:0;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#9b6cff 0,#7c3aed 52%,#6516d9 100%);color:#fff;font-size:22px;box-shadow:0 12px 32px -12px rgba(124,58,237,.85)}
@media (max-width:899px){.blog-card.featured{flex-direction:column;align-items:stretch}.blog-card.featured .blog-feat-img{flex:none;max-height:220px}.blog-card.featured .blog-feat-img img{min-height:0;height:220px}.blog-card.featured .blog-feat-arrow{display:none}.blog-card.featured h2{font-size:22px}}
.blog-tag{align-self:flex-start;display:inline-block;padding:3px 10px;border-radius:999px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:var(--primary-soft);color:var(--primary);border:1px solid rgba(124,58,237,.30)}
.blog-article{max-width:700px;margin:0 auto;padding:46px 22px 70px}
.blog-article-head{margin-bottom:26px}
.blog-article-hero{margin:0 0 28px;border-radius:16px;overflow:hidden;border:1px solid var(--border);box-shadow:0 14px 38px -18px rgba(12,14,38,0.18)}
.blog-article-hero img{width:100%;height:auto;display:block}
.blog-article-head h1{font-size:34px;font-weight:800;line-height:1.22;letter-spacing:-0.03em;margin:12px 0 10px;color:var(--text)}
.blog-article-meta{color:var(--dim);font-size:13px}
.blog-article-body{font-size:18px;line-height:1.7;color:rgba(21,21,30,.8)}
.blog-article-body h2{font-size:25px;font-weight:800;letter-spacing:-0.02em;color:var(--text);margin:36px 0 14px;line-height:1.3}
.blog-article-body h3{font-size:19px;font-weight:700;color:var(--text);margin:28px 0 10px}
.blog-article-body p{margin:0 0 18px}
.blog-article-body a{color:var(--primary);text-decoration:underline;text-underline-offset:3px}
.blog-article-body ul,.blog-article-body ol{margin:0 0 18px;padding-left:26px}
.blog-article-body li{margin-bottom:8px}
.blog-article-body img{width:100%;height:auto;border-radius:14px;border:1px solid var(--border);margin:6px 0 18px}
.blog-article-body code{background:var(--panel-2);border:1px solid var(--border);border-radius:6px;padding:2px 6px;font-size:15px;font-family:var(--mono)}
.blog-article-body pre{background:var(--panel-2);border:1px solid var(--border);border-radius:12px;padding:16px;overflow-x:auto;margin:0 0 18px}
.blog-article-body pre code{background:transparent;border:0;padding:0}
.blog-article-body blockquote{border-left:3px solid var(--primary);margin:0 0 18px;padding:4px 0 4px 18px;color:var(--muted);font-style:italic}
.blog-article-body table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:15px}
.blog-article-body th,.blog-article-body td{border:1px solid var(--border);padding:9px 12px;text-align:left}
.blog-article-body th{background:var(--panel-2);color:var(--text)}
.blog-cta{background:var(--panel);border:1px solid var(--border);border-left:3px solid var(--primary);border-radius:14px;padding:22px 24px;margin:30px 0;box-shadow:0 14px 38px -18px rgba(12,14,38,0.18)}
.blog-cta-head{font-size:20px;font-weight:800;letter-spacing:-0.02em;color:var(--text);margin-bottom:8px}
.blog-cta-body{color:var(--muted);font-size:14.5px;line-height:1.6;margin-bottom:16px}
.blog-cta .btn.primary{display:inline-flex}
.blog-pagenav{display:flex;justify-content:space-between;gap:14px;margin-top:34px;padding-top:22px;border-top:1px solid var(--border)}
.blog-pagenav a{color:var(--muted);font-size:13.5px;font-weight:600;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-decoration:none}
.blog-pagenav a:hover{color:var(--primary)}
@media (max-width:899px){.blog-grid{grid-template-columns:repeat(2,1fr)}}
@media (max-width:599px){.blog-grid{grid-template-columns:1fr}.blog-hero h1{font-size:30px}.blog-article-head h1{font-size:27px}.blog-article-body{font-size:16.5px}}
</style>`;

const CTA_HTML = `<div class="blog-cta">
<div class="blog-cta-head">Tradevada tracks this automatically.</div>
<div class="blog-cta-body">Win rate by strategy, premium collected, annualized returns — imported straight from your broker.</div>
<a class="btn primary" href="${SIGNUP_URL}">Get Started →</a>
</div>`;

function page(shell, {title, metaHtml, bodyHtml}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
${metaHtml}
${shell.ga}
${shell.iconLinks}
${shell.fontLinks}
${shell.styles}
${BLOG_CSS}
</head>
<body>
${shell.nav}
${bodyHtml}
${shell.footer}
</body>
</html>
`;
}

function fmtDate(d) {
  const m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return d || '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}, ${m[1]}`;
}

function heroExists(rel) {
  if (!rel) return false;
  return fs.existsSync(path.join(ROOT, 'public', rel.replace(/^\//, '')));
}

function loadPosts() {
  const posts = [];
  for (const fn of fs.readdirSync(POSTS_DIR).sort()) {
    if (!fn.endsWith('.md') || fn.toLowerCase() === 'readme.md') continue;
    const raw = fs.readFileSync(path.join(POSTS_DIR, fn), 'utf-8');
    const [meta, body] = parseFrontMatter(raw);
    const slug = meta.slug || fn.replace(/\.md$/, '');
    if (!/^[a-z0-9-]+$/.test(slug)) {
      console.warn(`skipping ${fn} — slug must be lowercase letters, digits and dashes`);
      continue;
    }
    posts.push({
      slug,
      title: meta.title || slug.replace(/-/g, ' '),
      description: meta.description || '',
      date: meta.date || '',
      tag: meta.tag || '',
      readMinutes: parseInt(meta.read_minutes, 10) || 5,
      ogImage: heroExists(meta.og_image) ? meta.og_image : (heroExists(meta.hero_image) ? meta.hero_image : DEFAULT_OG),
      heroImage: heroExists(meta.hero_image) ? meta.hero_image : '',
      html: marked.parse(body),
    });
  }
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

function seoMeta({title, description, url, ogImage, type, published}) {
  let m = `<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${BASE_URL}${ogImage}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${BASE_URL}${ogImage}">`;
  if (published) m += `\n<meta property="article:published_time" content="${published}">`;
  return m;
}

function buildIndex(shell, posts) {
  const cards = posts.map((p, i) => i === 0
    ? `<a class="blog-card featured" href="/blog/${p.slug}">
${p.heroImage ? `<div class="blog-feat-img"><img src="${p.heroImage}" alt="${esc(p.title)}" loading="eager"></div>` : ''}
<div class="blog-feat-body">
${p.tag ? `<span class="blog-tag">${esc(p.tag)}</span>` : ''}
<h2>${esc(p.title)}</h2>
<p>${esc(p.description)}</p>
<div class="blog-card-meta">${fmtDate(p.date)} · ${p.readMinutes} min read</div>
</div>
</a>`
    : `<a class="blog-card" href="/blog/${p.slug}">
${p.heroImage ? `<div class="blog-card-img"><img src="${p.heroImage}" alt="${esc(p.title)}" loading="lazy"></div>` : ''}
${p.tag ? `<span class="blog-tag">${esc(p.tag)}</span>` : ''}
<h2>${esc(p.title)}</h2>
<p>${esc(p.description)}</p>
<div class="blog-card-meta">${fmtDate(p.date)} · ${p.readMinutes} min read</div>
</a>`).join('\n');
  const mainHero = heroExists('/img/blog/blog-hero.jpg')
    ? `<div class="blog-hero-banner"><img src="/img/blog/blog-hero.jpg" alt="The Tradevada Blog" loading="eager"></div>`
    : '';
  const body = `<main class="blog-main">
<section class="blog-hero">
<span class="blog-eyebrow">The Tradevada Blog</span>
<h1>Journal smarter. <span class="accent">Trade the data.</span></h1>
<p>Journaling, analytics, and the wheel — for traders who track.</p>
</section>
${mainHero}
<section class="blog-grid">
${cards}
</section>
${CTA_HTML}
</main>`;
  return page(shell, {
    title: 'Blog | Tradevada',
    metaHtml: seoMeta({
      title: 'The Tradevada Blog',
      description: 'Journaling, analytics, and the wheel — for traders who track. Guides and worked examples from Tradevada.',
      url: `${BASE_URL}/blog/`,
      ogImage: DEFAULT_OG,
      type: 'website',
    }),
    bodyHtml: body,
  });
}

function buildPost(shell, p, older, newer) {
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    image: BASE_URL + p.ogImage,
    mainEntityOfPage: `${BASE_URL}/blog/${p.slug}`,
    author: {'@type': 'Organization', name: 'Tradevada', url: BASE_URL},
    publisher: {'@type': 'Organization', name: 'Tradevada', url: BASE_URL},
  });
  const body = `<main class="blog-article">
<article>
<header class="blog-article-head">
${p.tag ? `<span class="blog-tag">${esc(p.tag)}</span>` : ''}
<h1>${esc(p.title)}</h1>
<div class="blog-article-meta">${fmtDate(p.date)} · ${p.readMinutes} min read</div>
</header>
${p.heroImage ? `<div class="blog-article-hero"><img src="${p.heroImage}" alt="${esc(p.title)}"></div>` : ''}
<div class="blog-article-body">
${p.html}
</div>
${CTA_HTML}
</article>
<nav class="blog-pagenav">
${older ? `<a href="/blog/${older.slug}">← ${esc(older.title)}</a>` : '<span></span>'}
${newer ? `<a href="/blog/${newer.slug}">${esc(newer.title)} →</a>` : ''}
</nav>
</main>`;
  return page(shell, {
    title: `${p.title} | Tradevada`,
    metaHtml: seoMeta({
      title: p.title,
      description: p.description,
      url: `${BASE_URL}/blog/${p.slug}`,
      ogImage: p.ogImage,
      type: 'article',
      published: p.date,
    }) + `\n<script type="application/ld+json">${ld}</script>`,
    bodyHtml: body,
  });
}

function updateSitemap(posts) {
  let xml = fs.readFileSync(SITEMAP, 'utf-8');
  xml = xml.replace(/\s*<url><loc>https:\/\/tradevada\.com\/blog[^<]*<\/loc>.*?<\/url>/g, '');
  const today = new Date().toISOString().slice(0, 10);
  const entries = [`  <url><loc>${BASE_URL}/blog/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`]
    .concat(posts.map(p => `  <url><loc>${BASE_URL}/blog/${p.slug}</loc>${p.date ? `<lastmod>${p.date}</lastmod>` : ''}<changefreq>monthly</changefreq><priority>0.7</priority></url>`));
  xml = xml.replace('</urlset>', entries.join('\n') + '\n</urlset>');
  fs.writeFileSync(SITEMAP, xml);
}

function main() {
  const shell = loadShell();
  const posts = loadPosts();
  fs.rmSync(OUT_DIR, {recursive: true, force: true});
  fs.mkdirSync(OUT_DIR, {recursive: true});
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildIndex(shell, posts));
  posts.forEach((p, i) => {
    const newer = i > 0 ? posts[i - 1] : null;
    const older = i + 1 < posts.length ? posts[i + 1] : null;
    fs.writeFileSync(path.join(OUT_DIR, `${p.slug}.html`), buildPost(shell, p, older, newer));
  });
  updateSitemap(posts);
  console.log(`built ${posts.length} post(s) + index into public/blog/`);
}

main();
