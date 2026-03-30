import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { CheckCircle2, DollarSign, Plane, Shield, Star, Sun, Thermometer, TrendingUp, Clock, Wifi } from 'lucide-react';

const COMPARISON = [
  {
    category: 'Daily Cost for Tourists',
    icon: DollarSign,
    egypt: { score: 5, points: ['Budget meal: €2–4', 'Taxi: €1–3 per trip', 'Hotel 3-star: €20–50/night', 'Activity (diving, desert): €8–20', 'SIM card 15GB: €2.50'] },
    dubai: { score: 2, points: ['Budget meal: €12–22', 'Taxi: €8–18 per trip', 'Hotel 3-star: €80–180/night', 'Activity: €50–150', 'SIM card: €12–20'] },
    turkey: { score: 4, points: ['Budget meal: €4–9', 'Taxi: €3–8 per trip', 'Hotel 3-star: €28–70/night', 'Activity: €15–40', 'SIM card 15GB: €5–8'] },
    verdict: '🇪🇬 Egypt wins',
    note: 'Egypt is 3–5x cheaper than Dubai and 1.5–2x cheaper than Turkey. Your holiday budget goes dramatically further.',
  },
  {
    category: 'Flight Availability & Price',
    icon: Plane,
    egypt: { score: 4, points: ['Charter flights EU: €120–350 return', 'Direct from UK, Germany, Poland, Russia', 'Budget airlines: Ryanair, Wizz Air, EasyJet', 'Current status: All routes operating normally'] },
    dubai: { score: 5, points: ['Emirates hub — excellent global coverage', 'Tickets: €400–900 return from EU', 'Most expensive of the three', 'Status: Excellent — premium connections'] },
    turkey: { score: 5, points: ['Turkish Airlines — largest network in Europe', 'Budget options: €80–250 from EU', 'Competitive connections from everywhere', 'Status: Excellent — major hub'] },
    verdict: '🇪🇬 Egypt (price) / 🇦🇪 Dubai (frequency)',
    note: 'Egypt offers the cheapest charter and budget flights from Europe. Dubai and Turkey win for global connectivity.',
  },
  {
    category: 'Beach & Water Quality',
    icon: Sun,
    egypt: { score: 5, points: ['Red Sea visibility: 20–40m', 'Water temp 22–28°C year-round', 'Coral reef ecosystems — world top-10', 'No jellyfish issues', 'Warm even in December'] },
    dubai: { score: 3, points: ['Persian Gulf — murky water, limited reef', 'Artificial beach islands (Palm Jumeirah)', 'Jellyfish common in summer', 'Very hot June–September (40°C+)'] },
    turkey: { score: 4, points: ['Mediterranean and Aegean coastlines', 'Clear blue water in southwest (Bodrum, Fethiye)', 'Good conditions May–October only', 'Can be crowded in peak season'] },
    verdict: '🇪🇬 Egypt — no contest for diving/snorkeling',
    note: 'For underwater quality and year-round warmth, Egypt\'s Red Sea is objectively in a different league from Dubai or Turkey.',
  },
  {
    category: 'Safety for Tourists Right Now',
    icon: Shield,
    egypt: { score: 4, points: ['Resort zones: heavily secured 24h', 'Tourist police at all major sites', 'Main risk: scams (not violence)', '15.7M visitors safely in 2024', 'No incidents in tourist areas'] },
    dubai: { score: 5, points: ['Lowest crime rate in the world', 'Strict law enforcement', 'Ultra-safe, fully predictable', 'Well-regulated, transparent system'] },
    turkey: { score: 4, points: ['Generally safe for tourists', 'Pickpocketing in Istanbul bazaars', 'Some political protests (avoid)', 'Earthquake risk in parts of the country'] },
    verdict: '🇦🇪 Dubai (most predictable)',
    note: 'Dubai is the most controlled environment. Egypt and Turkey are comparable — both safe for tourists who stay aware.',
  },
  {
    category: 'Historical & Cultural Depth',
    icon: Star,
    egypt: { score: 5, points: ['7,000 years of documented civilization', 'Pyramids, Karnak, Abu Simbel, Valley of Kings', 'Living Nubian culture in Aswan', 'Authentic local food culture'] },
    dubai: { score: 1, points: ['50-year-old city', 'Mostly luxury malls and modern architecture', 'Very limited local culture access', 'Highly international — little "local" remains'] },
    turkey: { score: 5, points: ['Byzantine, Ottoman, Roman, Greek history', 'Istanbul, Cappadocia, Ephesus, Pamukkale', 'Rich, diverse food culture', 'Unique East-West cultural blend'] },
    verdict: '🇪🇬 Egypt & 🇹🇷 Turkey',
    note: 'Egypt and Turkey both offer extraordinary historical depth. Dubai is a modern lifestyle destination, not a cultural one.',
  },
  {
    category: 'Current Stability (2026)',
    icon: Thermometer,
    egypt: { score: 4, points: ['Stable government since 2014', 'Tourist areas unaffected by regional tensions', 'Active tourism recovery — on track for record year', 'UK FCO: Normal precautions for tourist cities'] },
    dubai: { score: 5, points: ['Fully stable — no travel advisories', 'Business and tourism as usual', 'Very predictable environment', 'Zero regional conflict proximity'] },
    turkey: { score: 4, points: ['Generally stable', 'Inflation affecting pricing (good for visitors)', 'EU tourists welcome — visa-free for most', 'Lira weakness benefits foreign visitors'] },
    verdict: '🇦🇪 Dubai (most stable)',
    note: 'Dubai is the most politically stable. Egypt and Turkey are both safe for tourist areas right now in 2026.',
  },
  {
    category: 'Internet & Connectivity',
    icon: Wifi,
    egypt: { score: 4, points: ['4G: Vodafone, Orange, Etisalat, WE', '15GB SIM from €2.50 (official store)', 'Good coverage in resort cities', 'VoIP and WhatsApp work fully'] },
    dubai: { score: 5, points: ['World-class 5G coverage', 'VoIP calls partially restricted', 'Very expensive SIM (€12–20)', 'Fastest internet in the region'] },
    turkey: { score: 4, points: ['Good 4G coverage', 'Some social media restrictions historically', '15GB SIM: €5–8', 'Good in major cities, weaker in rural areas'] },
    verdict: '🇦🇪 Dubai (speed) / 🇪🇬 Egypt (value)',
    note: 'Egypt offers the cheapest data package of the three — 15GB for €2.50. Dubai has the fastest speeds but restricts VoIP.',
  },
  {
    category: 'Speed of Booking',
    icon: Clock,
    egypt: { score: 5, points: ['Visa on arrival ($25 USD) — no pre-booking', 'Free Sinai-only visa for most nationalities', 'Hotels rarely sell out (except Nov–Jan)', 'Last-minute deals: hotels drop 40–60%'] },
    dubai: { score: 4, points: ['Visa on arrival for most EU nationalities', 'Hotels often booked far in advance', 'Premium properties sell out fast', 'Tourist tax adds to last-minute cost'] },
    turkey: { score: 5, points: ['Visa-free for EU citizens', 'Last-minute deals available', 'Wide range of accommodation options', 'Easy to book within 48 hours'] },
    verdict: '🇪🇬 Egypt & 🇹🇷 Turkey',
    note: 'Egypt and Turkey are the most last-minute-friendly. A full Egypt trip can be booked and departed within 48 hours.',
  },
];

