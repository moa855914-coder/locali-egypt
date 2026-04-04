import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, XCircle, Package, Info } from 'lucide-react';

const BANNED = [
  { item: 'Narcotics / All drugs', penalty: 'Life imprisonment or death penalty', note: 'Zero tolerance. No exceptions.' },
  { item: 'Firearms & ammunition (without prior permit)', penalty: 'Criminal arrest + heavy fines', note: 'Egyptian military permit required months in advance.' },
  { item: 'Explosives, fireworks', penalty: 'Immediate arrest', note: 'Includes signal flares and party poppers.' },
  { item: 'Material offensive to Islam / political content', penalty: 'Confiscation + possible detention', note: 'Religious satire, anti-government books, provocative media.' },
  { item: 'Counterfeit currency', penalty: 'Criminal prosecution', note: 'Includes old collector notes without documentation.' },
  { item: 'Drones (without permit)', penalty: 'Confiscation + fines up to 10,000 EGP', note: 'Military permit required — virtually impossible for tourists.' },
  { item: 'Pornographic material', penalty: 'Confiscation + possible arrest', note: 'Magazines, DVDs, printed material.' },
  { item: 'VoIP equipment / illegal communication devices', penalty: 'Confiscation', note: 'Standard smartphones are fine.' },
];

const RESTRICTED = [
  { item: 'Prescription medication (large quantities)', rule: 'Carry doctor\'s prescription + letter in English. Max 3 months supply.', tip: 'Keep in original pharmacy packaging with your name on label.' },
  { item: 'Alcohol', rule: 'Up to 1 liter per person duty-free', tip: 'More than 1L requires duty payment at customs.' },
  { item: 'Tobacco', rule: '200 cigarettes or 250g tobacco duty-free', tip: 'Larger quantities subject to customs tax.' },
  { item: 'Cash over $10,000 USD equivalent', rule: 'Must declare on arrival', tip: 'Failure to declare can result in confiscation.' },
  { item: 'Antiques (Egyptian artifacts)', rule: 'Illegal to export without ministry permit', tip: 'Any item appearing ancient: get a certificate from the vendor.' },
  { item: 'Pet animals', rule: 'Requires health certificate + rabies vaccination proof', tip: 'Certificate must be issued within 30 days of travel.' },
  { item: 'Professional camera equipment (large)', rule: 'May be asked to register at customs', tip: 'Carry a list of your equipment with serial numbers.' },
  { item: 'Seeds, plants, fresh food', rule: 'Agricultural restrictions apply', tip: 'Packaged food generally fine; fresh fruit/vegetables may be confiscated.' },
];

const FAQS = [
  { q: 'Can I bring my GoPro or action camera to Egypt?', a: 'Yes. Personal cameras, GoPros, and smartphones are fully allowed. Large professional film equipment may need to be declared at customs.' },
  { q: 'Can I bring my e-cigarette / vape to Egypt?', a: 'Generally yes for personal use (1-2 devices + reasonable liquid quantity). Commercial quantities may be taxed or confiscated.' },
  { q: 'Can I bring sleeping pills or anxiety medication?', a: 'Yes, with a valid prescription. Controlled substances require a doctor\'s letter in English. Carry the original box with pharmacy label.' },
  { q: 'Is my laptop safe to bring through customs?', a: 'Absolutely. Laptops, tablets, phones are all standard items with no restrictions for tourists.' },
  { q: 'Can I bring Egyptian currency into Egypt?', a: 'You can import up to 5,000 EGP without declaration. More must be declared.' },
  { q: 'What happens if customs confiscates an item?', a: 'You receive a receipt. Non-banned items can sometimes be retrieved on departure. Banned items are permanently seized.' },
  { q: 'Can I photograph inside the airport?', a: 'Limited photography allowed in arrival/departure halls. Absolutely no photos of security areas, baggage x-ray, or military personnel.' },
];

const CHECKLIST = [
  'Prescription medications: have doctor\'s letter in English',
  'Cash under $10,000 USD — or declare if over',
  'Alcohol: max 1 liter',
  'Tobacco: max 200 cigarettes',
  'No drone (unless you have Egyptian military permit)',
  'Antiques purchased: have a shop certificate',
  'No narcotics of any kind',
  'Camera equipment serial numbers listed',
  'Pet documentation: health cert + rabies vaccine within 30 days',
  'No political / religious offensive material',
];

export default function AirportItems() {
  const { lang } = useOutletContext();
  const [checked, setChecked] = useState(new Set());
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <Package className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">What NOT to Bring to Egypt</h1>
          <p className="text-sm text-muted-foreground">Banned items, customs rules, fines & pre-travel checklist — 2026</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-8 flex gap-3">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">Egyptian customs can check bags thoroughly. When in doubt — leave it at home. This guide is based on 2026 Egyptian customs regulations. Rules can change; verify with your embassy if uncertain.</p>
      </div>

      {/* Banned Items */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /> Completely Banned Items</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20">
          <p className="text-xs font-bold text-red-600">These items will be confiscated and may result in arrest or prosecution</p>
        </div>
        {BANNED.map((b, i) => (
          <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <p className="font-bold text-sm">{b.item}</p>
              <span className="text-[10px] font-bold bg-red-500/10 text-red-600 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">{b.penalty.split('+')[0].trim()}</span>
            </div>
            <p className="text-xs text-muted-foreground">{b.note}</p>
          </div>
        ))}
      </div>

      {/* Restricted Items */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Restricted Items (Allowed with Conditions)</h2>
      <div className="space-y-3 mb-10">
        {RESTRICTED.map((r, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <h3 className="font-bold text-sm mb-1">{r.item}</h3>
            <p className="text-xs text-muted-foreground mb-1">📋 Rule: {r.rule}</p>
            <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-1.5">💡 Tip: {r.tip}</p>
          </div>
        ))}
      </div>

      {/* Customs Rules */}
      <h2 className="text-xl font-extrabold mb-4">Customs & Duty Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {[
          { title: 'Duty-Free Allowances', items: ['1 liter alcohol', '200 cigarettes or 250g tobacco', 'Personal electronics (laptop, camera, phone)', 'Gifts up to $200 USD value', 'Perfume: 250ml'] },
          { title: 'What to Declare', items: ['Cash over $10,000 USD', 'EGP over 5,000', 'Commercial goods over duty-free limit', 'Valuable jewelry (>$2,000)', 'Large quantities of medication'] },
        ].map((col, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <h3 className="font-bold text-sm mb-3">{col.title}</h3>
            <ul className="space-y-2">{col.items.map((item, j) => <li key={j} className="flex gap-2 text-xs text-muted-foreground"><CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />{item}</li>)}</ul>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-extrabold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2 mb-10">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left">
              <h3 className="font-bold text-sm">{faq.q}</h3>
              <span className="text-muted-foreground font-bold text-lg shrink-0">{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && <div className="px-5 pb-4"><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>}
          </div>
        ))}
      </div>

      {/* Pre-Travel Checklist */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Pre-Travel Customs Checklist</h2>
      <div className="space-y-2 mb-8">
        {CHECKLIST.map((item, i) => (
          <button key={i} onClick={() => setChecked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
            className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all text-sm ${checked.has(i) ? 'bg-success/5 border border-success/20 line-through text-muted-foreground' : 'bg-card border border-border/50'}`}>
            <div className={`w-5 h-5 rounded-full shrink-0 border-2 flex items-center justify-center mt-0.5 ${checked.has(i) ? 'bg-success border-success' : 'border-border'}`}>
              {checked.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}