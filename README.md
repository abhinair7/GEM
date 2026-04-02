# G.E.M — Geopolitical Equilibrium Model

> **Six empires cracked the same code. We reverse-engineered it.**

An interactive single-page intelligence platform that identifies the recurring geopolitical patterns behind history's greatest economic golden ages — then maps today's live data against those architectures to generate strategic playbooks.

**[Live Demo →](https://gem-website-sigma.vercel.app)**

---

## What This Demonstrates

This is not a dashboard. It's a **full-stack analytical engine** built from scratch — no charting libraries, no UI kits, no templates.

| Capability | Implementation |
|---|---|
| **Server-side data pipelines** | 6 FRED API series fetched at build time (Astro frontmatter), parsed from CSV, embedded as typed JSON |
| **Custom data visualisation** | 6 distinct Canvas 2D chart types — area, bar, lollipop, dot plot, stepped area, zero-crossing spread — all hand-coded |
| **LLM integration** | Cerebras AI (Qwen 3 235B) generates strategic playbooks, threat briefings, fragility analyses, and era intelligence flashcards |
| **Live data feed** | GDELT Conflict API → real-time event stream with pillar impact scoring |
| **Dimensionality reduction** | PCA eigenvector projection mapping 6 historical eras + user position into 2D space |
| **Interactive simulation** | 4-axis slider engine with Euclidean distance clustering to nearest historical analogue |
| **Animation system** | GSAP + ScrollTrigger — cinematic curtain reveal, scroll-driven transitions |
| **Responsive design** | Full mobile/tablet support with adaptive grid layouts |

---

## Architecture

```
                    ┌─────────────────────────────────────┐
                    │          BUILD TIME (Server)         │
                    │                                      │
                    │  Astro Frontmatter                   │
                    │  ├── FRED CSV API × 5 series         │
                    │  ├── FRED Exchange Rate (DEXUSEU)    │
                    │  └── Parse → JSON → define:vars      │
                    └──────────────┬──────────────────────┘
                                   │ embedded data
                    ┌──────────────▼──────────────────────┐
                    │          CLIENT (Browser)            │
                    │                                      │
                    │  Canvas 2D Engine                    │
                    │  ├── drawAreaChart()                 │
                    │  ├── drawBarChart()                  │
                    │  ├── drawLollipopChart()             │
                    │  ├── drawDotPlot()                   │
                    │  ├── drawSteppedArea()               │
                    │  └── drawSpreadChart()               │
                    │                                      │
                    │  Simulation Engine                   │
                    │  ├── Euclidean clustering            │
                    │  ├── PCA projection                  │
                    │  └── Prosperity score calc           │
                    │                                      │
                    │  AI Layer (Cerebras API)             │
                    │  ├── Strategic playbooks             │
                    │  ├── Threat briefings                │
                    │  ├── Fragility analysis              │
                    │  └── Era intelligence synthesis      │
                    │                                      │
                    │  Live Feed (GDELT + GNews)           │
                    │  └── Conflict event stream           │
                    └─────────────────────────────────────┘
```

---

## Data Sources

| Indicator | FRED Series | Frequency | Chart Type |
|---|---|---|---|
| Trade-Weighted Dollar Index | `DTWEXBGS` | Monthly | Area |
| Gold Mining Output PPI | `PCU21222122` | Monthly | Bar |
| Brent Crude Oil | `DCOILBRENTEU` | Monthly | Stepped Area |
| 10Y–2Y Treasury Spread | `T10Y2Y` | Monthly | Zero-Crossing Spread |
| CBOE Volatility Index (VIX) | `VIXCLS` | Monthly | Lollipop |
| USD/EUR Exchange Rate | `DEXUSEU` | Monthly | Dot Plot + MA |

Historical baselines: Maddison Project Database (2020), Broadberry & Gupta (2006), Bolt & van Zanden (2020).

---

## The Six Architectures

The model maps any geopolitical configuration to the closest of six historical "Golden Ages" — each representing a distinct strategy for converting instability into prosperity:

| Era | Period | Core Logic |
|---|---|---|
| **Pax Romana** | 27 BC – 180 AD | Imperial monopoly on violence → trade stability |
| **Song Dynasty** | 960 – 1279 AD | Technology-led growth despite military weakness |
| **Italian Renaissance** | 1450 – 1600 | Elite competition → cultural/financial innovation |
| **Roaring Twenties** | 1920s USA | Credit expansion + consumer confidence |
| **Golden Age USA** | 1950s | Security umbrella → broad-based middle-class growth |
| **Information Age** | 1990s Global | Network effects + globalisation arbitrage |

---

## Tech Stack

- **Framework:** [Astro](https://astro.build) 4.16 (static output)
- **Styling:** Tailwind CSS 3.4 + custom CSS design system
- **Charts:** Canvas 2D API (zero dependencies — all chart types hand-coded)
- **Animation:** GSAP 3.12 + ScrollTrigger
- **AI:** Cerebras Cloud API (Qwen 3 235B Instruct)
- **Data:** Federal Reserve FRED API, GDELT, GNews
- **Deployment:** Vercel (static adapter)
- **Fonts:** Inter + Newsreader (variable)

---

## Run Locally

```bash
git clone https://github.com/abhinair7/GEM.git
cd GEM
npm install
npm run dev
# → http://localhost:4321
```

Build for production:

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── pages/
│   └── index.astro          # Single-page app (~2100 lines)
│                             #   ├── Frontmatter: server-side FRED fetching
│                             #   ├── HTML: splash, thesis, feed, eras, sim, analysis
│                             #   └── Script: engine, charts, AI, GDELT
├── components/               # Layout components
├── data/
│   └── eras.ts              # Historical era profiles & economic baselines
├── layouts/
│   └── BaseLayout.astro     # HTML shell, font loading, GSAP CDN
├── styles/
│   └── global.css           # Full design system (~600 lines)
└── env.d.ts
```

---

## Author

**Abhishek Nair**

Built as a demonstration of full-stack data engineering, live API integration, custom visualisation, and AI-augmented analytical product design.

---

<sub>Data refreshes on each build. All FRED data is public domain. AI-generated content is marked as such in the interface. No financial advice is implied.</sub>
