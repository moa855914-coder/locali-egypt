import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ShieldCheck, Star, Phone, Globe, MapPin, Clock, DollarSign, ExternalLink, Check, Copy, CreditCard } from 'lucide-react';
import { generateTrackingCode } from '../lib/constants';
import { EL_GOUNA_META, EL_GOUNA_LISTINGS } from '../lib/elGounaContent';
import PaymentModal from '../components/PaymentModal';

const CATEGORIES = [
  { id: 'restaurants', label: '🍽️ Restaurants' },
  { id: 'bars_nightlife', label: '🎶 Bars & Nightlife' },
  { id: 'medical', label: '🏥 Medical' },
  { id: 'kids_family', label: '👨‍👩‍👧 Kids & Family' },
  { id: 'beaches_water', label: '🌊 Beaches & Water' },
  { id: 'museums_culture', label: '🏛️ Culture & History' },
  { id: 'remote_work', label: '💻 Remote Work' },
  { id: 'transport', label: '🛺 Transport' },
];

function ListingCard({ item, category }) {
  const [code] = useState(() => generateTrackingCode('el-gouna', category.slice(0, 4).toUpperCase()));
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMsg = encodeURIComponent(
    `Hello! I found "${item.name}" on Locali Egypt.\nTracking Code: ${code}\nLocation: El Gouna — ${item.area}\nPrice: ${item.price_range}\nPlease confirm details.`
  );
  const whatsappUrl = item.phone ? `https://wa.me/${item.phone.replace(/\D/g, '')}?text=${whatsappMsg}` : null;

  // For bookable activities, create a service object for PaymentModal
  const hasPrice = item.price_range && !item.price_range.toLowerCase().startsWith('free');
  const priceMatch = item.price_range?.match(/[\d,]+/);
  const priceEGP = priceMatch ? parseInt(priceMatch[0].replace(',', '')) : 0;

  const serviceObj = {
    name: item.name,
    price_egp: priceEGP,
    price_usd: item.price_usd ? parseInt(item.price_usd.replace(/[^0-9]/g, '')) || 0 : 0,
    duration: item.hours || '',
    city: 'el-gouna',
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">{item.type}</span>
              {item.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
              {item.rating && (
                <span className="flex items-center gap-1 text-[10px] font-bold">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  {item.rating}
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base leading-tight">{item.name}</h3>
          </div>
          {item.price_range && (
            <div className="text-right shrink-0">
              <p className="text-xs font-bold text-accent">{item.price_range.split('·')[0].trim()}</p>
              {item.price_usd && <p className="text-[10px] text-muted-foreground">{item.price_usd}</p>}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
      </div>

      {/* Details grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2 text-xs border-b border-border/20">
        {item.area && (
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{item.area}</span>
          </div>
        )}
        {item.hours && (
          <div className="flex items-start gap-1.5">
            <Clock className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{item.hours}</span>
          </div>
        )}
      </div>

      {/* Highlights */}
      {item.highlights?.length > 0 && (
        <div className="px-4 py-3 border-b border-border/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Highlights</p>
          <div className="flex flex-wrap gap-1.5">
            {item.highlights.map((h, i) => (
              <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">⭐ {h}</span>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {item.features?.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-b border-border/20">
          {item.features.map((f, i) => (
            <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>
      )}

      {/* Accessibility */}
      {item.accessibility && (
        <div className="px-4 py-2 border-b border-border/20">
          <p className="text-[10px] text-muted-foreground">♿ {item.accessibility}</p>
        </div>
      )}

      {/* FAQ */}
      {item.faq?.length > 0 && (
        <div className="px-4 py-2 border-b border-border/20 space-y-1">
          {item.faq.map((f, i) => (
            <div key={i} className="bg-secondary/40 rounded-lg overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-3 py-2 flex items-center justify-between">
                <p className="text-[10px] font-bold">❓ {f.q}</p>
                <span className="text-[10px] text-muted-foreground">{openFaq === i ? '▲' : '▼'}</span>
              </button>
              {openFaq === i && <p className="px-3 pb-2 text-[10px] text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Tracking code */}
      <div className="mx-4 my-3 bg-secondary/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Tracking Code</p>
          <p className="text-xs font-mono font-bold text-foreground">{code}</p>
        </div>
        <button onClick={copyCode} className="p-1.5 rounded-lg hover:bg-background transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>

      {/* CTAs */}
      <div className="px-4 pb-4 space-y-2">
        {hasPrice && priceEGP > 0 && (
          <button
            onClick={() => setShowPayment(true)}
            className="flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <CreditCard className="w-4 h-4" />
            Book & Pay Now
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 bg-success/10 text-success border border-success/30 py-2.5 rounded-xl text-xs font-bold hover:bg-success/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          )}
          {item.website && (
            <a
              href={`https://${item.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 border border-border py-2.5 rounded-xl text-xs font-bold hover:bg-secondary transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Website
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}
        </div>
      </div>

      {showPayment && priceEGP > 0 && (
        <PaymentModal tour={serviceObj} trackingCode={code} onClose={() => setShowPayment(false)} />
      )}
    </div>
  );
}

export default function ElGouna() {
  const { lang } = useOutletContext();
  const [activeCategory, setActiveCategory] = useState('restaurants');

  const listings = EL_GOUNA_LISTINGS[activeCategory] || [];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🌊</span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">El Gouna</h1>
          <span className="text-[10px] font-bold bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full">Red Sea</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{EL_GOUNA_META.intro}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Hotels', value: '20+' },
          { label: 'Islands', value: '13' },
          { label: 'Km of beach', value: '8km' },
          { label: 'Airport', value: 'Own' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-xl p-3 text-center">
            <p className="font-extrabold text-accent text-sm">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-4">{listings.length} listings in {CATEGORIES.find(c => c.id === activeCategory)?.label}</p>

      {/* Listings */}
      <div className="space-y-4">
        {listings.map((item, i) => (
          <ListingCard key={i} item={item} category={activeCategory} />
        ))}
      </div>

      {/* Hotels link */}
      <div className="mt-8 bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
        <p className="text-sm font-bold mb-2">Looking for El Gouna hotels?</p>
        <Link to="/hotels?city=el-gouna" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          View El Gouna Hotels & Resorts →
        </Link>
      </div>

      <div className="mt-4 bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground">
        Want to list your El Gouna service?{' '}
        <a href="/verify-apply" className="text-accent font-bold underline underline-offset-2">Apply for Verified Badge →</a>
      </div>
    </div>
  );
}