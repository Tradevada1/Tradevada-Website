import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG = path.join(__dirname, '..', 'public', 'img', 'blog');

const COVERS = {
  'monthly-income-selling-options': 'https://app.tradevada.com/learning/image/CMy6Y94r1WK_bDaKjvm61MY0.jpg',
  'iv-rank-for-premium-sellers': 'https://app.tradevada.com/learning/image/D1yMs0gqYGDLLRax9rStp_5e.jpg',
  'when-to-roll-cash-secured-put': 'https://app.tradevada.com/learning/image/qYjoBb2aRdiYMnmE46urSx6c.jpg',
  'theta-decay-explained': 'https://app.tradevada.com/learning/image/oUWzL9qWssIS3klgm1QuUFG8.jpg',
  'why-wheel-traders-need-a-journal': 'https://app.tradevada.com/learning/image/K3uFYODTC0xSe4jtYLGsX7MI.jpg',
  'covered-call-mistakes': 'https://app.tradevada.com/learning/image/cI6ftpBhOOUwyupGnTxY4PYH.jpg',
  'metrics-that-measure-wheel-strategy': 'https://app.tradevada.com/learning/image/8PecMDQdf1eiLn933urgYAQn.jpg',
  'wheel-strategy-small-account': 'https://tradevada.com/img/blog/wheel-strategy-small-account.jpg',
  'wheel-trading-weekly-routine': 'https://app.tradevada.com/learning/image/v3QvKsYdFOiSjCrhkEp1xFei.jpg',
  'options-greeks-for-wheel-traders': 'https://app.tradevada.com/learning/image/HsjvBNsF7ypSDLWu7qFHQmZh.jpg',
  'best-time-to-sell-options': 'https://app.tradevada.com/learning/image/RbI1j3DhrP83ThMhhQgbWz0A.jpg',
  'compounding-options-premium': 'https://app.tradevada.com/learning/image/i2nKZnuVlIgsFlyZR6mokNFa.jpg',
  'managing-losing-cash-secured-put': 'https://app.tradevada.com/learning/image/9yarfks2TUMxz7_W6Ae7ZFW7.jpg',
  'trading-psychology-discipline': 'https://app.tradevada.com/learning/image/zpTZpP-rA2PllTvq7UBQJzzj.jpg',
  'best-stocks-for-wheel-strategy': 'https://app.tradevada.com/learning/image/7neMDvgSe32G87L87NnNU50L.jpg',
  'annualized-return-cash-secured-puts': 'https://tradevada.com/img/blog/annualized-return-cash-secured-puts.jpg',
  'wheel-strategy-explained': 'https://tradevada.com/img/blog/wheel-strategy-explained.jpg',
  'position-sizing': 'https://app.tradevada.com/learning/image/2osjRh2407_almP_sdKntTPM.jpg',
  'cutting-losers-fast': 'https://app.tradevada.com/learning/image/YR7Rx1Hd0-yQ0psAD7Q46Ijf.jpg',
  'greeks-in-plain-english': 'https://app.tradevada.com/learning/image/CM7HmwpdQTcpCX_ejGBxn8Jj.jpg',
  'volatility-cycles': 'https://app.tradevada.com/learning/image/SmVC7t69lSADBuAKVmvYYBxA.jpg',
  'reading-earnings-reports': 'https://app.tradevada.com/learning/image/jJxEP0PBgOzYEOg5vqtHJRp7.jpg',
  'fed-cpi-nfp-macro-data': 'https://app.tradevada.com/learning/image/7pHt76PCPKiP1Jo9eB6ybNGz.jpg',
  'journaling-done-right': 'https://app.tradevada.com/learning/image/f6lHAGj5l-J9WMViAC6B2-nO.jpg',
  'strike-selection': 'https://app.tradevada.com/learning/image/RYMMR-pgFGA9-qdMDgXHyOYc.jpg',
  'sector-rotation': 'https://app.tradevada.com/learning/image/SSWNf1q69kfugBVyfjC8mfHU.jpg',
  'dividend-ladder': 'https://app.tradevada.com/learning/image/ZisZdr6OotNJ_MMslNGxmqI1.jpg',
  'yield-curve-inversion': 'https://app.tradevada.com/learning/image/p1zzl1YhFzk0oD1GD4QWVeiX.jpg',
  'revenge-trading': 'https://app.tradevada.com/learning/image/svpCLXB5SOqFqYukZbyAEO21.jpg',
  'sizing-up-after-winning': 'https://app.tradevada.com/learning/image/yl-pnuJkrZtHMW8aplpfD0aw.jpg',
  'paper-vs-small-real-money': 'https://app.tradevada.com/learning/image/saNiGPCQnM5rnmbxIgCd_ind.jpg',
  'rolling-options': 'https://app.tradevada.com/learning/image/tZeOckVPwLi_t5XnlodBH72i.jpg',
};

function fetchBuffer(url, redirects) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('too many redirects'));
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 tradevada-cover-sync' } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).toString();
        return resolve(fetchBuffer(next, redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(IMG, { recursive: true });
  const slugs = Object.keys(COVERS);
  let ok = 0, fail = 0;
  for (const slug of slugs) {
    const dest = path.join(IMG, slug + '.jpg');
    try {
      const buf = await fetchBuffer(COVERS[slug], 0);
      if (buf.length < 1000) throw new Error('suspiciously small (' + buf.length + ' bytes)');
      fs.writeFileSync(dest, buf);
      ok++;
      console.log('ok    ' + slug + '  (' + buf.length + ' bytes)');
    } catch (e) {
      fail++;
      console.log('FAIL  ' + slug + '  ' + e.message);
    }
  }
  console.log('\ndone: ' + ok + ' downloaded, ' + fail + ' failed');
  const sizes = slugs.map((s) => { try { return fs.statSync(path.join(IMG, s + '.jpg')).size; } catch (e) { return 0; } });
  const unique = new Set(sizes).size;
  console.log('distinct cover sizes now: ' + unique + ' / ' + slugs.length);
  if (fail) process.exitCode = 1;
}

main();
