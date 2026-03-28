import { useState } from 'react';
import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { Zap, Calendar, Plane, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';

const BOOKING_STEPS = [
  { step: 'Choose your entry point', detail: 'Hurghada airport (HRG) = beaches + diving. Sharm El Sheikh (SSH) = Red Sea + Sinai. Luxor (LXR) = history direct. Cairo (CAI) = everything + connections.' },
  { step: 'Book flight first, then hotel', detail: 'Last-minute flights to Egypt are often cheap. Book the flight, then use Booking.com or Airbnb — Egyptian hotels rarely sell out last-minute outside peak (Nov–Jan).' },
  { step: 'Visa: easy on arrival', detail: 'Most nationalities get a visa on arrival ($25 USD cash, or free Sinai-only). Egypt eVisa also available online in advance. No appointment needed.' },
  { step: 'SIM card at the airport', detail: 'Vodafone or Orange official kiosk inside arrivals (not the touts outside). 15GB data SIM: 130–160 EGP. Register with your passport.' },
  { step: 'Book one night hotel in advance', detail: 'Immigration may ask for hotel details. Have at least your first night pre-booked. After arrival you can change freely.' },
  { step: 'Download Careem before landing', detail: 'Egypt\'s most reliable ride app. Works in all major cities. Far better than negotiating with taxis on arrival.' },
];

const FLIGHT_SITES = [
  { name: 'Google Flights', url: 'https://flights.google.com', desc: 'Best for finding cheapest dates. Use price calendar view.' },
  { name: 'Skyscanner', url: 'https://www.skyscanner.com', desc: 'Set alerts for price drops on specific routes.' },
  { name: 'Kiwi.com', url: 'https://www.kiwi.com', desc: 'Best for unusual routing combinations.' },
  { name: 'EasyJet / Ryanair', url: 'https://www.easyjet.com', desc: 'Budget flights to Sharm, Hurghada from UK/Europe.' },
  { name: 'Wizz Air', url: 'https://wizzair.com', desc: 'Best budget option from Eastern Europe and Russia.' },
];

const PACKING_LIST = [
  'Passport + printed visa if eVisa', 'USD $100–200 cash for arrival (visa, taxi, SIM)',
  'Prescription medication (hard to find in Egypt)', 'High-SPF sunscreen (very expensive in Egypt)',
  'Reef-safe sun cream for Red Sea diving', 'Light scarf/shawl for mosques and temples',
  'Power adaptor (Egypt uses Type C, European plugs)', 'Portable water bottle (refillable)',
];

const BEST_DEALS_PERIODS = [
  { period: 'May–June', discount: '30–50% off', note: 'Shoulder season. Hot but not extreme. Fewer tourists. Great diving.' },
  { period: 'September–October', discount: '25–40% off', note: 'Post-summer. Temperatures dropping. Excellent value.' },
  { period: 'February–March', discount: '15–25% off', note: 'After peak season. Good weather. Last-minute availability.' },
  { period: 'July–August', discount: '40–60% off', note: 'Cheapest flights and hotels. Very hot (40°C+) but manageable at beach resorts.' },
];

export default function LastMinuteEgypt() {
  useSEO({
    title: 'Last Minute Egypt 2025 — Deals, Booking Guide & Packing List',
    description: 'Everything you need to book a last-minute trip to Egypt. When to go for the cheapest deals, step-by-step booking guide, packing list, and visa information.',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Last Minute Egypt — 2025</h1>
          <p className="text-sm text-muted-foreground">Book fast, travel smart</p>
        </div>
      </div>

      {/* Best deal periods */}
      <h2 className="text-xl font-extrabold mb-4">When to Find the Cheapest Egypt Deals</h2>
      <div className="grid grid-cols-2 gap-3 mb-10">
        {BEST_DEALS_PERIODS.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm">{item.period}</h3>
              <span className="text-[10px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.discount}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Where to find flights */}
      <h2 className="text-xl font-extrabold mb-4">Where to Find Last-Minute Flights to Egypt</h2>
      <div className="space-y-3 mb-10">
        {FLIGHT_SITES.map((site, i) => (
          <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between bg-card rounded-2xl border border-border/50 p-4 hover:border-accent/30 transition-colors group">
            <div>
              <p className="font-bold text-sm group-hover:text-accent transition-colors">{site.name}</p>
              <p className="text-xs text-muted-foreground">{site.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
          </a>
        ))}
      </div>

      {/* Step by step booking guide */}
      <h2 className="text-xl font-extrabold mb-4">Step-by-Step Last-Minute Booking Guide</h2>
      <div className="space-y-3 mb-10">
        {BOOKING_STEPS.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-extrabold text-sm flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div>
              <h3 className="font-bold text-sm mb-1">{item.step}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* What cities to consider */}
      <h2 className="text-xl font-extrabold mb-4">Which City for a Last-Minute Trip?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {[
          { city: 'Hurghada', duration: '4–7 days', best: 'Beach + snorkeling', note: 'Most flights, most hotels, easiest logistics.' },
          { city: 'Sharm El Sheikh', duration: '4–7 days', best: 'Diving + beach', note: 'Best Red Sea diving. Sinai visa is free.' },
          { city: 'Luxor', duration: '2–3 days', best: 'Ancient history', note: 'Can be combined with Aswan. Temples are extraordinary.' },
          { city: 'Aswan', duration: '2–3 days', best: 'Nile + Nubian culture', note: 'Most relaxed city. Great for a long-weekend add-on.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-extrabold">{item.city}</h3>
              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{item.duration}</span>
            </div>
            <p className="text-xs font-bold text-accent mb-1">Best for: {item.best}</p>
            <p className="text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>

      {/* 48-hour packing list */}
      <h2 className="text-xl font-extrabold mb-4">48-Hour Packing List for Egypt</h2>
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PACKING_LIST.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Updated safety assessment before you book" to="/egypt-safe-now" />
        <SafeNextStep title="Before You Land Checklist" description="Full arrival preparation guide" to="/before-you-land" />
        <SafeNextStep title="Real Prices — Know Before You Go" description="What everything costs so there are no surprises" to="/price-checker" />
      </div>
    </div>
  );
}