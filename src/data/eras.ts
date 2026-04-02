// =========================================================
// GEM — Geopolitical Equilibrium Model: Core Data
// =========================================================

export const eraProfiles = {
  romana:      { trade: 0.82, politics: 0.90, security: 0.88, benefit: 0.25 },
  song:        { trade: 0.75, politics: 0.60, security: 0.35, benefit: 0.55 },
  renaissance: { trade: 0.90, politics: 0.30, security: 0.40, benefit: 0.18 },
  twenties:    { trade: 0.65, politics: 0.50, security: 0.70, benefit: 0.12 },
  golden:      { trade: 0.60, politics: 0.85, security: 0.90, benefit: 0.72 },
  nineties:    { trade: 0.95, politics: 0.55, security: 0.65, benefit: 0.45 },
};

export const eraInfo = {
  romana: {
    name: 'Pax Romana',
    date: '27 BC – 180 AD · The Antonine Prosperity',
    desc: 'Your configuration mirrors the Roman imperial model: high political stability with strong trade integration, where prosperity concentrates through controlled commerce and military-secured routes.',
    playbook: 'U.S.–Iran Strategic Playbook: The Roman Strategy',
    strategies: [
      { title: 'Naval Presence', desc: "Project maritime dominance through carrier groups in the Persian Gulf — the modern Mare Nostrum. Control of the Strait of Hormuz mirrors Rome's control of Mediterranean choke points." },
      { title: 'Economic Sanctions', desc: 'Deploy targeted sanctions modelled on the Roman siege economy. Restrict access to global banking, oil exports, and technology transfers.' },
      { title: 'Regional Alliances', desc: 'Build a modern foederati network — binding regional allies (Gulf States, Israel) into a structured alliance of protection for trade access.' },
    ],
  },
  song: {
    name: 'Song Dynasty',
    date: '960 – 1279 AD · The Innovation Paradox',
    desc: 'High innovation and trade sophistication offset by severe military vulnerability. Prosperity flows through state capacity and economic ingenuity, but the system is structurally fragile.',
    playbook: 'U.S.–Iran Strategic Playbook: The Song Strategy',
    strategies: [
      { title: 'Economic Leverage', desc: "Use financial sophistication and trade dependency as primary tools. Restrict Iran's access to global capital markets while offering integration incentives." },
      { title: 'Diplomatic Containment', desc: 'Avoid direct military confrontation. Build concentric rings of diplomatic pressure through multilateral frameworks.' },
      { title: 'Innovation Shield', desc: 'Invest in technological superiority (cyber, energy tech) as a substitute for traditional military deterrence.' },
    ],
  },
  renaissance: {
    name: 'Italian Renaissance',
    date: '1450 – 1600 AD · The Medici Architecture',
    desc: 'Extreme financial power amid political fragmentation. Prosperity concentrates where banking, trade routes, and information asymmetry converge.',
    playbook: 'U.S.–Iran Strategic Playbook: The Renaissance Strategy',
    strategies: [
      { title: 'Financial Warfare', desc: 'Deploy the banking system as a strategic weapon — SWIFT restrictions, dollar-denominated trade barriers, and targeted asset freezes.' },
      { title: 'Balance of Power', desc: 'Play regional powers against each other (Saudi, Turkey, Israel) to prevent any single actor from dominating.' },
      { title: 'Intelligence Networks', desc: 'Invest in diplomatic intelligence and back-channel negotiations. Information asymmetry over brute force.' },
    ],
  },
  twenties: {
    name: 'Roaring Twenties',
    date: '1920s USA · The Industrial Mirage',
    desc: 'Massive industrial output and speculative growth with dangerously concentrated benefits. Prosperity is explosive but fragile — built on oil, mass production, and media narratives.',
    playbook: 'U.S.–Iran Strategic Playbook: The Industrial Strategy',
    strategies: [
      { title: 'Oil Market Control', desc: 'Dominate global energy markets through production manipulation and strategic reserves. Oil pricing = direct leverage.' },
      { title: 'Industrial Pressure', desc: 'Restrict access to industrial technology, manufacturing equipment, and supply chains.' },
      { title: 'Narrative Warfare', desc: 'Use mass media and public narrative to shape domestic and international opinion.' },
    ],
  },
  golden: {
    name: 'Golden Age USA',
    date: '1950s USA · The Containment Architecture',
    desc: 'Strong alliance discipline, broad middle-class prosperity, and military dominance to maintain global order. The most balanced architecture.',
    playbook: 'U.S.–Iran Strategic Playbook: The Containment Strategy',
    strategies: [
      { title: 'Bloc Discipline', desc: 'Strengthen the Western alliance — NATO expansion, bilateral defense pacts, intelligence sharing.' },
      { title: 'Ideological Framing', desc: 'Frame the conflict as a values competition (democracy vs. theocracy) for domestic support and allied unity.' },
      { title: 'Proxy Architecture', desc: 'Support regional partners as forward-deployed assets without direct engagement.' },
    ],
  },
  nineties: {
    name: 'The Information Age',
    date: '1990s Global · The Uni-polar Moment',
    desc: 'High trade integration, information acceleration, and multilateral frameworks. Prosperity flows through network effects but is vulnerable to asymmetric disruption.',
    playbook: 'U.S.–Iran Strategic Playbook: The Information Strategy',
    strategies: [
      { title: 'Multilateral Sanctions', desc: 'Build broad international coalitions — legitimacy through UN resolutions and allied consensus.' },
      { title: 'Information Warfare', desc: 'Deploy cyber operations, media pressure, and strategic communications to shape the environment.' },
      { title: 'Globalisation Leverage', desc: "Use Iran's dependence on global trade networks as the ultimate coercive tool." },
    ],
  },
};

