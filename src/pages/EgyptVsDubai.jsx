import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, DollarSign, Plane, Shield, Star, Sun } from 'lucide-react';

const COMPARISON = [
  {
    category: 'Cost of Travel',
    icon: DollarSign,
    egypt: { score: 5, points: ['Budget meal: €2–4', 'Taxi: €1–3 per trip', 'Hotel (3-star): €20–50/night', 'Activity: €8–20'] },
    dubai: { score: 2, points: ['Budget meal: €10–20', 'Taxi: €8–15 per trip', 'Hotel (3-star): €80–150/night', 'Activity: €50–150'] },
    verdict: 'Egypt',
    note: 'Egypt is 3–5x cheaper than Dubai for equivalent experiences.',
  },
  {
    category: 'Flight Accessibility',
    icon: Plane,
    egypt: { score: 4, points: ['Charter flights from Europe: €150–400', 'Many direct routes from Russia/Germany/UK', 'Sharm & Hurghada served by budget airlines'] },
    dubai: { score: 4, points: ['Emirates hub — excellent global connections', 'More expensive tickets generally', 'Good for long-haul stopovers'] },
    verdict: 'Tie',
    note: 'Egypt offers better value charter deals from Europe. Dubai wins for global connectivity.',
  },
  {
    category: 'Beach & Water Quality',
    icon: Sun,
    egypt: { score: 5, points: ['World-class Red Sea coral reefs', 'Water visibility 20–40m', 'Warm year-round (22–28°C)', 'Uncrowded reefs'] },
    dubai: { score: 3, points: ['Persian Gulf beaches — limited natural reef', 'Artificial islands (Palm Jumeirah)', 'Water less clear than Red Sea', 'Extremely hot in summer'] },
    verdict: 'Egypt',
    note: 'For diving and snorkeling, Egypt\'s Red Sea is objectively superior to the Persian Gulf.',
  },
  {
    category: 'Safety for Tourists',
    icon: Shield,
    egypt: { score: 4, points: ['Resort areas are heavily secured', 'Tourist police at all major sites', 'Main risk: scams, not violence', 'Millions visit safely each year'] },
    dubai: { score: 5, points: ['Very low crime rate', 'Strict enforcement', 'Extremely safe for tourists', 'Well-regulated tourist industry'] },
    verdict: 'Dubai',
    note: 'Dubai is marginally safer for independent travel. Egypt\'s tourist zones are well-secured but require more awareness.',
  },
  {
    category: 'Culture & Authenticity',
    icon: Star,
    egypt: { score: 5, points: ['7,000 years of history', 'Pyramids, Karnak, Philae, Abu Simbel', 'Living Nubian culture', 'Genuine local food scene'] },
    dubai: { score: 2, points: ['50-year-old city', 'Impressive modern architecture', 'Very international — less local culture', 'Malls and luxury brands'] },
    verdict: 'Egypt',
    note: 'For authentic culture and historical depth, Egypt is unmatched.',
  },
];

const SCORE_DOTS = (score) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i <= score ? 'bg-accent' : 'bg-border'}`} />
    ))}
  </div>
);

export default function EgyptVsDubai() {
  useSEO({
    title: 'Egypt vs Dubai 2025 — Which Is Better for Your Holiday?',
    description: 'Honest comparison of Egypt vs Dubai for tourists in 2025. Costs, safety, beaches, culture, and flights. Which destination gives you more for your money?',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Egypt vs Dubai — Which Is Better in 2025?</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Two popular destinations for European and Russian tourists. One is a desert megacity built in 50 years. The other is a civilization 7,000 years old. Here's the honest comparison across the factors that matter.
        </p>
      </div>

      {/* Overall verdict */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-accent/10 border-2 border-accent rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🇪🇬</p>
          <h2 className="font-extrabold text-lg mb-1">Egypt</h2>
          <p className="text-xs text-muted-foreground">Best for: budget travelers, divers, history lovers, beach holidays, authentic experiences</p>
        </div>
        <div className="bg-secondary border border-border rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🇦🇪</p>
          <h2 className="font-extrabold text-lg mb-1">Dubai</h2>
          <p className="text-xs text-muted-foreground">Best for: luxury shopping, modern architecture, business travel, safety-first travelers</p>
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
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  cat.verdict === 'Egypt' ? 'bg-accent text-accent-foreground' :
                  cat.verdict === 'Dubai' ? 'bg-primary text-primary-foreground' :
                  'bg-secondary text-secondary-foreground'
                }`}>
                  Winner: {cat.verdict}
                </span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border/30">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">🇪🇬 Egypt</span>
                    {SCORE_DOTS(cat.egypt.score)}
                  </div>
                  <ul className="space-y-1">
                    {cat.egypt.points.map((p, j) => <li key={j} className="text-xs text-muted-foreground flex gap-1.5"><CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{p}</li>)}
                  </ul>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">🇦🇪 Dubai</span>
                    {SCORE_DOTS(cat.dubai.score)}
                  </div>
                  <ul className="space-y-1">
                    {cat.dubai.points.map((p, j) => <li key={j} className="text-xs text-muted-foreground flex gap-1.5"><CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="px-5 py-2.5 bg-secondary/40 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">💡 {cat.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget comparison table */}
      <h2 className="text-xl font-extrabold mb-4">7-Day Budget Comparison (per person)</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        <div className="grid grid-cols-3 border-b border-border/30">
          <div className="p-3 text-xs font-bold text-muted-foreground">Expense</div>
          <div className="p-3 text-xs font-bold text-accent border-l border-border/30 text-center">🇪🇬 Egypt</div>
          <div className="p-3 text-xs font-bold border-l border-border/30 text-center">🇦🇪 Dubai</div>
        </div>
        {[
          ['Flights (from Europe)', '€150–300', '€300–600'],
          ['Hotel (7 nights, 3-star)', '€140–350', '€560–1,050'],
          ['Food (daily €/person)', '€10–20/day', '€40–80/day'],
          ['Activities & excursions', '€100–200', '€300–600'],
          ['Transport (local)', '€20–40', '€80–150'],
          ['TOTAL (budget traveler)', '€500–1,000', '€1,500–3,000'],
        ].map(([exp, eg, dxb], i) => (
          <div key={i} className="grid grid-cols-3 border-b border-border/20 last:border-0">
            <div className="p-3 text-xs text-muted-foreground">{exp}</div>
            <div className="p-3 text-xs font-bold text-accent border-l border-border/30 text-center">{eg}</div>
            <div className="p-3 text-xs border-l border-border/30 text-center">{dxb}</div>
          </div>
        ))}
      </div>

      {/* Final verdict */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-lg mb-3">Our Verdict</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          <strong>Choose Egypt if:</strong> you want beaches, diving, ancient history, authentic food, and maximum value for money. Egypt offers 3–5x more experience per euro than Dubai.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong>Choose Dubai if:</strong> you prioritize ultra-safe, fully predictable luxury travel, world-class shopping, or need a stopover hub for longer journeys.
        </p>
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Honest safety assessment for 2025–2026" to="/egypt-safe-now" />
        <SafeNextStep title="Check Real Prices in Egypt" description="What everything actually costs — no surprises" to="/price-checker" />
        <SafeNextStep title="Last Minute Egypt Deals" description="Find flights and deals for a quick trip" to="/last-minute-egypt" />
      </div>
    </div>
  );
}