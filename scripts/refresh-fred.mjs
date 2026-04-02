/**
 * Fetches fresh daily FRED data and writes it to src/data/fred.json
 * Safe for CI/CD: never fails the build, keeps existing data if fetch fails.
 * Run: node scripts/refresh-fred.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, '..', 'src', 'data', 'fred.json');

const SERIES = {
  dollar: 'DTWEXBGS',
  gold: 'PCU21222122',
  oil: 'DCOILBRENTEU',
  treasury: 'T10Y2Y',
  vix: 'VIXCLS',
  forex: 'DEXUSEU',
};

async function fetchCSV(id) {
  const today = new Date().toISOString().slice(0, 10);
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=2020-01-01&coed=${today}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000); // 12s timeout per series
  try {
    const r = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
    });
    const text = await r.text();
    if (text.startsWith('<!') || text.includes('<html')) {
      throw new Error(`Got HTML instead of CSV for ${id}`);
    }
    const lines = text.trim().split('\n').slice(1);
    const points = lines.reduce((arr, line) => {
      const [dateStr, valStr] = line.split(',');
      if (valStr && valStr !== '.' && !Number.isNaN(parseFloat(valStr))) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const dim = new Date(y, m, 0).getDate();
        arr.push({
          year: +(y + (m - 1 + (d - 1) / dim) / 12).toFixed(6),
          value: parseFloat(valStr),
          date: dateStr,
        });
      }
      return arr;
    }, []);
    if (points.length === 0) throw new Error(`Empty dataset for ${id}`);
    return points.sort((a, b) => a.year - b.year);
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  // Load existing fallback so we only overwrite series that succeed
  let existing = {};
  if (existsSync(OUT_PATH)) {
    try { existing = JSON.parse(readFileSync(OUT_PATH, 'utf-8')); } catch {}
  }

  const result = { ...existing }; // start with existing data
  let updated = 0;

  for (const [key, id] of Object.entries(SERIES)) {
    try {
      const data = await fetchCSV(id);
      result[key] = data;
      updated++;
      console.log(`✓ ${key} (${id}): ${data.length} data points`);
      // Delay between requests to avoid rate-limiting
      await new Promise((r) => setTimeout(r, 1000));
    } catch (e) {
      const existingCount = existing[key]?.length || 0;
      console.warn(`⚠ ${key} (${id}): ${e.message} — keeping existing (${existingCount} pts)`);
    }
  }

  if (updated === 0) {
    console.warn('\n⚠ No series updated — keeping existing fred.json unchanged');
    return;
  }

  writeFileSync(OUT_PATH, JSON.stringify(result, null, 0));
  const sizeKB = (Buffer.byteLength(JSON.stringify(result)) / 1024).toFixed(1);
  console.log(`\n✓ Wrote ${OUT_PATH} (${sizeKB} KB, ${updated}/${Object.keys(SERIES).length} series updated)`);
}

main().catch((err) => {
  console.warn('⚠ refresh-fred error (non-fatal):', err.message);
  // Never exit(1) — let the build continue with existing fred.json
});
