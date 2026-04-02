/**
 * Fetch FRED + forex data and save as a static JSON file.
 * Run: node scripts/refresh-data.mjs
 * 
 * This generates src/data/fred.json which is imported at build time.
 * Decouples the build from FRED API availability (Vercel's IPs get blocked).
 */

const fs = await import('node:fs');
const path = await import('node:path');

function parseFredCsv(csv) {
  return csv.trim().split('\n').slice(1).reduce((arr, line) => {
    const [dateStr, valStr] = line.split(',');
    if (valStr && valStr !== '.' && !isNaN(parseFloat(valStr))) {
      const [y, m] = dateStr.split('-').map(Number);
      arr.push({ year: +(y + (m - 1) / 12).toFixed(6), value: parseFloat(valStr), date: dateStr });
    }
    return arr;
  }, []).sort((a, b) => a.year - b.year);
}

async function fetchFredSeries(id) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=2020-01-01&coed=2026-12-31&fq=Monthly&fam=avg`;
  console.log(`  Fetching ${id}...`);
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GEM-Model/3.2)' },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${id}`);
  const text = await resp.text();
  if (text.startsWith('<!')) throw new Error(`Got HTML for ${id}`);
  const data = parseFredCsv(text);
  console.log(`  ✓ ${id}: ${data.length} observations`);
  return data;
}

console.log('Refreshing FRED data...\n');

const [dollar, gold, oil, treasury, vix, forex] = await Promise.all([
  fetchFredSeries('DTWEXBGS'),
  fetchFredSeries('PCU21222122'),
  fetchFredSeries('DCOILBRENTEU'),
  fetchFredSeries('T10Y2Y'),
  fetchFredSeries('VIXCLS'),
  fetchFredSeries('DEXUSEU'),
]);

const data = { dollar, gold, oil, treasury, vix, forex };
const total = Object.values(data).reduce((s, a) => s + a.length, 0);

const outPath = path.default.join(process.cwd(), 'src', 'data', 'fred.json');
fs.default.writeFileSync(outPath, JSON.stringify(data));

console.log(`\n✦ Saved ${total} total observations to src/data/fred.json`);
console.log(`  File size: ${(fs.default.statSync(outPath).size / 1024).toFixed(1)} KB`);
