import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { CheckCircle2, DollarSign, Plane, Shield, Star, Sun, Thermometer } from 'lucide-react';

const COMPARISON = [
  {
    category: 'Daily Cost',
    icon: DollarSign,
    egypt: { score: 5, points: ['Budget meal: €2–4', 'Taxi: €1–3 per trip', 'Hotel 3-star: €20–50/night', 'Activity: €8–20'] },
    dubai: { score: 2, points: ['Budget meal: €10–20', 'Taxi: €8–15 per trip', 'Hotel 3-star: €80–150/night', 'Activity: €50–150'] },
    turkey: { score: 4, points: ['Budget meal: €4–8', 'Taxi: €3–8 per trip', 'Hotel 3-star: €30–70/night', 'Activity: €15–40'] },
    verdict: 'Egypt',
    note: 'Egypt is 3–5x cheaper than Dubai. Turkey sits in between. Egypt offers the best value.',
  },
  {
    category: 'Flight Availability',
    icon: Plane,
    egypt: { score: 4, points: ['Charter flights EU: €150–400', 'Direct from Russia/Germany/UK', 'Budget airlines serve Sharm & Hurghada'] },
    dubai: { score: 5, points: ['Emirates hub — excellent global connections', 'More expensive tickets overall', 'Best for long-haul stopover'] },
    turkey: { score: 5, points: ['Excellent connections from all Europe', 'Turkish Airlines extensive network', 'Competitive prices from EU cities'] },
    verdict: 'Dubai/Turkey',
    note: 'Dubai and Turkey win for global connectivity. Egypt offers the best charter deals from Europe.',
  },
  {
    category: 'Beach & Water',
    icon: Sun,
    egypt: { score: 5, points: ['World-class Red Sea coral reefs', 'Water visibility 20–40m', 'Warm year-round (22–28°C)', 'Uncrowded reefs'] },
    dubai: { score: 3, points: ['Persian Gulf — limited natural reef', 'Artificial islands (Palm Jumeirah)', 'Water less clear than Red Sea', 'Extreme summer heat'] },
    turkey: { score: 4, points: ['Mediterranean & Aegean coastlines', 'Clear blue water in southwest', 'Good summer beaches', 'Crowded in peak season'] },
    verdict: 'Egypt',
    note: 'For diving and snorkeling, Egypt\'s Red Sea is objectively in a different league.',
  },
  {
    category: 'Safety for Tourists',
    icon: Shield,
    egypt: { score: 4, points: ['Resort areas heavily secured', 'Tourist police at all major sites', 'Main risk: scams not violence', '15M+ visitors safely per year'] },
    dubai: { score: 5, points: ['Very low crime rate', 'Strict enforcement', 'Ultra-safe for tourists', 'Well-regulated industry'] },
    turkey: { score: 4, points: ['Generally safe for tourists', 'Pickpocketing in busy areas', 'Earthquake risk in some regions', 'Some political tension'] },
    verdict: 'Dubai',
    note: 'Dubai is the safest of the three. Egypt and Turkey are comparable — both require standard tourist awareness.',
  },
  {
    category: 'Culture & Authenticity',
    icon: Star,
    egypt: { score: 5, points: ['7,000 years of history', 'Pyramids, Karnak, Abu Simbel', 'Living Nubian culture', 'Genuine local food'] },
    dubai: { score: 2, points: ['50-year-old city', 'Modern architecture', 'Very international — limited local culture', 'Malls and luxury brands'] },
    turkey: { score: 5, points: ['Byzantine and Ottoman history', 'Istanbul, Cappadocia, Ephesus', 'Rich food culture', 'Mix of East and West'] },
    verdict: 'Egypt/Turkey',
    note: 'Egypt and Turkey both offer exceptional historical depth. Dubai is a modern lifestyle city.',
  },
  {
    category: 'Current Situation (2026)',
    icon: Thermometer,
    egypt: { score: 4, points: ['Stable government', 'Tourist areas unaffected by regional tensions', 'Active tourism recovery', 'Some UK/EU advisories for North Sinai only'] },
    dubai: { score: 5, points: ['Fully stable', 'No travel advisories', 'Business as usual', 'Very predictable'] },
    turkey: { score: 4, points: ['Generally stable', 'Inflation affecting prices', 'EU tourists welcome', 'Lira fluctuation can benefit travelers'] },
    verdict: 'Dubai',
    note: 'Dubai is the most politically stable. Egypt and Turkey are both safe for tourist areas right now.',
  },
];

