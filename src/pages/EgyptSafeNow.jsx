import { useSEO, buildFAQSchema } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2, XCircle, Globe } from 'lucide-react';

const FAQS = [
  { q: 'Is Egypt safe for tourists in 2025–2026?', a: 'Yes. Egypt\'s main tourist areas — Sharm El Sheikh, Hurghada, Luxor, Aswan — have maintained strong safety records for decades. The country receives 15+ million tourists annually with extremely rare violent incidents against visitors. The primary risk is financial scams, not physical danger.' },
  { q: 'Is it safe to visit Egypt given the situation in Gaza?', a: 'Egypt is geographically large. Sharm El Sheikh, Hurghada, Luxor, and Aswan are hundreds of kilometers from the Sinai border regions. Tourist sites have seen no impact. Egypt has strong security protocols in tourist areas and has maintained stability throughout regional tensions.' },
  { q: 'Which Egyptian cities are safest for tourists?', a: 'Aswan and Hurghada consistently rank as Egypt\'s safest tourist cities. Sharm El Sheikh has heavy security presence due to its importance as a resort destination. Luxor is safe but has more aggressive tout culture. Cairo requires standard big-city awareness.' },
  { q: 'Is Egypt safer than people think?', a: 'Significantly. Western media disproportionately covers regional tensions, which affects Egypt\'s perception despite the country\'s tourist-area safety record being comparable to southern Europe. Millions of Europeans, Russians, and Americans visit safely every year.' },
  { q: 'What are the actual risks when visiting Egypt?', a: 'The real risks are: financial scams and overcharging (very common), digestive issues from food/water (manageable with care), sun/heat exposure (serious in summer), and road safety outside cities (use official transport). Violent crime against tourists is extremely rare.' },
  { q: 'Should I buy travel insurance for Egypt?', a: 'Yes, absolutely. Not because Egypt is dangerous — but because medical care costs, flight cancellations, and theft happen everywhere. A comprehensive policy covering medical evacuation is recommended for any Egypt trip.' },
];

const REALITY_CHECK = [
  { media: 'Egypt is a warzone', reality: 'Egypt is a stable country. Tourist areas are hundreds of km from any conflict zones. Heavy security presence in all resort cities.' },
  { media: 'Tourists are frequently attacked', reality: 'Violent incidents against tourists are statistically extremely rare. Egypt\'s tourism industry (12% of GDP) depends on tourist safety.' },
  { media: 'The Red Sea has dangerous sharks', reality: 'Shark incidents in tourist areas are isolated and extremely rare. Millions swim the Red Sea safely every year.' },
  { media: 'Cairo is lawless and chaotic', reality: 'Cairo has the standard challenges of a 20-million-person megacity. Tourist areas like Zamalek and Maadi are orderly and safe.' },
];

const CURRENT_STATUS = [
  { region: 'Sharm El Sheikh', status: 'safe', note: 'Heavy security, popular with European package tourists. No incidents in tourist zones.' },
  { region: 'Hurghada', status: 'safe', note: 'Most-visited resort city. All-inclusive zone is extremely secure. Millions of tourists annually.' },
  { region: 'Luxor & Aswan', status: 'safe', note: 'Tourist police at every major site. Safe for independent and guided travel.' },
  { region: 'Cairo', status: 'caution', note: 'Standard big-city precautions. Tourist areas well-patrolled. Normal awareness required.' },
  { region: 'North Sinai', status: 'avoid', note: 'Travel advisory in effect. This is completely separate from Sharm El Sheikh (South Sinai).' },
];

const STATUS_STYLES = {
  safe: { bg: 'bg-success/10 border-success/20', badge: 'bg-success text-success-foreground', text: 'SAFE' },
  caution: { bg: 'bg-amber-500/10 border-amber-500/20', badge: 'bg-amber-500 text-white', text: 'CAUTION' },
  avoid: { bg: 'bg-red-500/10 border-red-500/20', badge: 'bg-red-500 text-white', text: 'AVOID' },
};

