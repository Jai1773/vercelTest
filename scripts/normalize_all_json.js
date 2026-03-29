const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'assets', 'data');
const cpuPath = path.join(dataDir, 'cpu.json');
const gpuPath = path.join(dataDir, 'gpu.json');
const gamesPath = path.join(dataDir, 'games.json');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function writeJson(p, v) { fs.writeFileSync(p, JSON.stringify(v, null, 2), 'utf8'); }

const cpuMap = readJson(cpuPath);
const gpuMap = readJson(gpuPath);
const games = readJson(gamesPath);

const cpuKeys = Object.keys(cpuMap);
const gpuKeys = Object.keys(gpuMap);

function normalizeStr(s) {
  if (!s || typeof s !== 'string') return '';
  return s
    .replace(/\([^)]*\)/g, '')         // remove parentheses
    .replace(/GB/gi, '')                 // remove GB markers
    .replace(/[^a-z0-9\- ]/gi, ' ')     // keep alnum, dash
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function findBestMatch(name, keys) {
  if (!name) return null;
  const n = normalizeStr(name);
  // exact normalized match
  for (const k of keys) if (normalizeStr(k) === n) return k;
  // contains / token match (prefer longest key match)
  let candidates = keys.filter(k => normalizeStr(k).includes(n) || n.includes(normalizeStr(k)));
  if (candidates.length) return candidates.sort((a,b)=>b.length-a.length)[0];
  // numeric substring match
  const nums = n.match(/\d{3,}/g) || [];
  if (nums.length) {
    for (const num of nums) {
      const found = keys.find(k => normalizeStr(k).includes(num));
      if (found) return found;
    }
  }
  // token overlap score
  const tokens = n.split(' ');
  let best = null; let bestScore = 0;
  for (const k of keys) {
    const kt = normalizeStr(k).split(' ');
    const score = tokens.reduce((s,t)=> s + (kt.includes(t) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = k; }
  }
  if (bestScore > 0) return best;
  return null;
}

function parseRam(r) {
  if (!r) return null;
  if (typeof r === 'number') return r;
  const m = String(r).match(/(\d+)\s*GB/i);
  if (m) return parseInt(m[1], 10);
  const n = String(r).match(/(\d+)/);
  return n ? parseInt(n[1], 10) : null;
}

let fixed = 0;

for (const g of games) {
  if (!g || !g.name) continue;
  g.requirements = g.requirements || {};
  g.scores = g.scores || {};
  g.requirements.minimum = g.requirements.minimum || {};
  g.requirements.recommended = g.requirements.recommended || {};
  g.scores.minimum = g.scores.minimum || {};
  g.scores.recommended = g.scores.recommended || {};

  // normalize CPU names
  const minCpuOriginal = g.requirements.minimum.cpu;
  const recCpuOriginal = g.requirements.recommended.cpu;
  const minCpu = findBestMatch(minCpuOriginal, cpuKeys) || minCpuOriginal;
  const recCpu = findBestMatch(recCpuOriginal, cpuKeys) || recCpuOriginal || minCpu;
  if (minCpu) g.requirements.minimum.cpu = minCpu;
  if (recCpu) g.requirements.recommended.cpu = recCpu;

  // normalize GPU names
  const minGpuOriginal = g.requirements.minimum.gpu;
  const recGpuOriginal = g.requirements.recommended.gpu;
  const minGpu = findBestMatch(minGpuOriginal, gpuKeys) || minGpuOriginal;
  const recGpu = findBestMatch(recGpuOriginal, gpuKeys) || recGpuOriginal || minGpu;
  if (minGpu) g.requirements.minimum.gpu = minGpu;
  if (recGpu) g.requirements.recommended.gpu = recGpu;

  // Ram
  const minRamParsed = parseRam(g.requirements.minimum.ram) || parseRam(g.scores.minimum && g.scores.minimum.ram) || 8;
  const recRamParsed = parseRam(g.requirements.recommended.ram) || parseRam(g.scores.recommended && g.scores.recommended.ram) || Math.max(minRamParsed, 16);
  g.requirements.minimum.ram = `${minRamParsed} GB`;
  g.requirements.recommended.ram = `${recRamParsed} GB`;
  g.scores.minimum.ram = minRamParsed;
  g.scores.recommended.ram = recRamParsed;

  // Storage defaults
  if (!g.requirements.minimum.storage) g.requirements.minimum.storage = 'Unknown';
  if (!g.requirements.recommended.storage) g.requirements.recommended.storage = g.requirements.minimum.storage;

  // assign cpu/gpu scores from maps where possible
  const mappedMinCpu = g.requirements.minimum.cpu && cpuMap[g.requirements.minimum.cpu];
  const mappedRecCpu = g.requirements.recommended.cpu && cpuMap[g.requirements.recommended.cpu];
  const mappedMinGpu = g.requirements.minimum.gpu && gpuMap[g.requirements.minimum.gpu];
  const mappedRecGpu = g.requirements.recommended.gpu && gpuMap[g.requirements.recommended.gpu];

  if (mappedMinCpu) g.scores.minimum.cpuScore = mappedMinCpu;
  if (mappedRecCpu) g.scores.recommended.cpuScore = mappedRecCpu;
  if (mappedMinGpu) g.scores.minimum.gpuScore = mappedMinGpu;
  if (mappedRecGpu) g.scores.recommended.gpuScore = mappedRecGpu;

  // fallback: if scores missing but numeric scores exist elsewhere, keep them
  if (!g.scores.minimum.cpuScore && g.scores.minimum && g.scores.minimum.cpuScore) g.scores.minimum.cpuScore = g.scores.minimum.cpuScore;
  if (!g.scores.minimum.gpuScore && g.scores.minimum && g.scores.minimum.gpuScore) g.scores.minimum.gpuScore = g.scores.minimum.gpuScore;

  fixed++;
}

writeJson(gamesPath, games);
console.log(`Normalized ${fixed} game entries and updated ${gamesPath}`);
