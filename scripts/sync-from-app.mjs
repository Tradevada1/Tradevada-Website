import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const POSTS = path.join(ROOT, 'blog', 'posts');
const IMG = path.join(ROOT, 'public', 'img', 'blog');

const APP_BASE = process.env.APP_BASE || 'https://app.tradevada.com';
const inputPath = process.argv[2] || path.join(ROOT, 'learning_articles.json');

const TAGMAP = {
  options: 'Options Education',
  wheel: 'Wheel Strategy',
  psychology: 'Trading Psychology',
  stocks: 'Stocks',
  macro: 'Market Trends',
};

function abs(u) {
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.startsWith('/learning/image/') || u.startsWith('/static/')) return APP_BASE + u;
  return u;
}

function download(url, dest) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'tradevada-sync' } }, (res) => {
      if (res.statusCode !== 200) {
        file.close(); fs.unlink(dest, () => {}); return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    }).on('error', () => { file.close(); fs.unlink(dest, () => {}); resolve(false); });
  });
}

function isoDate(s) {
  if (!s) return '2026-06-12';
  return String(s).slice(0, 10);
}

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Export file not found: ' + inputPath);
    console.error('Save the admin JSON from ' + APP_BASE + '/api/admin/learning/articles to ' + inputPath);
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const articles = Array.isArray(raw) ? raw : (raw.articles || []);
  if (!articles.length) { console.error('No articles in export.'); process.exit(1); }

  fs.mkdirSync(POSTS, { recursive: true });
  fs.mkdirSync(IMG, { recursive: true });

  let written = 0, imgs = 0, skipped = 0;
  for (const a of articles) {
    if ((a.status || 'published') !== 'published') { skipped++; continue; }
    const slug = a.slug;
    if (!slug) continue;
    const tag = (a.tags && a.tags[0]) || TAGMAP[(a.category || 'options').toLowerCase()] || 'Options Education';
    const heroUrl = abs(a.hero_image_url);
    const heroDest = path.join(IMG, slug + '.jpg');
    let heroRel = '/img/blog/' + slug + '.jpg';
    if (heroUrl) {
      const ok = await download(heroUrl, heroDest);
      if (ok) imgs++;
      else if (!fs.existsSync(heroDest)) heroRel = '/img/blog/blog-hero.jpg';
    } else if (!fs.existsSync(heroDest)) {
      heroRel = '/img/blog/blog-hero.jpg';
    }
    const fm = [
      '---',
      'title: ' + (a.title || '').replace(/\n/g, ' '),
      'slug: ' + slug,
      'description: ' + (a.summary || '').replace(/\n/g, ' '),
      'date: ' + isoDate(a.published_at),
      'tag: ' + tag,
      'read_minutes: ' + (a.read_minutes || 5),
      'hero_image: ' + heroRel,
      '---',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(POSTS, slug + '.md'), fm + (a.content_md || '') + '\n', 'utf8');
    written++;
  }
  console.log('synced ' + written + ' posts, ' + imgs + ' covers downloaded, ' + skipped + ' drafts skipped');
  console.log('next: npm run build:blog   (then npm run deploy)');
}

main();