export default function EgyptSafeNow() {
  useSEO({
    title: 'Is Egypt Safe Right Now in 2025–2026? Honest Tourist Safety Guide',
    description: 'Honest, up-to-date safety assessment for Egypt tourists in 2025. What the media gets wrong, which areas are safe, and what risks actually exist. FAQ with direct answers.',
    jsonLd: buildFAQSchema(FAQS),
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6 text-success" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Is Egypt Safe Right Now?</h1>
          <p className="text-sm text-muted-foreground">Honest assessment — updated 2025–2026</p>
        </div>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <span className="font-extrabold text-success">Short Answer: Yes, for tourist areas</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Egypt's main tourist destinations — Sharm El Sheikh, Hurghada, Luxor, and Aswan — are safe for tourists. Over 15 million visitors arrive each year. The real risks are financial (scams, overcharging) not physical. Western travel advisories often conflate Egypt's regional politics with its tourist-area safety record.
        </p>
      </div>

      {/* Current status by region */}
      <h2 className="text-xl font-extrabold mb-4">Current Safety Status by Region — 2025</h2>
      <div className="space-y-3 mb-10">
        {CURRENT_STATUS.map((item, i) => {
          const style = STATUS_STYLES[item.status];
          return (
            <div key={i} className={`rounded-2xl border p-4 ${style.bg}`}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <h3 className="font-bold text-sm">{item.region}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{style.text}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.note}</p>
            </div>
          );
        })}
      </div>

      {/* Media vs Reality */}
      <h2 className="text-xl font-extrabold mb-4">Egypt vs. Media Hype — What's Actually True</h2>
      <div className="space-y-3 mb-10">
        {REALITY_CHECK.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="bg-red-500/5 border-b border-red-500/10 px-5 py-3 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground italic">"{item.media}"</p>
            </div>
            <div className="bg-success/5 px-5 py-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{item.reality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actual risks */}
      <h2 className="text-xl font-extrabold mb-4">What Are the Real Risks in Egypt?</h2>
      <div className="space-y-3 mb-10">
        {[
          { risk: 'Financial Scams & Overcharging', level: 'HIGH', desc: 'The #1 issue tourists face. Taxi overcharging, fake guides, inflated prices. Manageable with research (this site).' },
          { risk: 'Food & Water Issues', level: 'MODERATE', desc: 'Never drink tap water. Stick to bottled water and cooked food. A significant minority of tourists experience mild stomach issues.' },
          { risk: 'Sun & Heat Exposure', level: 'MODERATE', desc: 'Summer temperatures reach 45°C. Heatstroke is a genuine danger. Visit temples in early morning. Always carry water.' },
          { risk: 'Road Safety', level: 'MODERATE', desc: 'Egyptian traffic is chaotic. Use official transport, not private unlicensed drivers, especially on desert highways.' },
          { risk: 'Violent Crime Against Tourists', level: 'LOW', desc: 'Statistically rare. Egypt\'s tourism economy depends on tourist safety. Tourist police are everywhere at major sites.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm">{item.risk}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.level === 'HIGH' ? 'bg-amber-500 text-white' :
                item.level === 'MODERATE' ? 'bg-amber-500/20 text-amber-700' :
                'bg-success/20 text-success'
              }`}>{item.level}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-extrabold mb-4">Frequently Asked Safety Questions</h2>
      <div className="space-y-3 mb-10">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <h3 className="font-bold text-sm mb-2">{faq.q}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Women's Safety Guide for Egypt" description="Specific advice for solo and group female travelers" to="/women-safety" />
        <SafeNextStep title="Emergency Numbers for Egypt" description="Tourist Police, ambulance, and embassy contacts" to="/emergency" />
        <SafeNextStep title="Before You Land Checklist" description="Everything you need to prepare before arriving" to="/before-you-land" />
      </div>
    </div>
  );
}