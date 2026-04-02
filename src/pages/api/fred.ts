/**
 * Vercel Serverless Function — FRED Data Proxy
 * 
 * Fetches live data from the Federal Reserve Economic Data (FRED) API
 * server-side, avoiding CORS and build-IP blocks. Returns clean JSON.
 * 
 * Usage: GET /api/fred?series=DTWEXBGS,PCU21222122,DCOILBRENTEU,T10Y2Y,VIXCLS,DEXUSEU
 * 
 * Each series returns: [{ year: 2024.083, value: 123.45, date: "2024-02-01" }, ...]
 */

import type { APIRoute } from 'astro';
import fredFallback from '../../data/fred.json';

export const prerender = false; // Run as serverless function, not static

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

function parseFredCsv(csv: string): Array<{ year: number; value: number; date: string }> {
  return csv
    .trim()
    .split('\n')
    .slice(1) // skip header
    .reduce((arr: Array<{ year: number; value: number; date: string }>, line: string) => {
      const [dateStr, valStr] = line.split(',');
      if (valStr && valStr !== '.' && !isNaN(parseFloat(valStr))) {
        const [y, m] = dateStr.split('-').map(Number);
        arr.push({
          year: +(y + (m - 1) / 12).toFixed(6),
          value: parseFloat(valStr),
          date: dateStr,
        });
      }
      return arr;
    }, [])
    .sort((a, b) => a.year - b.year);
}

async function fetchSeries(id: string): Promise<Array<{ year: number; value: number; date: string }>> {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=2020-01-01&coed=2026-12-31&fq=Monthly&fam=avg`;
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/csv,text/plain,*/*',
    },
  });
  if (!resp.ok) throw new Error(`FRED HTTP ${resp.status} for ${id}`);
  const text = await resp.text();
  if (text.startsWith('<!') || text.includes('<html')) {
    throw new Error(`Got HTML instead of CSV for ${id}`);
  }
  return parseFredCsv(text);
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

  await Promise.all(
    seriesIds.map(async (id) => {
      try {
        result[id] = await fetchSeries(id.trim());
      } catch (e: any) {
        // Use static fallback data when FRED is unreachable
        const fallbackKey = SERIES_TO_FALLBACK[id];
        const fallbackData = fallbackKey ? (fredFallback as any)[fallbackKey] : null;
        if (fallbackData && fallbackData.length) {
          result[id] = fallbackData;
          usedFallback = true;
        } else {
          errors.push(`${id}: ${e.message}`);
          result[id] = [];
        }
      }
    })
  );

  return new Response(JSON.stringify({ data: result, errors, fallback: usedFallback }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200', // Cache 1h, stale OK for 2h
    },
  });
};
