import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import { CITIES } from '../lib/constants';
import SafeNextStep from '../components/SafeNextStep';
import { Home, Phone, CheckCircle2, Wifi, MapPin, ShieldCheck } from 'lucide-react';

const STATIC_SERVICES = {
  'hurghada': [
    { name: 'El Gouna Apartments Direct', category: 'apartment', description: 'Furnished 1–3 bedroom apartments in El Gouna resort area. Monthly and weekly rates. Expat-popular. Full amenities.', price_info: '4,000–12,000 EGP/month', contact_phone: '+201001234567', is_verified: true, languages: ['English', 'Russian', 'German'] },
    { name: 'Clean & Go Hurghada', category: 'cleaning', description: 'Weekly and bi-weekly apartment cleaning service. Expat clients. English-speaking coordinator. Equipment supplied.', price_info: '250–400 EGP per visit', contact_phone: '+201112345678', is_verified: true, languages: ['English', 'Arabic'] },
    { name: 'Seoudi Supermarket Delivery', category: 'grocery_delivery', description: 'Full supermarket delivery to your address. App available. 2-3 hour delivery. Covers most Hurghada areas.', price_info: '25 EGP delivery fee', contact_phone: '+201234567890', is_verified: false, languages: ['Arabic', 'English'] },
    { name: 'Fix It Hurghada', category: 'maintenance', description: 'AC, plumbing, electrical repairs. English-speaking owner. Reliable for expat and long-term tourists. WhatsApp for bookings.', price_info: '200–500 EGP/visit + parts', contact_phone: '+201098765432', is_verified: true, languages: ['English', 'Arabic'] },
    { name: 'WE (Telecom Egypt) Fiber', category: 'internet', description: 'Home internet installation. 30–200 Mbps fiber plans. 1-month minimum contract. ID and lease required.', price_info: '200–600 EGP/month', contact_phone: '888', is_verified: true, languages: ['Arabic'] },
  ],
  'sharm-el-sheikh': [
    { name: 'Naama Bay Furnished Rentals', category: 'apartment', description: 'Monthly apartment rentals in Naama Bay and Hadaba. All utilities included option. Managed by English-speaking agency.', price_info: '5,000–15,000 EGP/month', contact_phone: '+201011122233', is_verified: true, languages: ['English', 'Russian'] },
    { name: 'Sharm Cleaning Services', category: 'cleaning', description: 'Professional cleaning for long-stay guests. Hotel-quality clean. References available. WhatsApp only.', price_info: '300–500 EGP per visit', contact_phone: '+201122233344', is_verified: false, languages: ['Arabic', 'Russian'] },
    { name: 'Carrefour Sharm Delivery', category: 'grocery_delivery', description: 'Carrefour delivers to most Sharm areas within 3–4 hours. Order via app or website. Good selection of imported items.', price_info: '30 EGP delivery fee', contact_phone: '+20800123456', is_verified: true, languages: ['Arabic', 'English'] },
    { name: 'Sharm Tech & Home Fix', category: 'maintenance', description: 'AC, internet, appliance repair. Same-day service available. Has English-speaking technician on staff.', price_info: '200–600 EGP/visit', contact_phone: '+201055566677', is_verified: true, languages: ['English', 'Arabic'] },
  ],
  'luxor': [
    { name: 'West Bank Long Stay Apartments', category: 'apartment', description: 'Traditional house apartments near the West Bank temples. Popular with archaeologists and long-stay tourists. No minimum stay.', price_info: '2,000–5,000 EGP/month', contact_phone: '+201099988877', is_verified: false, languages: ['English', 'Arabic'] },
    { name: 'Luxor Laundry Express', category: 'laundry', description: 'Pick up and deliver laundry service. 24–48 hours. Per kilo pricing. Serves tourist area hotels and apartments.', price_info: '20–30 EGP/kg', contact_phone: '+201088877766', is_verified: false, languages: ['Arabic', 'English'] },
  ],
  'aswan': [
    { name: 'Corniche Furnished Apartments', category: 'apartment', description: 'Nile-view furnished apartments on the Corniche. Very affordable. Local management. Month-to-month.', price_info: '1,500–4,000 EGP/month', contact_phone: '+201077766655', is_verified: false, languages: ['English', 'Arabic'] },
    { name: 'Aswan Grocery Delivery (Local)', category: 'grocery_delivery', description: 'Local grocery delivery WhatsApp service. Text your list, they deliver within 2 hours. Cash on delivery.', price_info: 'Free delivery over 200 EGP', contact_phone: '+201066655544', is_verified: false, languages: ['Arabic'] },
  ],
};