const SCORE_DOTS = (score) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`w-2 h-2 rounded-full ${i <= score ? 'bg-accent' : 'bg-border'}`} />
    ))}
  </div>
);

const BUDGET_TABLE = [
  ['Return flights (EU)', '€130–280', '€350–650', '€90–230'],
  ['Hotel 7 nights (3-star)', '€140–350', '€560–1,200', '€196–490'],
  ['Food (7 days)', '€70–140', '€280–560', '€105–210'],
  ['Activities (7 days)', '€80–180', '€280–560', '€120–280'],
  ['Local transport', '€20–40', '€80–160', '€30–70'],
  ['SIM card', '€2–4', '€12–20', '€5–10'],
  ['TOTAL 7 days', '€440–990', '€1,560–3,150', '€550–1,290'],
];

const FLIGHT_STATUS = [
  { route: 'London → Hurghada / Sharm', status: 'Operating', airlines: 'EasyJet, Jet2, TUI, Thomas Cook' },
  { route: 'Berlin / Frankfurt → Hurghada', status: 'Operating', airlines: 'Condor, TUI fly, Ryanair' },
  { route: 'Warsaw / Krakow → Hurghada', status: 'Operating', airlines: 'Wizz Air, Enter Air, LOT' },
  { route: 'Moscow / St Petersburg → Hurghada', status: 'Operating', airlines: 'Ural Airlines, S7, Azur Air' },
  { route: 'Amsterdam → Sharm El Sheikh', status: 'Operating', airlines: 'TUI, Corendon, Transavia' },
  { route: 'Paris → Cairo / Hurghada', status: 'Operating', airlines: 'Air France, Transavia, Air Cairo' },
  { route: 'Rome → Hurghada', status: 'Operating', airlines: 'Neos, Blue Panorama, Alpitour' },
];

