import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Car, ShieldCheck, Star, MapPin, Languages,
  Plus, X, Check, AlertTriangle, Lock, User
} from 'lucide-react';
import { useSEO } from '../lib/seo';
import { generateTrackingCode } from '../lib/constants';

const CITY_LABELS = {
  hurghada: '🌊 Hurghada',
  'sharm-el-sheikh': '🤿 Sharm El Sheikh',
  luxor: '🏛️ Luxor',
  aswan: '🛶 Aswan',
  'el-gouna': '🏝️ El Gouna',
  cairo: '🏙️ Cairo',
};

const LANG_FLAGS = { English: '🇬🇧', Russian: '🇷🇺', German: '🇩🇪', Arabic: '🇪🇬', French: '🇫🇷', Italian: '🇮🇹', Polish: '🇵🇱' };

const SAMPLE_DRIVERS = [
  {
    id: 'd1', full_name: 'Local Verified Driver', is_verified: true, status: 'approved',
    photo_url: '',
    cities_covered: ['hurghada', 'el-gouna', 'luxor'],
    languages: ['Arabic', 'English', 'Russian'],
    car_model: 'Toyota Camry 2022', car_color: 'White',
    description: 'Professional driver with 8 years experience. Specialise in airport transfers and day trips. Always on time, AC always cold.',
    avg_rating: 4.9, review_count: 147, total_rides: 892,
    price_routes: [
      { route: 'Hurghada Airport → Marina', price_egp: 250, duration_min: 25 },
      { route: 'Hurghada → El Gouna', price_egp: 350, duration_min: 35 },
      { route: 'Hurghada → Luxor (day trip)', price_egp: 2200, duration_min: 210 },
      { route: 'Hurghada City Tour (half day)', price_egp: 600, duration_min: 240 },
    ],
  },
  {
    id: 'd2', full_name: 'Local Verified Driver', is_verified: true, status: 'approved',
    photo_url: '',
    cities_covered: ['sharm-el-sheikh', 'hurghada'],
    languages: ['Arabic', 'English', 'German'],
    car_model: 'Hyundai Tucson 2021', car_color: 'Silver',
    description: 'Certified tourist transport driver. Specialist in Sinai tours and Sharm El Sheikh airport runs. No hidden fees ever.',
    avg_rating: 4.8, review_count: 93, total_rides: 541,
    price_routes: [
      { route: 'Sharm Airport → Naama Bay', price_egp: 200, duration_min: 20 },
      { route: 'Sharm Airport → Sharks Bay', price_egp: 220, duration_min: 25 },
      { route: 'Sharm → St Catherine Monastery', price_egp: 1800, duration_min: 180 },
      { route: 'Sharm City Tour (full day)', price_egp: 900, duration_min: 480 },
    ],
  },
  {
    id: 'd3', full_name: 'Local Verified Driver', is_verified: true, status: 'approved',
    photo_url: '',
    cities_covered: ['luxor', 'aswan'],
    languages: ['Arabic', 'English', 'French', 'Italian'],
    car_model: 'Kia Sportage 2023', car_color: 'Black',
    description: 'Upper Egypt specialist. I know every temple and every shortcut in Luxor and Aswan. Multilingual, licensed tourism driver since 2012.',
    avg_rating: 4.9, review_count: 78, total_rides: 410,
    price_routes: [
      { route: 'Luxor Airport → Corniche Hotels', price_egp: 180, duration_min: 20 },
      { route: 'Luxor West Bank temples (half day)', price_egp: 700, duration_min: 240 },
      { route: 'Luxor East Bank temples (half day)', price_egp: 700, duration_min: 240 },
      { route: 'Luxor → Aswan (private)', price_egp: 2800, duration_min: 270 },
      { route: 'Aswan Airport → Corniche Hotels', price_egp: 160, duration_min: 15 },
    ],
  },
  {
    id: 'd4', full_name: 'Local Verified Driver', is_verified: false, status: 'approved',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    cities_covered: ['hurghada', 'el-gouna'],
    languages: ['Arabic', 'English', 'Russian', 'Polish'],
    car_model: 'Skoda Octavia 2020', car_color: 'Grey',
    description: 'Friendly and reliable driver. I work 24h and never miss a pickup. Hurghada local — I know all the best spots.',
    avg_rating: 4.6, review_count: 54, total_rides: 223,
    price_routes: [
      { route: 'Hurghada Airport → Sahl Hasheesh', price_egp: 380, duration_min: 40 },
      { route: 'Hurghada Airport → El Gouna', price_egp: 420, duration_min: 45 },
      { route: 'Hurghada → Soma Bay', price_egp: 500, duration_min: 55 },
    ],
  },
];

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookRideModal({ driver, route, onClose }) {
  const [form, setForm] = useState({ date: '', time: '', passengers: 1, name: '', email: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [code] = useState(() => generateTrackingCode(driver.cities_covered?.[0] || 'egy', 'DRV'));

  const commission = Math.round((route?.price_egp || 0) * 0.10);

  const submit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-extrabold text-sm">Book Ride</h2>
            {route && <p className="text-[10px] text-muted-foreground">{route.route}</p>}
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-extrabold mb-1">Ride Booked!</h3>
            <p className="text-xs text-muted-foreground mb-3">The driver will confirm within 2 hours. You'll be notified on your email.</p>
            <div className="bg-secondary/60 rounded-xl p-3 mb-3 text-left">
              <p className="text-[9px] font-bold text-muted-foreground uppercase mb-0.5">Booking Reference</p>
              <p className="text-xs font-mono font-bold">{code}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[10px] text-amber-700">
              🔒 Driver's WhatsApp will be shared only after booking is confirmed.
            </div>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-5 py-2 rounded-xl font-bold text-sm">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="bg-secondary/60 rounded-xl p-3">
              <p className="text-xs font-bold">{driver.full_name} · {driver.car_model}</p>
              {route && (
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">{route.route}</span>
                  <span className="font-extrabold text-accent">{route.price_egp.toLocaleString()} EGP</span>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                Locali 10% fee: {commission} EGP · Fixed price — cannot change
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold mb-1 block">Date *</label>
                <input type="date" required value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-1 block">Time *</label>
                <input type="time" required value={form.time}
                  onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Your Name *</label>
              <input type="text" required value={form.name} placeholder="Full name"
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Email *</label>
              <input type="email" required value={form.email} placeholder="your@email.com"
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Note (optional)</label>
              <textarea rows={2} value={form.note} placeholder="Pickup location, flight number, special needs..."
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none resize-none" />
            </div>
            <div className="flex items-start gap-2 bg-success/10 border border-success/20 rounded-xl p-2 text-[10px] text-success">
              <Lock className="w-3 h-3 shrink-0 mt-0.5" />
              Fixed price guaranteed. Driver cannot charge more.
            </div>
            <button type="submit" disabled={!form.date || !form.time || !form.name || !form.email}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Driver Card ──────────────────────────────────────────────────────────────
function DriverCard({ driver }) {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <div className={`bg-card rounded-2xl border overflow-hidden ${driver.is_verified ? 'border-accent/30' : 'border-border/50'}`}>
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start gap-3 mb-3">
          {driver.photo_url ? (
            <img src={driver.photo_url} alt={driver.full_name}
              className="w-16 h-16 rounded-2xl object-cover shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-extrabold text-base">{driver.full_name}</h3>
              {driver.is_verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified Driver
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{driver.car_model} · {driver.car_color}</p>
            <div className="flex items-center gap-3 text-xs">
              {driver.avg_rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <strong>{driver.avg_rating}</strong>
                  <span className="text-muted-foreground">({driver.review_count})</span>
                </span>
              )}
              {driver.total_rides > 0 && (
                <span className="text-muted-foreground">{driver.total_rides.toLocaleString()} rides</span>
              )}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1 mb-2">
          {driver.languages?.map((lang, i) => (
            <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
              {LANG_FLAGS[lang] || '🗣️'} {lang}
            </span>
          ))}
        </div>

        {/* Cities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {driver.cities_covered?.map((c, i) => (
            <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <MapPin className="w-2 h-2" />{CITY_LABELS[c] || c}
            </span>
          ))}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{driver.description}</p>
      </div>

      {/* Fixed price routes */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-1.5 mb-3">
          <Lock className="w-3 h-3 text-muted-foreground" />
          <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Fixed Prices — No Negotiation</p>
        </div>
        <div className="space-y-1.5">
          {driver.price_routes?.map((r, i) => (
            <button key={i} onClick={() => setSelectedRoute(r)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${selectedRoute === r ? 'bg-accent/10 border border-accent/30' : 'bg-secondary/50 hover:bg-secondary'}`}>
              <div className="text-left">
                <p className="font-semibold">{r.route}</p>
                {r.duration_min && <p className="text-[10px] text-muted-foreground">~{r.duration_min >= 60 ? `${Math.floor(r.duration_min / 60)}h ${r.duration_min % 60 > 0 ? r.duration_min % 60 + 'min' : ''}` : `${r.duration_min} min`}</p>}
              </div>
              <span className="font-extrabold text-accent shrink-0 ml-3">{r.price_egp.toLocaleString()} EGP</span>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => {}}
          disabled={!selectedRoute}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-opacity">
          {selectedRoute ? `Request Ride — ${selectedRoute.price_egp.toLocaleString()} EGP` : 'Select a Route Above'}
        </button>
        {selectedRoute && (
          <p className="text-[10px] text-center text-muted-foreground">
            ✅ Fixed price. Pay cash directly to driver after the trip.
          </p>
        )}
      </div>


    </div>
  );
}

// ─── Driver Registration Form ─────────────────────────────────────────────────
function DriverRegisterForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '', whatsapp: '', car_model: '', car_color: '', car_year: '',
    national_id_last4: '', description: '',
    cities_covered: [], languages: [],
    price_routes: [{ route: '', price_egp: '', duration_min: '' }],
  });
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data) => base44.entities.VerifiedDriver.create({ ...data, status: 'pending', is_verified: false }),
    onSuccess: () => { setSubmitted(true); queryClient.invalidateQueries(['drivers']); },
  });

  const toggleCity = (c) => setForm(p => ({
    ...p, cities_covered: p.cities_covered.includes(c) ? p.cities_covered.filter(x => x !== c) : [...p.cities_covered, c],
  }));
  const toggleLang = (l) => setForm(p => ({
    ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x !== l) : [...p.languages, l],
  }));

  const addRoute = () => setForm(p => ({ ...p, price_routes: [...p.price_routes, { route: '', price_egp: '', duration_min: '' }] }));
  const updateRoute = (i, key, val) => setForm(p => {
    const routes = [...p.price_routes];
    routes[i] = { ...routes[i], [key]: val };
    return { ...p, price_routes: routes };
  });
  const removeRoute = (i) => setForm(p => ({ ...p, price_routes: p.price_routes.filter((_, idx) => idx !== i) }));

  const submit = (e) => {
    e.preventDefault();
    create.mutate({
      ...form,
      car_year: +form.car_year,
      price_routes: form.price_routes.map(r => ({ ...r, price_egp: +r.price_egp, duration_min: +r.duration_min })),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-sm">Register as Verified Driver</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        {submitted ? (
          <div className="p-6 text-center">
            <Check className="w-10 h-10 text-success mx-auto mb-3" />
            <h3 className="font-extrabold mb-1">Application Submitted!</h3>
            <p className="text-xs text-muted-foreground">Our team will verify your details within 48 hours. Once approved, your prices are locked and displayed to tourists. You keep 90% of every booking.</p>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-5 py-2 rounded-xl font-bold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">How it works:</strong> Set your fixed prices per route. Once approved, prices are locked — you cannot change them. You receive 90% per booking after the tourist confirms the ride. Locali Egypt takes 10%.
            </div>

            {[
              { key: 'full_name', label: 'Full Name *', placeholder: 'Mohamed Ahmed' },
              { key: 'whatsapp', label: 'WhatsApp Number * (shown to tourist only after booking confirmed)', placeholder: '201012345678' },
              { key: 'car_model', label: 'Car Model & Make *', placeholder: 'Toyota Camry 2022' },
              { key: 'car_color', label: 'Car Color *', placeholder: 'White' },
              { key: 'car_year', label: 'Car Year *', placeholder: '2022', type: 'number' },
              { key: 'national_id_last4', label: 'National ID Last 4 Digits *', placeholder: '1234' },
              { key: 'description', label: 'About You *', placeholder: 'Years of experience, specialities...', textarea: true },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] font-bold mb-1 block">{f.label}</label>
                {f.textarea ? (
                  <textarea rows={2} required value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none resize-none" />
                ) : (
                  <input type={f.type || 'text'} required value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
                )}
              </div>
            ))}

            {/* Cities */}
            <div>
              <label className="text-[10px] font-bold mb-2 block">Cities Covered *</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CITY_LABELS).map(([v, l]) => (
                  <button type="button" key={v} onClick={() => toggleCity(v)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${form.cities_covered.includes(v) ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-secondary/50'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-[10px] font-bold mb-2 block">Languages Spoken *</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(LANG_FLAGS).map(l => (
                  <button type="button" key={l} onClick={() => toggleLang(l)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${form.languages.includes(l) ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-secondary/50'}`}>
                    {LANG_FLAGS[l]} {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Price routes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold">Fixed Price Routes * (locked after approval)</label>
                <button type="button" onClick={addRoute}
                  className="text-[10px] font-bold text-accent flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Route
                </button>
              </div>
              <div className="space-y-2">
                {form.price_routes.map((r, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground">Route {i + 1}</span>
                      {form.price_routes.length > 1 && (
                        <button type="button" onClick={() => removeRoute(i)}><X className="w-3 h-3 text-muted-foreground" /></button>
                      )}
                    </div>
                    <input type="text" required value={r.route} placeholder="From → To (e.g. Airport → Marina)"
                      onChange={e => updateRoute(i, 'route', e.target.value)}
                      className="w-full bg-card rounded-xl px-3 py-1.5 text-xs outline-none" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" required min={50} value={r.price_egp} placeholder="Price (EGP)"
                        onChange={e => updateRoute(i, 'price_egp', e.target.value)}
                        className="w-full bg-card rounded-xl px-3 py-1.5 text-xs outline-none" />
                      <input type="number" min={1} value={r.duration_min} placeholder="Duration (min)"
                        onChange={e => updateRoute(i, 'duration_min', e.target.value)}
                        className="w-full bg-card rounded-xl px-3 py-1.5 text-xs outline-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[10px] text-amber-700">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              Prices are locked once approved. You cannot change them without submitting a new application.
            </div>

            <button type="submit"
              disabled={create.isPending || !form.full_name || !form.whatsapp || !form.car_model || !form.national_id_last4 || !form.cities_covered.length || !form.languages.length}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              {create.isPending ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VerifiedDrivers() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useSEO({
    title: 'Trusted Private Drivers for Tourists in Hurghada Sharm Luxor Aswan Egypt — Fixed Prices No Scam',
    description: 'Book verified private drivers in Egypt with fixed prices. No negotiation, no scams. Hurghada, Sharm El Sheikh, Luxor, Aswan. Airport transfers, day trips, city tours. Locali Verified Driver badge.',
  });

  const { data: dbDrivers = [] } = useQuery({
    queryKey: ['drivers', cityFilter],
    queryFn: () => base44.entities.VerifiedDriver.filter({ status: 'approved' }),
  });

  const allDrivers = [...SAMPLE_DRIVERS, ...dbDrivers];
  const filtered = cityFilter
    ? allDrivers.filter(d => d.cities_covered?.includes(cityFilter))
    : allDrivers;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-6 h-6 text-accent" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Verified Private Drivers</h1>
          </div>
          <p className="text-sm text-muted-foreground">Fixed prices · No negotiation · No scams · 10% platform fee · Locali Verified</p>
        </div>
        <button onClick={() => setShowRegister(true)}
          className="shrink-0 flex items-center gap-1.5 bg-card border border-border px-3 py-2 rounded-xl text-xs font-bold">
          <Plus className="w-3.5 h-3.5" /> Register as Driver
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { icon: Lock, label: 'Prices Locked', desc: 'Cannot change after approval', color: 'text-success' },
          { icon: ShieldCheck, label: 'ID Verified', desc: 'National ID checked', color: 'text-blue-500' },
          { icon: Star, label: 'Rated by Tourists', desc: 'Real reviews only', color: 'text-amber-500' },
        ].map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-3 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${b.color}`} />
              <p className="text-[10px] font-extrabold">{b.label}</p>
              <p className="text-[9px] text-muted-foreground">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        <button onClick={() => setCityFilter('')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!cityFilter ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
          🌍 All Cities
        </button>
        {Object.entries(CITY_LABELS).map(([id, label]) => (
          <button key={id} onClick={() => setCityFilter(id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} verified driver{filtered.length !== 1 ? 's' : ''} {cityFilter ? `covering ${CITY_LABELS[cityFilter]}` : 'across Egypt'}</p>

      <div className="space-y-4 mb-8">
        {filtered.map((d, i) => <DriverCard key={d.id || i} driver={d} />)}
      </div>

      <div className="bg-secondary/50 rounded-2xl p-5 text-center">
        <p className="font-bold text-sm mb-1">Are you a driver in Egypt?</p>
        <p className="text-xs text-muted-foreground mb-3">Join as a Locali Verified Driver. Set your fixed prices. Get bookings from international tourists. Keep 90% of every ride.</p>
        <button onClick={() => setShowRegister(true)}
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold text-sm">
          Register as a Driver →
        </button>
      </div>

      {showRegister && <DriverRegisterForm onClose={() => setShowRegister(false)} />}
    </div>
  );
}