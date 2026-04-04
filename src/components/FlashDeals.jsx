import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ExternalLink } from 'lucide-react';

const DEALS = [
  { emoji: '🤿', title: '20% off Snorkeling — Hurghada', desc: 'Giftun Island full-day trip', original: 1060, deal: 850, expires: '24h', city: 'hurghada', hot: true },
  { emoji: '🏺', title: 'Valley of Kings Private Tour', desc: 'Luxor — Egyptologist included', original: 1375, deal: 1100, expires: '48h', city: 'luxor', hot: true },
  { emoji: '🏄', title: 'Kitesurfing Lesson — El Gouna', desc: 'IKO certified, equipment included', original: 2000, deal: 1600, expires: '3 days', city: 'el-gouna', hot: false },
  { emoji: '🎈', title: 'Hot Air Balloon — Luxor', desc: 'ECAA certified, sunrise flight', original: 3125, deal: 2500, expires: '2 days', city: 'luxor', hot: false },
  { emoji: '⛵', title: 'Nile Felucca Sunset Cruise', desc: 'Aswan — tea & music included', original: 500, deal: 400, expires: '48h', city: 'aswan', hot: false },
];

export default function FlashDeals() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-6">
      <div className="flex items-center justify-between px-4 py-3 bg-accent/10 border-b border-accent/20">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="font-extrabold text-sm text-accent">Flash Deals — Today Only</span>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground text-lg leading-none">×</button>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar p-4">
        {DEALS.map((deal, i) => (
          <div key={i} className={`shrink-0 w-56 rounded-xl border p-3 ${deal.hot ? 'border-accent/40 bg-accent/5' : 'border-border/50 bg-secondary/30'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{deal.emoji}</span>
              {deal.hot && <span className="text-[9px] font-extrabold bg-red-500 text-white px-1.5 py-0.5 rounded-full">🔥 HOT</span>}
            </div>
            <p className="font-extrabold text-xs mb-0.5">{deal.title}</p>
            <p className="text-[10px] text-muted-foreground mb-2">{deal.desc}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs line-through text-muted-foreground">{deal.original} EGP</span>
              <span className="text-sm font-extrabold text-accent">{deal.deal} EGP</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                {deal.expires} left
              </div>
              <Link to={`/book?city=${deal.city}`} className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                Book <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}