export const eraColors = {
  romana: '#8b6914',
  song: '#2d6e5f',
  renaissance: '#c5a059',
  twenties: '#c4442d',
  golden: '#44474e',
  nineties: '#1a1c1b',
};

export const fallbackEvents = [
  { time: '14:32 UTC', title: 'IRGC Naval Assets Repositioned Near Strait of Hormuz', desc: 'Iranian Revolutionary Guard deploys 4 fast-attack craft to the eastern corridor. Commercial shipping rerouting.', impacts: [{ pillar: 'security', delta: -0.08, label: 'Security' }, { pillar: 'trade', delta: -0.05, label: 'Trade' }] },
  { time: '13:15 UTC', title: 'U.S. Treasury Expands SWIFT Sanctions on Iranian Banks', desc: 'Three additional Iranian financial institutions added to SDN list. European allies signal conditional support.', impacts: [{ pillar: 'trade', delta: -0.06, label: 'Trade' }, { pillar: 'politics', delta: 0.04, label: 'Politics' }] },
  { time: '11:48 UTC', title: 'GCC Emergency Session on Regional Security Framework', desc: 'Saudi Arabia and UAE call emergency consultations. Joint naval patrol proposal on the table.', impacts: [{ pillar: 'politics', delta: 0.06, label: 'Politics' }, { pillar: 'security', delta: 0.05, label: 'Security' }] },
  { time: '10:22 UTC', title: 'Brent Crude Spikes 4.2% on Hormuz Disruption Fears', desc: 'Oil futures surge. Insurers raise war-risk premiums for Gulf transit.', impacts: [{ pillar: 'trade', delta: -0.07, label: 'Trade' }, { pillar: 'benefit', delta: 0.09, label: 'Benefit' }] },
  { time: '09:05 UTC', title: 'USS Eisenhower Strike Group Deploying to 5th Fleet AOR', desc: 'Carrier strike group with 7,500 personnel. Pentagon calls it "routine repositioning."', impacts: [{ pillar: 'security', delta: 0.10, label: 'Security' }, { pillar: 'politics', delta: -0.03, label: 'Politics' }] },
  { time: '07:30 UTC', title: 'Tehran Warns of "Proportional Response" to Sanctions', desc: 'Iran Foreign Ministry issues counter-statement. Back-channel contacts via Oman ongoing.', impacts: [{ pillar: 'politics', delta: -0.05, label: 'Politics' }, { pillar: 'security', delta: -0.04, label: 'Security' }] },
  { time: '06:12 UTC', title: 'Iranian APT Groups Probing Gulf Energy Infrastructure', desc: 'NSA advisory on increased cyber operations against Saudi Aramco and ADNOC systems.', impacts: [{ pillar: 'security', delta: -0.06, label: 'Security' }, { pillar: 'trade', delta: -0.03, label: 'Trade' }] },
  { time: '04:45 UTC', title: 'European Parliament Calls for Renewed JCPOA Talks', desc: 'Non-binding resolution 412-198 urging engagement. France and Germany willing to mediate.', impacts: [{ pillar: 'politics', delta: 0.07, label: 'Politics' }, { pillar: 'trade', delta: 0.03, label: 'Trade' }] },
];

export const historicalData = [
  { era: 'Pax Romana', period: '27 BC–180 AD', gdp: '$570', trade: '18%', military: '2.5%', gini: '0.42', urban: '28%', duration: '207', pop: '55' },
  { era: 'Song Dynasty', period: '960–1279', gdp: '$600', trade: '22%', military: '6.0%', gini: '0.38', urban: '22%', duration: '319', pop: '100' },
  { era: 'Italian Renaissance', period: '1450–1600', gdp: '$1,100', trade: '35%', military: '3.5%', gini: '0.52', urban: '34%', duration: '150', pop: '12' },
  { era: 'Roaring Twenties', period: '1920–1929', gdp: '$5,900', trade: '12%', military: '1.2%', gini: '0.56', urban: '52%', duration: '9', pop: '106' },
  { era: 'Golden Age USA', period: '1947–1973', gdp: '$9,600', trade: '8%', military: '8.9%', gini: '0.35', urban: '64%', duration: '26', pop: '180' },
  { era: 'Information Age', period: '1991–2001', gdp: '$23,200', trade: '24%', military: '3.4%', gini: '0.41', urban: '77%', duration: '10', pop: '275' },
];