export default function EgyptVsDubai() {
  useSEO({
    title: 'Egypt vs Dubai vs Turkey 2026 — Why Egypt Right Now | Honest Comparison',
    description: 'Why Egypt is the best destination right now compared to Dubai and Turkey. Safety, costs, flights, beaches, culture. Egypt offers 3-5x more for your money. Updated March 2026.',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Why Egypt Instead of Dubai Right Now — 2026</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Honest comparison across every metric that matters. No sponsorship. No marketing. Egypt is genuinely one of the best-value travel destinations on earth right now — and most people don't know it.
        </p>
      </div>

      {/* Hero verdict */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-lg mb-3">The Short Version</h2>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <p className="text-sm"><strong>Egypt is 3–5x cheaper than Dubai</strong> for the same holiday quality — flight + hotel + food + activities.</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <p className="text-sm"><strong>Egypt's tourist areas are safe right now.</strong> Flights operating normally. 15.7M tourists in 2024.</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <p className="text-sm"><strong>Egypt's Red Sea is objectively better than the Persian Gulf</strong> for diving, snorkeling, and beach quality.</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <p className="text-sm"><strong>Egypt has 7,000 years of history.</strong> Dubai is 50 years old. Context matters.</p>
          </div>
        </div>
      </div>

      {/* Destination overview cards */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-accent/10 border-2 border-accent rounded-2xl p-4 text-center">
          <p className="text-3xl mb-2">🇪🇬</p>
          <h2 className="font-extrabold text-sm mb-1">Egypt</h2>
          <p className="text-[10px] text-muted-foreground">Best value. Best Red Sea. Ancient history. Safe.</p>
          <div className="mt-2 text-[10px] font-bold text-accent bg-accent/10 rounded-full px-2 py-0.5">⭐ BEST VALUE 2026</div>
        </div>
        <div className="bg-secondary border border-border rounded-2xl p-4 text-center">
          <p className="text-3xl mb-2">🇦🇪</p>
          <h2 className="font-extrabold text-sm mb-1">Dubai</h2>
          <p className="text-[10px] text-muted-foreground">Safest. Most predictable. 3–5x more expensive.</p>
          <div className="mt-2 text-[10px] font-bold text-muted-foreground bg-secondary rounded-full px-2 py-0.5">Luxury / Stopover</div>
        </div>
        <div className="bg-secondary border border-border rounded-2xl p-4 text-center">
          <p className="text-3xl mb-2">🇹🇷</p>
          <h2 className="font-extrabold text-sm mb-1">Turkey</h2>
          <p className="text-[10px] text-muted-foreground">Good culture. Good value. Strong flights.</p>
          <div className="mt-2 text-[10px] font-bold text-muted-foreground bg-secondary rounded-full px-2 py-0.5">Good Alternative</div>
        </div>
      </div>

      {/* Flight status */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Plane className="w-5 h-5 text-accent" />
        Current Flight Status — Egypt Routes (March 2026)
      </h2>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-10">
        <div className="px-4 py-3 bg-success/10 border-b border-success/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-success">ALL MAJOR ROUTES OPERATING NORMALLY</span>
        </div>
        <div className="divide-y divide-border/20">
          {FLIGHT_STATUS.map((f, i) => (
            <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{f.route}</p>
                <p className="text-xs text-muted-foreground">{f.airlines}</p>
              </div>
              <span className="text-[10px] font-bold bg-success text-success-foreground px-2 py-0.5 rounded-full shrink-0">{f.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category comparisons */}
      <h2 className="text-xl font-extrabold mb-4">Category-by-Category Comparison</h2>
      <div className="space-y-4 mb-10">
        {COMPARISON.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <h3 className="font-extrabold text-sm">{cat.category}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                  {cat.verdict}
                </span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border/30">
                {[
                  { label: '🇪🇬 Egypt', data: cat.egypt },
                  { label: '🇦🇪 Dubai', data: cat.dubai },
                  { label: '🇹🇷 Turkey', data: cat.turkey },
                ].map(({ label, data }) => (
                  <div key={label} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold">{label}</span>
                      {SCORE_DOTS(data.score)}
                    </div>
                    <ul className="space-y-1">
                      {data.points.map((p, j) => (
                        <li key={j} className="text-[10px] text-muted-foreground flex gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-success shrink-0 mt-0.5" />{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="px-5 py-2.5 bg-secondary/40 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">💡 {cat.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget comparison table */}
      <h2 className="text-xl font-extrabold mb-4">7-Day All-In Budget (per person, economy)</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        <div className="grid grid-cols-4 border-b border-border/30 bg-secondary/50">
          <div className="p-3 text-xs font-bold text-muted-foreground">Expense</div>
          <div className="p-3 text-xs font-bold text-accent border-l border-border/30 text-center">🇪🇬 Egypt</div>
          <div className="p-3 text-xs font-bold border-l border-border/30 text-center">🇦🇪 Dubai</div>
          <div className="p-3 text-xs font-bold border-l border-border/30 text-center">🇹🇷 Turkey</div>
        </div>
        {BUDGET_TABLE.map(([exp, eg, dxb, tr], i) => (
          <div key={i} className={`grid grid-cols-4 border-b border-border/20 last:border-0 ${i === BUDGET_TABLE.length - 1 ? 'bg-secondary/30 font-bold' : ''}`}>
            <div className="p-3 text-xs text-muted-foreground">{exp}</div>
            <div className="p-3 text-xs font-bold text-accent border-l border-border/30 text-center">{eg}</div>
            <div className="p-3 text-xs border-l border-border/30 text-center">{dxb}</div>
            <div className="p-3 text-xs border-l border-border/30 text-center">{tr}</div>
          </div>
        ))}
      </div>

      {/* Egypt-specific reasons to choose it now */}
      <h2 className="text-xl font-extrabold mb-4">Why Specifically Right Now for Egypt?</h2>
      <div className="space-y-2 mb-10">
        {[
          { emoji: '💰', title: 'EGP devaluation = more value for you', desc: 'The Egyptian pound has devalued significantly since 2022. Your euros, dollars, and pounds buy dramatically more than 3 years ago — one of the best value moments in Egypt\'s modern tourist history.' },
          { emoji: '✈️', title: 'Capacity restored — availability high', desc: 'After 2023 dips, charter capacity to Hurghada and Sharm has fully restored. Seat availability is higher than peak 2019 levels, meaning last-minute deals are everywhere.' },
          { emoji: '🏖️', title: 'Resorts investing in quality', desc: 'Post-recovery investment has upgraded resort quality. 4-star properties at 3-star prices are common — the current moment rewards travelers who do their research.' },
          { emoji: '🤿', title: 'Uncrowded dive sites', desc: 'The Red Sea dive sites are less crowded than peak 2019. Some of the world\'s best reefs with better-than-average visibility and fewer boats competing for the same spots.' },
          { emoji: '🔒', title: 'Security investment ongoing', desc: 'Egyptian authorities have significantly invested in tourist area security infrastructure since 2015. The result is measurably better tourist protection than a decade ago.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
            <span className="text-2xl shrink-0">{item.emoji}</span>
            <div>
              <p className="font-bold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Final verdict */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-lg mb-3">Honest Verdict — March 2026</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong>Choose Egypt if:</strong> you want world-class diving, ancient history, authentic food, warm weather, and 3–5x more experience per euro. Egypt right now is arguably the best combination of safety, value, and experience in the Mediterranean/Middle East region.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong>Choose Turkey if:</strong> you want a strong balance of culture, affordability, and beach — with excellent European flight connections and no language barrier in tourist areas.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Choose Dubai if:</strong> you need ultra-safe, predictable luxury, world-class shopping, or a long-haul transit hub — and budget is not a concern.
        </p>
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Full current safety assessment for 2026" to="/egypt-safe-now" />
        <SafeNextStep title="Middle East Safety Map" description="See Egypt's stability vs surrounding region" to="/middle-east-safety-map" />
        <SafeNextStep title="Last Minute Egypt — Book Fast" description="Best deals, booking guide, packing list" to="/last-minute-egypt" />
        <SafeNextStep title="Check Real Prices in Egypt" description="What everything actually costs" to="/price-checker" />
      </div>
    </div>
  );
}