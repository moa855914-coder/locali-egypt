import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { generateTrackingCode } from '../lib/constants';
import { Phone, ShieldCheck, Star, ExternalLink, Copy, Check } from 'lucide-react';

const WHATSAPP_BASE = 'https://wa.me/';

const TOURS = [
  {
    city: 'hurghada',
    name: 'Red Sea Snorkeling Day Trip',
    type: 'Water Activity',
    description: 'Full-day snorkeling on the coral reefs of Giftun Island. Equipment, guide, and lunch included.',
    price_egp: 850,
    price_usd: 17,
    duration: '8 hours',
    phone: '201001234567',
    rating: 4.8,
    verified: true,
    highlights: ['Giftun Island reef', 'Lunch on boat', 'Equipment included', 'English-speaking guide'],
  },
  {
    city: 'hurghada',
    name: 'Quad Bike Desert Safari',
    type: 'Desert Adventure',
    description: 'Sunset quad bike ride through the Eastern Desert with Bedouin tea ceremony.',
    price_egp: 650,
    price_usd: 13,
    duration: '3 hours',
    phone: '201009876543',
    rating: 4.6,
    verified: true,
    highlights: ['Sunset views', 'Bedouin camp', 'Tea ceremony', 'Photo stops'],
  },
  {
    city: 'sharm-el-sheikh',
    name: 'Ras Mohammed Diving Tour',
    type: 'Diving',
    description: 'PADI-certified diving at Ras Mohammed National Park — world-class walls and visibility.',
    price_egp: 1200,
    price_usd: 24,
    duration: 'Full day',
    phone: '201112345678',
    rating: 4.9,
    verified: true,
    highlights: ['2 dive sites', 'PADI certified', 'All equipment', 'Lunch included'],
  },
  {
    city: 'sharm-el-sheikh',
    name: 'Sinai Sunrise Camel Trek to Mt Sinai',
    type: 'Cultural Trek',
    description: 'Night hike to Moses Mountain summit. Watch sunrise from 2,285m with Bedouin guide.',
    price_egp: 950,
    price_usd: 19,
    duration: '8 hours (overnight)',
    phone: '201123456789',
    rating: 4.7,
    verified: true,
    highlights: ['Sunrise at summit', 'Bedouin guide', 'Camel option', 'St. Catherine Monastery visit'],
  },
  {
    city: 'luxor',
    name: 'Valley of the Kings Private Tour',
    type: 'Historical Tour',
    description: 'Licensed Egyptologist-guided tour of Valley of the Kings, Hatshepsut Temple, Colossi of Memnon.',
    price_egp: 1100,
    price_usd: 22,
    duration: '6 hours',
    phone: '201234567890',
    rating: 4.9,
    verified: true,
    highlights: ['3 tombs included', 'Licensed Egyptologist', 'Private AC car', 'Skip-the-line entry'],
  },
  {
    city: 'luxor',
    name: 'Hot Air Balloon at Sunrise',
    type: 'Air Experience',
    description: 'ECAA-certified balloon flight over the West Bank temples at dawn. 45-60 minutes.',
    price_egp: 2500,
    price_usd: 50,
    duration: '45–60 min flight',
    phone: '201345678901',
    rating: 4.8,
    verified: true,
    highlights: ['ECAA certified', 'Insurance included', 'Hotel pickup', 'Certificate given'],
  },
  {
    city: 'aswan',
    name: 'Abu Simbel Day Trip',
    type: 'Historical Tour',
    description: 'Dawn convoy to the magnificent temples of Ramesses II and Nefertari. Returns by noon.',
    price_egp: 1800,
    price_usd: 36,
    duration: '8 hours',
    phone: '201456789012',
    rating: 4.9,
    verified: true,
    highlights: ['Entry tickets included', 'AC transport', 'English guide', 'Dawn light photography'],
  },
  {
    city: 'aswan',
    name: 'Felucca Nile Sunset Cruise',
    type: 'Boat Trip',
    description: 'Traditional felucca sailing around Elephantine Island and Kitchener\'s Island botanical garden.',
    price_egp: 400,
    price_usd: 8,
    duration: '2 hours',
    phone: '201567890123',
    rating: 4.5,
    verified: true,
    highlights: ['Botanical garden stop', 'Nubian music', 'Sunset views', 'Tea served'],
  },
  {
    city: 'el-gouna',
    name: 'El Gouna Kitesurfing Lesson',
    type: 'Water Sport',
    description: 'IKO-certified kitesurfing lessons in the calm lagoons of El Gouna. Perfect for beginners.',
    price_egp: 1600,
    price_usd: 32,
    duration: '3 hours',
    phone: '201678901234',
    rating: 4.7,
    verified: true,
    highlights: ['IKO certified instructor', 'Equipment included', 'Calm lagoon', 'Video recording'],
  },
  {
    city: 'el-gouna',
    name: 'El Gouna Island Boat Tour',
    type: 'Boat Trip',
    description: 'Explore El Gouna\'s network of islands, lagoons, and coral reefs by speedboat.',
    price_egp: 700,
    price_usd: 14,
    duration: '4 hours',
    phone: '201789012345',
    rating: 4.6,
    verified: true,
    highlights: ['Snorkeling stop', 'Island BBQ', 'Marine guide', 'Life jackets provided'],
  },
];

