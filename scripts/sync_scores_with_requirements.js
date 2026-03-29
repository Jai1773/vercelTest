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

let updated = 0;

for (const g of games) {
  if (!g || !g.name) continue;
  g.scores = g.scores || {};
  g.scores.minimum = g.scores.minimum || {};
  g.scores.recommended = g.scores.recommended || {};

  const minCpu = g.requirements && g.requirements.minimum && g.requirements.minimum.cpu;
  const recCpu = g.requirements && g.requirements.recommended && g.requirements.recommended.cpu;
  const minGpu = g.requirements && g.requirements.minimum && g.requirements.minimum.gpu;
  const recGpu = g.requirements && g.requirements.recommended && g.requirements.recommended.gpu;

  if (minCpu && cpuMap[minCpu]) {
    g.scores.minimum.cpuScore = cpuMap[minCpu];
  }
  if (recCpu && cpuMap[recCpu]) {
    g.scores.recommended.cpuScore = cpuMap[recCpu];
  }
  if (minGpu && gpuMap[minGpu]) {
    g.scores.minimum.gpuScore = gpuMap[minGpu];
  }
  if (recGpu && gpuMap[recGpu]) {
    g.scores.recommended.gpuScore = gpuMap[recGpu];
  }

  updated++;
}

fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2), 'utf8');
console.log(`Synced scores for ${updated} games.`);
