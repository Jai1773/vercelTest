const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'assets', 'data');
const gamesPath = path.join(dataDir, 'games.json');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, v) { fs.writeFileSync(p, JSON.stringify(v, null, 2), 'utf8'); }

const buckets = [2, 4, 8, 16, 32, 64];

function parseRam(r) {
  if (!r && r !== 0) return null;
  if (typeof r === 'number') return r;
  const s = String(r);
  const m = s.match(/(\d+)\s*(GB|G)*/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

function nearestBucket(n) {
  if (!n && n !== 0) return null;
  let best = buckets[0];
  let bestDiff = Math.abs(n - best);
  for (const b of buckets) {
    const d = Math.abs(n - b);
    if (d < bestDiff) { best = b; bestDiff = d; }
  }
  return best;
}

const games = readJson(gamesPath);
let updated = 0;

for (const g of games) {
  if (!g || !g.name) continue;
  g.requirements = g.requirements || {};
  g.scores = g.scores || {};
  g.requirements.minimum = g.requirements.minimum || {};
  g.requirements.recommended = g.requirements.recommended || {};
  g.scores.minimum = g.scores.minimum || {};
  g.scores.recommended = g.scores.recommended || {};

  const minRamRaw = g.requirements.minimum.ram || g.scores.minimum.ram;
  const recRamRaw = g.requirements.recommended.ram || g.scores.recommended.ram;

  const minParsed = parseRam(minRamRaw) || parseRam(g.scores && g.scores.minimum && g.scores.minimum.ram) || 8;
  const recParsed = parseRam(recRamRaw) || parseRam(g.scores && g.scores.recommended && g.scores.recommended.ram) || Math.max(minParsed, 16);

  const minBucket = nearestBucket(minParsed) || 8;
  const recBucket = nearestBucket(recParsed) || Math.max(minBucket, 16);

  g.requirements.minimum.ram = `${minBucket} GB`;
  g.requirements.recommended.ram = `${recBucket} GB`;
  g.scores.minimum.ram = minBucket;
  g.scores.recommended.ram = recBucket;

  updated++;
}

writeJson(gamesPath, games);
console.log(`Standardized RAM for ${updated} games.`);
