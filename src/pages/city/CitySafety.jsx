import { useParams, Link } from 'react-router-dom';
import { CITY_META, CITY_SAFETY } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { ShieldCheck, AlertTriangle, Info, Phone } from 'lucide-react';

const RATING_STYLES = {
  'low': { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success' },
  'medium-low': { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600' },
  'medium': { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600' },
  'high': { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-500' },
};

const TIP_STYLES = {
  safe: { icon: ShieldCheck, color: 'text-success', bg: '' },
  caution: { icon: Info, color: 'text-amber-600', bg: '' },
  warning: { icon: AlertTriangle, color: 'text-red-500', bg: '' },
};

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Is it safe to swim in the Red Sea in Sharm?', a: 'Generally yes, at designated beach areas. Always respect red flags and lifeguard instructions. Currents and marine hazards (urchins, coral) are real. Never swim at unpatrolled beaches.' },
    { q: 'Is Sharm El Sheikh safe for solo female travelers?', a: 'The resort areas and Naama Bay are relatively safe for solo women. Avoid walking alone late at night in non-tourist areas. Catcalling exists but is less aggressive than in other Egyptian cities.' },
  ],
  hurghada: [
    { q: 'Is Hurghada safe in 2024–2025?', a: 'Yes. Hurghada has an excellent safety record for tourists. The main tourist areas are well-patrolled. The main risk is petty scams and overcharging, not violent crime.' },
    { q: 'Are there sharks in Hurghada?', a: 'Shark encounters are extremely rare in tourist areas. There have been very isolated incidents historically. Standard precaution: do not enter the water at night or near fishing boats.' },
  ],
  luxor: [
    { q: 'Is Luxor safe at night?', a: 'The main Corniche road and hotel areas are safe at night. The West Bank after dark is less recommended without hotel-arranged transport. Avoid wandering unfamiliar alleyways alone.' },
    { q: 'How do I deal with aggressive vendors in Luxor?', a: 'Say "La shukran" (no thank you) firmly and keep walking without making eye contact. Never engage with a bargaining conversation unless you genuinely want to buy. Eye contact and hesitation are invitations to persist.' },
  ],
  aswan: [
    { q: 'Is Aswan the safest city in Egypt for tourists?', a: 'It\'s widely considered one of the safest. The city is smaller, the pace is slower, and Nubian culture is notably more welcoming than other tourist areas in Egypt.' },
    { q: 'Do I need a guide in Aswan?', a: 'Not required, but helpful for Abu Simbel\'s history. The temples are well-signed. For the Nile area, a felucca captain who also serves as a guide is a good value option.' },
  ],
};

export default function CitySafety() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const safety = CITY_SAFETY[cityId];
  const faqs = FAQS[cityId] || [];

  if (!meta || !safety) return <div className="p-4">City not found</div>;

  const ratingStyle = RATING_STYLES[safety.ratingLevel] || RATING_STYLES['medium'];

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Safety Tips — {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Honest safety assessment for {meta.name}. Not designed to scare you — designed to prepare you. Most trips go perfectly well.
        </p>

        {/* Overall Rating */}
        <div className={`rounded-2xl border p-5 mb-8 ${ratingStyle.bg} ${ratingStyle.border}`}>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className={`w-6 h-6 ${ratingStyle.text}`} />
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Safety Rating</p>
              <p className={`text-xl font-extrabold ${ratingStyle.text}`}>{safety.rating}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{safety.overview}</p>
        </div>

        {/* Tips */}
        <h2 className="text-lg font-extrabold mb-4">Safety Guidelines</h2>
        <div className="space-y-2 mb-8">
          {safety.tips.map((tip, i) => {
            const style = TIP_STYLES[tip.type];
            const Icon = style.icon;
            return (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex items-start gap-3">
                <Icon className={`w-4 h-4 ${style.color} shrink-0 mt-0.5`} />
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
              </div>
            );
          })}
        </div>

        {/* Emergency CTA */}
        <Link to="/emergency" className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mb-8 hover:bg-red-500/10 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">Emergency Numbers</p>
            <p className="text-xs text-muted-foreground">Tourist Police: 126 · Ambulance: 123 · Police: 122</p>
          </div>
        </Link>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8">
          <SafeNextStep
            title={`Common Scams in ${meta.name}`}
            description="Financial safety — the most likely issue you'll face"
            to={`/city/${cityId}/scams`}
          />
        </div>
      </div>
    </div>
  );
}