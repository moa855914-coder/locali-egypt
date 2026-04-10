import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Home, ShieldCheck, Star, MapPin, Users, BedDouble,
  Bath, Plus, X, Check, ChevronRight, AlertTriangle
} from 'lucide-react';
import { useSEO } from '../lib/seo';
import { generateTrackingCode } from '../lib/constants';

const CITY_LABELS = {
  hurghada: '🌊 Hurghada',
  'sharm-el-sheikh': '🤿 Sharm El Sheikh',
  luxor: '🏛️ Luxor',
  aswan: '🛶 Aswan',
  'el-gouna': '🏝️ El Gouna',
};

const AMENITY_OPTIONS = ['WiFi', 'AC', 'Kitchen', 'Washing Machine', 'Balcony', 'Pool Access', 'Sea View', 'Nile View', 'Parking', 'TV', 'Hot Water', 'Elevator', 'Security'];

const SAMPLE_APARTMENTS = [];

function BookingModal({ apt, onClose }) {
  const [form, setForm] = useState({ checkin: '', checkout: '', guests: 1, name: '', email: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [code] = useState(() => generateTrackingCode(apt.city, 'APT'));

  const nights = (() => {
    if (!form.checkin || !form.checkout) return 0;
    const diff = (new Date(form.checkout) - new Date(form.checkin)) / 86400000;
    return Math.max(0, diff);
  })();
  const subtotal = nights * apt.price_per_night_egp;
  const commission = Math.round(subtotal * 0.10);

  const submit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-sm rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-sm">Book: {apt.title}</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-extrabold mb-1">Booking Request Sent!</h3>
            <p className="text-xs text-muted-foreground mb-3">The host will confirm within 24 hours. You will not pay until the host confirms.</p>
            <div className="bg-secondary/60 rounded-xl p-3 mb-3 text-left">
              <p className="text-[9px] font-bold text-muted-foreground uppercase mb-0.5">Booking Reference</p>
              <p className="text-xs font-mono font-bold">{code}</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[10px] text-amber-700">
              All communication stays within Locali Egypt platform.
            </div>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-5 py-2 rounded-xl font-bold text-sm">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold mb-1 block">Check-in *</label>
                <input type="date" required value={form.checkin}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(p => ({ ...p, checkin: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-1 block">Check-out *</label>
                <input type="date" required value={form.checkout}
                  min={form.checkin || new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(p => ({ ...p, checkout: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1 block">Guests *</label>
              <select value={form.guests} onChange={e => setForm(p => ({ ...p, guests: +e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none">
                {Array.from({ length: apt.capacity }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
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
              <label className="text-[10px] font-bold mb-1 block">Message (optional)</label>
              <textarea rows={2} value={form.note} placeholder="Arrival time, special requests..."
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none resize-none" />
            </div>
            {nights > 0 && (
              <div className="bg-secondary/60 rounded-xl p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{apt.price_per_night_egp.toLocaleString()} EGP × {nights} nights</span>
                  <span className="font-bold">{subtotal.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Locali fee (10%)</span>
                  <span className="text-accent font-bold">{commission.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-xs font-extrabold border-t border-border/30 pt-1">
                  <span>Total</span>
                  <span className="text-accent">{subtotal.toLocaleString()} EGP</span>
                </div>
                <p className="text-[9px] text-muted-foreground">Host receives {(subtotal - commission).toLocaleString()} EGP after arrival confirmed</p>
              </div>
            )}
            {nights > 0 && nights < apt.min_nights && (
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-500/10 rounded-xl p-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Minimum stay: {apt.min_nights} nights
              </div>
            )}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2 text-[10px] text-amber-700">
              🔒 All communication stays within Locali Egypt. No direct host contact.
            </div>
            <button type="submit"
              disabled={!form.checkin || !form.checkout || !form.name || !form.email || (nights > 0 && nights < apt.min_nights)}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              Request Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function AptCard({ apt }) {
  const [showDetails, setShowDetails] = useState(false);
  const usdPrice = Math.round(apt.price_per_night_egp / 50);

  return (
    <div className={`bg-card rounded-2xl border overflow-hidden ${apt.is_featured ? 'border-accent/40 shadow-md shadow-accent/5' : 'border-border/50'}`}>
      {apt.is_featured && (
        <div className="bg-accent/10 px-4 py-1.5 flex items-center gap-1.5">
          <Star className="w-3 h-3 text-accent fill-accent" />
          <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider">Featured Listing</span>
        </div>
      )}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" />{apt.area}
              </span>
              {apt.is_verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Locali Verified Stay
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base leading-tight">{apt.title}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-extrabold text-accent text-lg">{apt.price_per_night_egp.toLocaleString()} EGP</p>
            <p className="text-[10px] text-muted-foreground">~${usdPrice}/night</p>
            {apt.avg_rating && (
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">{apt.avg_rating}</span>
                <span className="text-[10px] text-muted-foreground">({apt.review_count})</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{apt.description}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {apt.capacity} guests</span>
          <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {apt.bedrooms > 0 ? `${apt.bedrooms} bed` : 'Studio'}</span>
          <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {apt.bathrooms} bath</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {apt.amenities?.slice(0, 5).map((a, i) => (
            <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{a}</span>
          ))}
          {apt.amenities?.length > 5 && (
            <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">+{apt.amenities.length - 5} more</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground">Min stay: <strong>{apt.min_nights} night{apt.min_nights > 1 ? 's' : ''}</strong></p>
      </div>
      {apt.rules && (
        <>
          <button onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors border-b border-border/20">
            <span>House rules & details</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
          </button>
          {showDetails && (
            <div className="px-4 py-3 bg-secondary/30 border-b border-border/20">
              <p className="text-[11px] text-muted-foreground">{apt.rules}</p>
            </div>
          )}
        </>
      )}
      <div className="p-4 space-y-2">
        <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(apt.title + ' ' + (apt.city || '') + ' Egypt')}`}
          target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
          Check availability on Booking.com →
        </a>
        <a href={`https://www.airbnb.com/s/${encodeURIComponent((apt.city || 'Egypt') + ' Egypt')}/homes`}
          target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-xs font-bold hover:bg-secondary transition-colors">
          Search on Airbnb →
        </a>
      </div>
    </div>
  );
}

function HostForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    host_name: '', host_phone: '', title: '', city: '', area: '',
    description: '', price_per_night_egp: '', capacity: 2, bedrooms: 1, bathrooms: 1,
    min_nights: 2, rules: '', amenities: [],
  });
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data) => base44.entities.Apartment.create({ ...data, status: 'pending', is_verified: false }),
    onSuccess: () => { setSubmitted(true); queryClient.invalidateQueries(['apartments']); },
  });

  const toggleAmenity = (a) => setForm(p => ({
    ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a],
  }));

  const submit = (e) => {
    e.preventDefault();
    create.mutate({ ...form, price_per_night_egp: +form.price_per_night_egp });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-sm">List Your Apartment</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        {submitted ? (
          <div className="p-6 text-center">
            <Check className="w-10 h-10 text-success mx-auto mb-3" />
            <h3 className="font-extrabold mb-1">Listing Submitted!</h3>
            <p className="text-xs text-muted-foreground">Our team reviews your listing within 48 hours. Once approved, tourists can book through the platform. You receive 90% after tourist confirms arrival.</p>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-5 py-2 rounded-xl font-bold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-xs text-muted-foreground">
              <strong className="text-foreground">How it works:</strong> Tourists book through Locali Egypt. You get 90% after the tourist confirms arrival. Locali Egypt keeps 10%.
            </div>
            {[
              { key: 'host_name', label: 'Your Name *', placeholder: 'Mohamed' },
              { key: 'host_phone', label: 'Your WhatsApp * (internal — not shown to tourists)', placeholder: '201012345678' },
              { key: 'title', label: 'Listing Title *', placeholder: 'Seaview Studio — Naama Bay' },
              { key: 'area', label: 'Area / Neighbourhood *', placeholder: 'Naama Bay, Marina...' },
              { key: 'description', label: 'Description *', placeholder: 'Describe your apartment...', textarea: true },
              { key: 'rules', label: 'House Rules', placeholder: 'No smoking. Quiet hours after 11pm...', textarea: true },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] font-bold mb-1 block">{f.label}</label>
                {f.textarea ? (
                  <textarea rows={2} required={f.label.includes('*')} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none resize-none" />
                ) : (
                  <input type="text" required={f.label.includes('*')} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
                )}
              </div>
            ))}
            <div>
              <label className="text-[10px] font-bold mb-1 block">City *</label>
              <select required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none">
                <option value="">Select city</option>
                {Object.entries(CITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold mb-1 block">Price/night (EGP) *</label>
                <input type="number" required min={100} value={form.price_per_night_egp}
                  onChange={e => setForm(p => ({ ...p, price_per_night_egp: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-1 block">Max Guests *</label>
                <input type="number" required min={1} max={10} value={form.capacity}
                  onChange={e => setForm(p => ({ ...p, capacity: +e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-1 block">Bedrooms (0=studio)</label>
                <input type="number" min={0} max={6} value={form.bedrooms}
                  onChange={e => setForm(p => ({ ...p, bedrooms: +e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold mb-1 block">Min. Nights</label>
                <input type="number" min={1} value={form.min_nights}
                  onChange={e => setForm(p => ({ ...p, min_nights: +e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2 text-xs outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-2 block">Amenities</label>
              <div className="flex flex-wrap gap-1.5">
                {AMENITY_OPTIONS.map(a => (
                  <button type="button" key={a} onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${form.amenities.includes(a) ? 'bg-accent text-accent-foreground border-accent' : 'border-border bg-secondary/50'}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={create.isPending || !form.title || !form.city || !form.price_per_night_egp}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-40">
              {create.isPending ? 'Submitting…' : 'Submit for Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Apartments() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('');
  const [showHostForm, setShowHostForm] = useState(false);

  useSEO({
    title: 'Cheap Apartments & Short Stay for Tourists in Hurghada, Sharm El Sheikh, Luxor & Aswan Egypt',
    description: 'Book verified apartments and short-stay rentals in Egypt. Fixed prices in EGP. Locali Egypt protected booking. 10% platform fee.',
  });

  const { data: dbApts = [] } = useQuery({
    queryKey: ['apartments', cityFilter],
    queryFn: () => base44.entities.Apartment.filter({ status: 'approved' }),
  });

  const allApts = [...SAMPLE_APARTMENTS, ...dbApts];
  const filtered = cityFilter ? allApts.filter(a => a.city === cityFilter) : allApts;
  const featured = filtered.filter(a => a.is_featured);
  const regular = filtered.filter(a => !a.is_featured);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-6 h-6 text-accent" />
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Apartments & Short Stay</h1>
          </div>
          <p className="text-sm text-muted-foreground">Verified rentals · Fixed EGP prices · Platform-only booking · 10% fee · Host paid after you arrive</p>
        </div>
        <button onClick={() => setShowHostForm(true)}
          className="shrink-0 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
          <Plus className="w-3.5 h-3.5" /> List Apartment
        </button>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-6 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <strong className="text-foreground">Locali Verified Stay</strong> — All listings reviewed before going live. You book through the platform. The host gets paid only after you confirm arrival.
        </div>
      </div>



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

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} listing{filtered.length !== 1 ? 's' : ''} {cityFilter ? `in ${CITY_LABELS[cityFilter]}` : 'across Egypt'}</p>

      {featured.length > 0 && (
        <>
          <p className="text-xs font-extrabold text-accent uppercase tracking-widest mb-3">⭐ Featured</p>
          <div className="space-y-4 mb-6">
            {featured.map((apt, i) => <AptCard key={apt.id || i} apt={apt} />)}
          </div>
        </>
      )}
      {regular.length > 0 && (
        <>
          {featured.length > 0 && <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-3">All Listings</p>}
          <div className="space-y-4">
            {regular.map((apt, i) => <AptCard key={apt.id || i} apt={apt} />)}
          </div>
        </>
      )}

      <div className="mt-8 bg-secondary/50 rounded-2xl p-5 text-center">
        <p className="font-bold text-sm mb-1">Are you a host in Egypt?</p>
        <p className="text-xs text-muted-foreground mb-3">List your apartment and reach thousands of international tourists. Get the <strong>Locali Verified Stay</strong> badge.</p>
        <button onClick={() => setShowHostForm(true)}
          className="bg-accent text-accent-foreground px-5 py-2.5 rounded-xl font-bold text-sm">
          List Your Apartment →
        </button>
      </div>

      {showHostForm && <HostForm onClose={() => setShowHostForm(false)} />}
    </div>
  );
}