import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOST = 'tradevada.com';
const KEY = 'c189ec2c5f9622e11ea9a69d2d7911ed';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

async function main() {
  const urlList = urlsFromSitemap();
  if (!urlList.length) { console.log('indexnow: no URLs in sitemap'); return; }
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  try {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    console.log(`indexnow: submitted ${urlList.length} URLs → HTTP ${r.status}`);
  } catch (e) {
    console.log('indexnow: ping failed (non-fatal):', e.message);
  }
}
main();