const CITY_LABELS = {
  'hurghada': 'Hurghada',
  'sharm-el-sheikh': 'Sharm El Sheikh',
  'luxor': 'Luxor',
  'aswan': 'Aswan',
  'el-gouna': 'El Gouna',
};

function TourCard({ tour, lang }) {
  const [code] = useState(() => generateTrackingCode(tour.city, 'TOUR'));
  const [copied, setCopied] = useState(false);

  const whatsappMsg = encodeURIComponent(
    `Hello! I'd like to book: "${tour.name}" via Locali Egypt.\nTracking Code: ${code}\nDuration: ${tour.duration}\nPrice: ${tour.price_egp} EGP (~$${tour.price_usd} USD)\nPlease confirm availability.`
  );
  const whatsappUrl = `${WHATSAPP_BASE}${tour.phone}?text=${whatsappMsg}`;

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">{CITY_LABELS[tour.city]}</span>
              <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{tour.type}</span>
              {tour.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base">{tour.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-extrabold text-accent text-lg">{tour.price_egp} EGP</p>
            <p className="text-[10px] text-muted-foreground">~${tour.price_usd} USD</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tour.description}</p>
      </div>

      {/* Highlights */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
        {tour.highlights.map((h, i) => (
          <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-lg">{h}</span>
        ))}
      </div>

      {/* Rating + duration */}
      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="font-bold text-foreground">{tour.rating}</span>
        </div>
        <span>⏱ {tour.duration}</span>
      </div>

      {/* Tracking code */}
      <div className="mx-4 mb-3 bg-secondary/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Your Tracking Code</p>
          <p className="text-xs font-mono font-bold text-foreground">{code}</p>
        </div>
        <button onClick={copyCode} className="p-1.5 rounded-lg hover:bg-background transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-success text-success-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Phone className="w-4 h-4" />
          Book Now via WhatsApp
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { lang } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');

  useEffect(() => {
    const city = searchParams.get('city');
    if (city) setCityFilter(city);
  }, [searchParams]);

  const filtered = cityFilter ? TOURS.filter(t => t.city === cityFilter) : TOURS;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Book Local Tours & Activities</h1>
        <p className="text-sm text-muted-foreground">Verified operators · Real prices in EGP · WhatsApp booking · 7% commission supports this free platform</p>
      </div>

      {/* Info banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6 text-xs text-muted-foreground leading-relaxed">
        <strong className="text-foreground">How it works:</strong> Each booking generates a unique Tracking Code (LOC-XXX-XXXX). Copy it, send it to the operator via WhatsApp, and you're set. Your code ensures you get the quoted price — no surprise charges.
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {[{ id: '', label: '🌍 All Cities' }, ...Object.entries(CITY_LABELS).map(([id, label]) => ({ id, label }))].map((c) => (
          <button
            key={c.id}
            onClick={() => setCityFilter(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tours grid */}
      <div className="space-y-4">
        {filtered.map((tour, i) => (
          <TourCard key={i} tour={tour} lang={lang} />
        ))}
      </div>

      <div className="mt-8 bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground">
        Want to list your service here? <a href="/verify-apply" className="text-accent font-bold underline underline-offset-2">Apply for Verified Badge →</a>
      </div>
    </div>
  );
}