export const eraCards = [
  { key: 'romana', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', date: '27 BC – 180 AD', title: 'Pax Romana', pillars: 'Imperial influence, trade security, strategic route control', winner: 'Winning Layer: Imperial Elites', figure: '/figures/augustus.jpg', figureName: 'Augustus', symbol: 'The Imperial Laurel Wreath', symbolDesc: 'Imperial Stability & Strategic Control' },
  { key: 'song', image: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&q=80', date: '960 – 1279 AD', title: 'Song Dynasty', pillars: 'State capacity, containment, commerce despite threats', winner: 'Winning Layer: Gentry Scholars', figure: '/figures/taizu.jpg', figureName: 'Emperor Taizu', symbol: 'The Jiaozi', symbolDesc: 'Commercial Fluency & Sophisticated Economics' },
  { key: 'renaissance', image: 'https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=600&q=80', date: '1450 – 1600 AD', title: 'Italian Renaissance', pillars: 'Balance of power, shipping routes, finance as weapon', winner: 'Winning Layer: Merchant Princes', figure: '/figures/medici.jpg', figureName: 'Lorenzo de\' Medici', symbol: 'The Banking Ledger', symbolDesc: 'The Strategic Value of Finance' },
  { key: 'twenties', image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=600&q=80', date: '1920s USA', title: 'Roaring Twenties', pillars: 'Industrial power, oil markets, media narratives', winner: 'Winning Layer: Industrial Titans', figure: '/figures/coolidge.jpg', figureName: 'Calvin Coolidge', symbol: 'The Stock Ticker', symbolDesc: 'Industrial Output & Speculative Growth' },
  { key: 'golden', image: 'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?w=600&q=80', date: '1950s USA', title: 'The Golden Age', pillars: 'Cold War containment, alliance discipline, global order', winner: 'Winning Layer: Corporate Middle Class', figure: '/figures/eisenhower.jpg', figureName: 'Dwight D. Eisenhower', symbol: 'Alliance Plans', symbolDesc: 'Alliance Discipline & Global Containment' },
  { key: 'nineties', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', date: '1990s Global', title: 'The Information Age', pillars: 'Globalisation, multilateral sanctions, info warfare', winner: 'Winning Layer: Global Technocrats', figure: '/figures/nineties.jpg', figureName: 'The Network Architect', symbol: 'The Fiber Optic Web', symbolDesc: 'Technological Acceleration & Information Warfare' },
];

export const fragilityCards = [
  { era: 'Pax Romana', label: 'Classical Imperial', desc: "Trade route brittleness — prosperity collapses if maritime security degrades. Over-reliance on military spending creates fiscal fragility." },
  { era: 'Song Dynasty', label: 'Feudal Innovation', desc: 'Zero military scalability — economic gains cannot compensate for existential security threats. Innovation without force projection invites conquest.' },
  { era: 'Italian Renaissance', label: 'Mercantile Finance', desc: 'Currency and credit fragility — financial dominance without territorial control creates cascading collapse risk when confidence erodes.' },
  { era: 'Roaring Twenties', label: 'Industrial Leviathan', desc: 'Social volatility — mass production concentrates wealth at the top, creating speculative bubbles that can implode overnight.' },
  { era: 'Golden Age USA', label: 'Cold War Discipline', desc: 'Alliance fatigue — maintaining bloc cohesion requires constant investment. Defection from the structure erodes the entire model.' },
  { era: 'Information Age', label: 'Globalist Network', desc: 'Asymmetric vulnerability — hyper-connectivity means a single node failure propagates system-wide disruption at unprecedented speed.' },
];

export const lifecycleCurves = {
  romana:      { color: '#8b6914', pts: [[0,0.1],[10,0.3],[25,0.6],[40,0.85],[55,0.95],[70,0.9],[80,0.7],[90,0.4],[100,0.15]], label: 'Pax Romana' },
  song:        { color: '#2d6e5f', pts: [[0,0.05],[15,0.25],[30,0.55],[45,0.8],[60,0.92],[70,0.88],[80,0.65],[90,0.3],[100,0.08]], label: 'Song Dynasty' },
  renaissance: { color: '#c5a059', pts: [[0,0.08],[10,0.35],[20,0.65],[35,0.9],[50,0.98],[60,0.85],[75,0.5],[90,0.2],[100,0.05]], label: 'Renaissance' },
  twenties:    { color: '#c4442d', pts: [[0,0.15],[15,0.45],[30,0.75],[50,0.95],[60,0.98],[65,0.6],[70,0.2],[80,0.08],[100,0.05]], label: '1920s (Crash)' },
  golden:      { color: '#44474e', pts: [[0,0.1],[10,0.3],[25,0.55],[40,0.75],[55,0.88],[70,0.92],[80,0.85],[90,0.7],[100,0.55]], label: '1950s Golden' },
  nineties:    { color: '#1a1c1b', pts: [[0,0.2],[10,0.4],[25,0.6],[40,0.8],[55,0.92],[65,0.95],[75,0.88],[85,0.72],[100,0.6]], label: '1990s Info Age' },
};