const SCORE_DOTS = (score) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`w-2 h-2 rounded-full ${i <= score ? 'bg-accent' : 'bg-border'}`} />
    ))}
  </div>
);

export default function EgyptVsDubai() {
  useSEO({
    title: 'Egypt vs Dubai vs Turkey 2026 — Honest Comparison for Tourists',
    description: 'Honest comparison of Egypt vs Dubai vs Turkey in 2026. Costs, safety, beaches, culture, flights, and current situation. Which destination gives you more for your money?',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Egypt vs Dubai vs Turkey — 2026 Honest Comparison</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Three of the most popular holiday destinations right now. No marketing. No sponsorship. Just the facts across the metrics that matter.
        </p>
      </div>

      {/* Overall cards */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        <div className="bg-accent/10 border-2 border-accent rounded-2xl p-4 text-center">
          <p className="text-2xl mb-2">🇪🇬</p>
          <h2 className="font-extrabold text-sm mb-1">Egypt</h2>
          <p className="text-[10px] text-muted-foreground">Best value. Best diving. Rich history.</p>
        </div>
        <div className="bg-secondary border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl mb-2">🇦🇪</p>
          <h2 className="font-extrabold text-sm mb-1">Dubai</h2>
          <p className="text-[10px] text-muted-foreground">Safest. Most predictable. Most expensive.</p>
        </div>
        <div className="bg-secondary border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl mb-2">🇹🇷</p>
          <h2 className="font-extrabold text-sm mb-1">Turkey</h2>
          <p className="text-[10px] text-muted-foreground">Great culture. Good value. Strong history.</p>
        </div>
      </div>

      {/* Category comparisons */}
      <h2 className="text-xl font-extrabold mb-4">Category-by-Category</h2>
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
                  Winner: {cat.verdict}
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
      <h2 className="text-xl font-extrabold mb-4">7-Day Budget (per person, economy)</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        <div className="grid grid-cols-4 border-b border-border/30 bg-secondary/50">
          <div className="p-3 text-xs font-bold text-muted-foreground">Expense</div>
          <div className="p-3 text-xs font-bold text-accent border-l border-border/30 text-center">🇪🇬 Egypt</div>
          <div className="p-3 text-xs font-bold border-l border-border/30 text-center">🇦🇪 Dubai</div>
          <div className="p-3 text-xs font-bold border-l border-border/30 text-center">🇹🇷 Turkey</div>
        </div>
        {[
          ['Flights from Europe', '€150–300', '€300–600', '€100–250'],
          ['Hotel 7 nights (3-star)', '€140–350', '€560–1,050', '€210–490'],
          ['Food daily', '€10–20/day', '€40–80/day', '€15–35/day'],
          ['Activities', '€100–200', '€300–600', '€150–300'],
          ['Local transport', '€20–40', '€80–150', '€30–60'],
          ['TOTAL', '€500–1,000', '€1,500–3,000', '€700–1,400'],
        ].map(([exp, eg, dxb, tr], i) => (
          <div key={i} className="grid grid-cols-4 border-b border-border/20 last:border-0">
            <div className="p-3 text-xs text-muted-foreground">{exp}</div>
            <div className="p-3 text-xs font-bold text-accent border-l border-border/30 text-center">{eg}</div>
            <div className="p-3 text-xs border-l border-border/30 text-center">{dxb}</div>
            <div className="p-3 text-xs border-l border-border/30 text-center">{tr}</div>
          </div>
        ))}
      </div>

      {/* Final verdict */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8 space-y-3">
        <h2 className="font-extrabold text-lg">Honest Verdict</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Choose Egypt if:</strong> you want world-class diving, ancient history, authentic food, and 3–5x more experience per euro. Egypt delivers the best bang for your travel budget.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Choose Turkey if:</strong> you want a balance of culture, affordability, and beach — with excellent European flight connections.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Choose Dubai if:</strong> you need ultra-safe, predictable luxury travel, world-class shopping, or a global transit hub.
        </p>
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Honest safety assessment for 2026" to="/egypt-safe-now" />
        <SafeNextStep title="Middle East Safety Map" description="See Egypt's stability vs surrounding region" to="/middle-east-safety-map" />
        <SafeNextStep title="Check Real Prices in Egypt" description="What everything actually costs" to="/price-checker" />
      </div>
    </div>
  );
}