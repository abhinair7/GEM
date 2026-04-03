/**
 * Vercel Serverless Function — GDELT News Proxy
 *
 * Fetches real-time geopolitical news from the GDELT Project API.
 * No API key required. Returns English-language articles about US-Iran.
 *
 * Uses multiple GDELT theme filters + keyword queries for high-relevance results.
 * Falls back to broader geopolitical query if primary returns insufficient articles.
 *
 * Usage: GET /api/news
 * Returns: { articles: [{ title, desc, url, time, domain }], source: "gdelt" | "gdelt-broad" }
 */

import type { APIRoute } from 'astro';

export const prerender = false;

// Primary: Tight Iran-US focused query
const GDELT_PRIMARY = 'https://api.gdeltproject.org/api/v2/doc/doc?' +
  'query=(iran OR tehran OR persian OR hormuz OR irgc) (united states OR washington OR pentagon OR sanctions OR nuclear)' +
  ' sourcelang:english' +
  '&mode=ArtList&maxrecords=12&format=json&sort=DateDesc';

// Fallback: Broader Middle East geopolitics
const GDELT_FALLBACK = 'https://api.gdeltproject.org/api/v2/doc/doc?' +
  'query=(iran OR sanctions OR nuclear OR missile OR hormuz) sourcelang:english' +
  '&mode=ArtList&maxrecords=12&format=json&sort=DateDesc';

function parseGdeltDate(seendate: string): string {
  if (!seendate || seendate.length < 15) return new Date().toISOString();
  const y = seendate.slice(0, 4);
  const m = seendate.slice(4, 6);
  const d = seendate.slice(6, 8);
  const h = seendate.slice(9, 11);
  const min = seendate.slice(11, 13);
  const s = seendate.slice(13, 15);
  return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
}

/** Filter out irrelevant articles by checking title keywords */
function isRelevant(title: string): boolean {
  const t = title.toLowerCase();
  const keywords = [
    'iran', 'tehran', 'persian', 'hormuz', 'irgc', 'khamenei', 'rouhani', 'pezeshkian',
    'sanction', 'nuclear', 'missile', 'drone', 'military', 'pentagon', 'navy',
    'oil', 'crude', 'energy', 'opec', 'gulf', 'middle east', 'diplomacy', 'diplomat',
    'hezbollah', 'houthi', 'proxy', 'israel', 'saudi', 'strait', 'enrichment',
    'geopolit', 'conflict', 'escalat', 'de-escalat', 'ceasefire', 'war', 'attack',
    'defense', 'defence', 'weapon', 'arsenal', 'uranium', 'centrifuge', 'jcpoa',
    'red sea', 'yemen', 'syria', 'iraq', 'lebanon', 'cyber', 'tariff', 'trade war',
  ];
  return keywords.some(kw => t.includes(kw));
}

async function fetchGdelt(url: string, timeoutMs = 28000): Promise<any[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'GEM-TheatreMonitor/1.0' },
    });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`GDELT HTTP ${resp.status}`);
    const data = await resp.json();
    return data.articles || [];
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

export const GET: APIRoute = async () => {
  try {
    // Try primary query first
    let articles = await fetchGdelt(GDELT_PRIMARY);
    let source = 'gdelt';

    // Filter for relevance
    let relevant = articles.filter((a: any) => isRelevant(a.title || ''));

    // If insufficient relevant results, try broader query
    if (relevant.length < 3) {
      try {
        const broadArticles = await fetchGdelt(GDELT_FALLBACK);
        const broadRelevant = broadArticles.filter((a: any) => isRelevant(a.title || ''));
        // Merge, deduplicate by URL
        const seen = new Set(relevant.map((a: any) => a.url));
        broadRelevant.forEach((a: any) => {
          if (!seen.has(a.url)) { relevant.push(a); seen.add(a.url); }
        });
        source = 'gdelt-broad';
      } catch { /* ignore fallback failure */ }
    }

    // Take top 8, format for client
    const formatted = relevant.slice(0, 8).map((a: any) => ({
      title: a.title?.trim().replace(/ - [^-]+$/, '') || 'Untitled', // Strip trailing source
      desc: a.domain ? `Source: ${a.domain}` : '',
      url: a.url || '',
      time: parseGdeltDate(a.seendate),
      domain: a.domain || '',
    }));

    return new Response(JSON.stringify({ articles: formatted, source, count: formatted.length }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // 10-min cache (GDELT is slow ~20s)
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ articles: [], source: 'error', error: e.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
