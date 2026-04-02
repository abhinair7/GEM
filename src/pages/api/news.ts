/**
 * Vercel Serverless Function — GDELT News Proxy
 * 
 * Fetches real-time geopolitical news from the GDELT Project API.
 * No API key required. Returns English-language articles about US-Iran.
 * 
 * Usage: GET /api/news
 * Returns: { articles: [{ title, desc, url, time, domain }], source: "gdelt" }
 */

import type { APIRoute } from 'astro';

export const prerender = false;

const GDELT_URL = 'https://api.gdeltproject.org/api/v2/doc/doc?query=iran%20united%20states%20sourcelang:english&mode=ArtList&maxrecords=10&format=json&sort=DateDesc';

function parseGdeltDate(seendate: string): string {
  // "20260402T171500Z" → ISO string
  if (!seendate || seendate.length < 15) return new Date().toISOString();
  const y = seendate.slice(0, 4);
  const m = seendate.slice(4, 6);
  const d = seendate.slice(6, 8);
  const h = seendate.slice(9, 11);
  const min = seendate.slice(11, 13);
  const s = seendate.slice(13, 15);
  return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
}

export const GET: APIRoute = async () => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    
    const resp = await fetch(GDELT_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'GEM-TheatreMonitor/1.0' },
    });
    clearTimeout(timer);
    
    if (!resp.ok) throw new Error(`GDELT HTTP ${resp.status}`);
    
    const data = await resp.json();
    const articles = (data.articles || []).map((a: any) => ({
      title: a.title?.trim() || 'Untitled',
      desc: a.domain ? `Source: ${a.domain}` : '',
      url: a.url || '',
      time: parseGdeltDate(a.seendate),
      domain: a.domain || '',
    }));

    return new Response(JSON.stringify({ articles, source: 'gdelt' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5-min cache
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ articles: [], source: 'error', error: e.message }), {
      status: 200, // Don't return 500 — let client fall back gracefully
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
