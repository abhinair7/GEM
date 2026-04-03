/**
 * Vercel Serverless Function — FRED Data Proxy
 * 
 * Fetches live data from the Federal Reserve Economic Data (FRED) API
 * server-side, avoiding CORS and build-IP blocks. Returns clean JSON.
 * 
 * Supports two data sources (auto-detected):
 *   1. Official FRED API (if FRED_API_KEY env var is set)
 *   2. FRED CSV endpoint (public, no key needed — less reliable from cloud IPs)
 * 
 * Usage: GET /api/fred?series=DTWEXBGS,PCU21222122,DCOILBRENTEU,T10Y2Y,VIXCLS,DEXUSEU
 * 
 * Each series returns: [{ year: 2024.083, value: 123.45, date: "2024-02-01" }, ...]
 */

import type { APIRoute } from 'astro';
import fredFallback from '../../data/fred.json';

export const prerender = false; // Run as serverless function, not static

const FRED_API_KEY = import.meta.env.FRED_API_KEY || '';

const ALLOWED_SERIES = new Set([
  'DTWEXBGS',      // Dollar index
  'PCU21222122',   // Gold mining PPI
  'DCOILBRENTEU',  // Brent crude oil
  'T10Y2Y',        // Treasury yield spread
  'VIXCLS',        // VIX volatility
  'DEXUSEU',       // USD/EUR exchange rate
]);

const SERIES_TO_FALLBACK: Record<string, string> = {
  DTWEXBGS: 'dollar',
  PCU21222122: 'gold',
  DCOILBRENTEU: 'oil',
  T10Y2Y: 'treasury',
  VIXCLS: 'vix',
  DEXUSEU: 'forex',
};

type DataPoint = { year: number; value: number; date: string };

function parseFredCsv(csv: string): DataPoint[] {
  return csv
    .trim()
    .split('\n')
    .slice(1) // skip header
    .reduce((arr: DataPoint[], line: string) => {
      const [dateStr, valStr] = line.split(',');
      if (valStr && valStr !== '.' && !isNaN(parseFloat(valStr))) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const dim = new Date(y, m, 0).getDate();
        arr.push({
          year: +(y + (m - 1 + (d - 1) / dim) / 12).toFixed(6),
          value: parseFloat(valStr),
          date: dateStr,
        });
      }
      return arr;
    }, [])
    .sort((a, b) => a.year - b.year);
}

function parseFredApiJson(json: any): DataPoint[] {
  if (!json?.observations) return [];
  return json.observations
    .filter((obs: any) => obs.value !== '.' && !isNaN(parseFloat(obs.value)))
    .map((obs: any) => {
      const [y, m, d] = obs.date.split('-').map(Number);
      const dim = new Date(y, m, 0).getDate();
      return {
        year: +(y + (m - 1 + (d - 1) / dim) / 12).toFixed(6),
        value: parseFloat(obs.value),
        date: obs.date,
      };
    })
    .sort((a: DataPoint, b: DataPoint) => a.year - b.year);
}

/** Small delay helper for sequential fetching */
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

/** Get today's date as YYYY-MM-DD */
function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function fetchViaApi(id: string): Promise<DataPoint[]> {
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${FRED_API_KEY}&file_type=json&observation_start=2020-01-01&observation_end=${today()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) throw new Error(`FRED API HTTP ${resp.status} for ${id}`);
    const json = await resp.json();
    return parseFredApiJson(json);
  } finally {
    clearTimeout(timer);
  }
}

async function fetchViaCsv(id: string): Promise<DataPoint[]> {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=2020-01-01&coed=${today()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/csv,text/plain,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    });
    if (!resp.ok) throw new Error(`FRED HTTP ${resp.status} for ${id}`);
    const text = await resp.text();
    if (text.startsWith('<!') || text.includes('<html')) {
      throw new Error(`Got HTML instead of CSV for ${id}`);
    }
    return parseFredCsv(text);
  } finally {
    clearTimeout(timer);
  }
}

/** Fetch a single series — tries API/CSV, falls back to build-time data */
async function fetchSeries(id: string): Promise<{ data: DataPoint[]; live: boolean }> {
  const fetcher = FRED_API_KEY ? fetchViaApi : fetchViaCsv;
  try {
    const data = await fetcher(id);
    if (data.length > 0) return { data, live: true };
  } catch { /* fall through */ }
  // Use build-time static data immediately (don't retry — saves time on Vercel)
  const fallbackKey = SERIES_TO_FALLBACK[id];
  const fallbackData = fallbackKey ? (fredFallback as any)[fallbackKey] : null;
  if (fallbackData && fallbackData.length) {
    return { data: fallbackData, live: false };
  }
  throw new Error(`No data available for ${id}`);
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const seriesParam = url.searchParams.get('series') || '';
  const seriesIds = seriesParam.split(',').filter((s) => ALLOWED_SERIES.has(s.trim()));

  if (seriesIds.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid series IDs provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result: Record<string, any> = {};
  const errors: string[] = [];
  let usedFallback = false;
  const source = FRED_API_KEY ? 'api' : 'csv';

  // Fetch all series in parallel for speed (Vercel has ~10s timeout)
  const results = await Promise.allSettled(
    seriesIds.map(id => fetchSeries(id.trim()).then(res => ({ id: id.trim(), ...res })))
  );

  for (const r of results) {
    if (r.status === 'fulfilled') {
      result[r.value.id] = r.value.data;
      if (!r.value.live) usedFallback = true;
    } else {
      const msg = r.reason?.message || 'Unknown error';
      errors.push(msg);
    }
  }

  return new Response(JSON.stringify({ data: result, errors, fallback: usedFallback, source }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
    },
  });
};