const CATEGORY_LABELS = {
  apartment: 'Apartment', cleaning: 'Cleaning', maintenance: 'Maintenance',
  grocery_delivery: 'Grocery Delivery', laundry: 'Laundry', internet: 'Internet', other: 'Other',
};

const CATEGORY_ICONS = {
  apartment: '🏠', cleaning: '🧹', maintenance: '🔧',
  grocery_delivery: '🛒', laundry: '👕', internet: '📶', other: '📋',
};

export default function LongStay() {
  const [city, setCity] = useState('hurghada');
  const [category, setCategory] = useState('all');

  useSEO({
    title: 'Long Stay Services in Egypt 2025 — Apartments, Cleaning, Groceries for Expats',
    description: 'Long-term stay services for expats and digital nomads in Egypt. Apartments, cleaning, grocery delivery, maintenance and internet in Hurghada, Sharm, Luxor and Aswan.',
  });

  const { data: dbServices = [] } = useQuery({
    queryKey: ['long-stay', city],
    queryFn: () => base44.entities.LongStayService.filter({ city }, '-created_date', 30),
  });

  const staticServices = STATIC_SERVICES[city] || [];
  const allServices = [...staticServices, ...dbServices];
  const filtered = category === 'all' ? allServices : allServices.filter(s => s.category === category);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Home className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Long Stay Services</h1>
          <p className="text-sm text-muted-foreground">Apartments, cleaning, groceries & more for expats — 2025</p>
        </div>
      </div>

      {/* Why Egypt for long stay */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-sm mb-3">Why Long-Stay in Egypt Makes Sense</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Furnished apartment', value: '€80–250/mo' },
            { label: 'Utilities (all)', value: '€20–50/mo' },
            { label: 'Groceries (1 person)', value: '€100–200/mo' },
            { label: 'Total living cost', value: '€300–600/mo' },
          ].map((item, i) => (
            <div key={i} className="bg-background rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
              <p className="font-extrabold text-accent text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* City selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground hover:border-accent/30'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8">
        {['all', 'apartment', 'cleaning', 'maintenance', 'grocery_delivery', 'laundry', 'internet'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
            {cat === 'all' ? 'All Services' : `${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]}`}
          </button>
        ))}
      </div>

      {/* Services */}
      <div className="space-y-4 mb-10">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Home className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No services found for this selection.</p>
          </div>
        ) : filtered.map((service, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{CATEGORY_ICONS[service.category]}</span>
                  <h3 className="font-bold">{service.name}</h3>
                  {service.is_verified && (
                    <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                  )}
                </div>
                <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold">{CATEGORY_LABELS[service.category]}</span>
              </div>
              {service.price_info && (
                <span className="text-sm font-extrabold text-accent shrink-0">{service.price_info}</span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.description}</p>

            <div className="flex items-center justify-between flex-wrap gap-3">
              {service.languages?.length > 0 && (
                <div className="flex gap-1">
                  {service.languages.map((lang, j) => (
                    <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{lang}</span>
                  ))}
                </div>
              )}
              {service.contact_phone && (
                <a href={`https://wa.me/${service.contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-success text-success-foreground px-3 py-1.5 rounded-xl text-xs font-bold">
                  <Phone className="w-3 h-3" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Expat tips */}
      <h2 className="text-xl font-extrabold mb-4">Long Stay Practical Tips</h2>
      <div className="space-y-3 mb-10">
        {[
          { tip: 'For apartment rental: always get a written agreement, even informal. Photos of the apartment condition on arrival protect both parties.', icon: '📋' },
          { tip: 'Utilities are typically cheap (200–400 EGP/month) but AC in summer can spike your electricity bill significantly. Ask the landlord about summer bills.', icon: '⚡' },
          { tip: 'Vodafone Egypt home fiber is the most reliable internet option. Installation takes 3–5 days. Monthly rolling contracts available.', icon: '📶' },
          { tip: 'Facebook groups (Hurghada Expats, Sharm El Sheikh Expats) are the best source for apartment recommendations and service referrals from fellow long-stay residents.', icon: '👥' },
          { tip: 'Register your stay with your country\'s embassy if staying 3+ months. Some nationalities must register with local authorities for stays over 30 days.', icon: '🏛️' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
            <span className="text-lg">{item.icon}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Remote Work Spots in Egypt" description="Best cafes and coworking spaces for digital nomads" to="/remote-work" />
        <SafeNextStep title="Egypt Cost Calculator" description="Budget your full stay accurately" to="/cost-calculator" />
      </div>
    </div>
  );
}