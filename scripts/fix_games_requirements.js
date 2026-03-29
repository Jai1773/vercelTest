const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'assets', 'data');
const cpuPath = path.join(dataDir, 'cpu.json');
const gpuPath = path.join(dataDir, 'gpu.json');
const gamesPath = path.join(dataDir, 'games.json');

function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

const cpuMap = readJson(cpuPath);
const gpuMap = readJson(gpuPath);
const games = readJson(gamesPath);

const cpuList = Object.keys(cpuMap).map(name => ({ name, score: cpuMap[name] }))
  .sort((a,b)=>a.score-b.score);
const gpuList = Object.keys(gpuMap).map(name => ({ name, score: gpuMap[name] }))
  .sort((a,b)=>a.score-b.score);

function findClosest(list, target) {
  if (!target || typeof target !== 'number') return null;
  let best = null; let bestDiff = Infinity;
  for (const item of list) {
    const d = Math.abs(item.score - target);
    if (d < bestDiff) { bestDiff = d; best = item; }
  }
  return best ? best.name : null;
}

function normalizeRam(value, fallback) {
  if (!value && !fallback) return 'Unknown';
  if (typeof value === 'number') return `${value} GB`;
  if (typeof value === 'string') return value;
  if (fallback && typeof fallback === 'number') return `${fallback} GB`;
  return 'Unknown';
}

let changed = 0;

for (const g of games) {
  if (!g || !g.name) continue;
  g.requirements = g.requirements || {};
  g.scores = g.scores || {};
  // ensure minimum and recommended blocks
  g.requirements.minimum = g.requirements.minimum || {};
  g.requirements.recommended = g.requirements.recommended || {};

  // determine cpu by score if possible
  const minCpuScore = g.scores.minimum && g.scores.minimum.cpuScore;
  const recCpuScore = g.scores.recommended && g.scores.recommended.cpuScore;

  const cpuMinName = findClosest(cpuList, minCpuScore) || g.requirements.minimum.cpu || null;
  const cpuRecName = findClosest(cpuList, recCpuScore) || g.requirements.recommended.cpu || cpuMinName;

  if (cpuMinName) g.requirements.minimum.cpu = cpuMinName;
  if (cpuRecName) g.requirements.recommended.cpu = cpuRecName;

  // gpu
  const minGpuScore = g.scores.minimum && g.scores.minimum.gpuScore;
  const recGpuScore = g.scores.recommended && g.scores.recommended.gpuScore;
  const gpuMinName = findClosest(gpuList, minGpuScore) || g.requirements.minimum.gpu || null;
  const gpuRecName = findClosest(gpuList, recGpuScore) || g.requirements.recommended.gpu || gpuMinName;
  if (gpuMinName) g.requirements.minimum.gpu = gpuMinName;
  if (gpuRecName) g.requirements.recommended.gpu = gpuRecName;

  // ram
  const minRam = (g.scores.minimum && g.scores.minimum.ram) || parseInt((g.requirements.minimum && g.requirements.minimum.ram) || '') || null;
  const recRam = (g.scores.recommended && g.scores.recommended.ram) || parseInt((g.requirements.recommended && g.requirements.recommended.ram) || '') || null;
  g.requirements.minimum.ram = normalizeRam(g.requirements.minimum.ram, minRam);
  g.requirements.recommended.ram = normalizeRam(g.requirements.recommended.ram, recRam || minRam);

  // storage: keep existing or set to Unknown
  if (!g.requirements.minimum.storage) g.requirements.minimum.storage = g.requirements.minimum.storage || 'Unknown';
  if (!g.requirements.recommended.storage) g.requirements.recommended.storage = g.requirements.recommended.storage || g.requirements.minimum.storage || 'Unknown';

  changed++;
}

fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2), 'utf8');
console.log(`Processed ${changed} games and updated ${gamesPath}`);

if (changed === 0) process.exit(1);
