import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { Car, Plus, MapPin, Calendar, Users, Phone, AlertTriangle } from 'lucide-react';

const CITY_ROUTES = [
  { from: 'Hurghada', to: 'Cairo', distance: '460km', duration: '~5 hrs', typical_price: '200–300 EGP/seat' },
  { from: 'Sharm El Sheikh', to: 'Cairo', distance: '550km', duration: '~6.5 hrs', typical_price: '250–350 EGP/seat' },
  { from: 'Luxor', to: 'Aswan', distance: '215km', duration: '~3 hrs', typical_price: '100–150 EGP/seat' },
  { from: 'Cairo', to: 'Hurghada', distance: '460km', duration: '~5 hrs', typical_price: '200–300 EGP/seat' },
  { from: 'Luxor', to: 'Cairo', distance: '660km', duration: '~8 hrs', typical_price: '300–400 EGP/seat' },
  { from: 'Aswan', to: 'Luxor', distance: '215km', duration: '~3 hrs', typical_price: '100–150 EGP/seat' },
];

const EMPTY_FORM = {
  from_city: '', to_city: '', departure_date: '', departure_time: '',
  seats_available: 1, price_per_seat: '', contact_name: '', contact_phone: '', notes: '', car_type: '',
};

export default function RideSharing() {
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useSEO({
    title: 'Ride Sharing Egypt — Share Trips Between Cities | Hurghada Cairo Luxor Aswan',
    description: 'Find or post shared rides between Egyptian cities. Hurghada to Cairo, Sharm to Cairo, Luxor to Aswan. Save money, travel with others. Community ride-share board.',
  });

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['rideshare', fromFilter, toFilter],
    queryFn: () => {
      const filter = { status: 'active' };
      if (fromFilter) filter.from_city = fromFilter;
      if (toFilter) filter.to_city = toFilter;
      return base44.entities.RideShare.filter(filter, 'departure_date', 50);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.RideShare.create({ ...form, status: 'active' });
    setSubmitting(false);
    setShowForm(false);
    setForm(EMPTY_FORM);
    queryClient.invalidateQueries(['rideshare']);
  };

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const CITIES = ['Cairo', 'Hurghada', 'Sharm El Sheikh', 'Luxor', 'Aswan', 'Alexandria', 'Dahab', 'Marsa Alam'];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Car className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Ride Sharing Between Cities</h1>
          <p className="text-sm text-muted-foreground">Find seats or post your trip — community board</p>
        </div>
      </div>

      {/* Safety warning */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 mb-6">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <strong>Safety:</strong> Verify the driver's identity before getting in. Share your trip details with someone you trust. Pay after arrival, not upfront. Trust your instincts.
        </p>
      </div>

      {/* Popular routes */}
      <h2 className="text-xl font-extrabold mb-4">Popular Routes & Fair Prices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {CITY_ROUTES.map((route, i) => (
          <button key={i} onClick={() => { setFromFilter(route.from); setToFilter(route.to); }}
            className="bg-card rounded-2xl border border-border/50 p-4 text-left hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3 text-accent" />
              <span className="font-bold text-sm">{route.from} → {route.to}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{route.distance}</span>
              <span>·</span>
              <span>{route.duration}</span>
              <span>·</span>
              <span className="text-accent font-bold">{route.typical_price}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Filter */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">From</label>
          <select value={fromFilter} onChange={e => setFromFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="">Any city</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1 block">To</label>
          <select value={toFilter} onChange={e => setToFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
            <option value="">Any city</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Trip listings */}
      <div className="space-y-4 mb-8">
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" /></div>
        ) : trips.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-10 text-center">
            <Car className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="font-bold text-sm mb-1">No trips posted yet</p>
            <p className="text-xs text-muted-foreground mb-4">Be the first to post a trip on this route</p>
            <button onClick={() => setShowForm(true)} className="bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-bold">
              Post a Trip
            </button>
          </div>
        ) : (
          trips.map((trip, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-extrabold">{trip.from_city} → {trip.to_city}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{trip.departure_date}{trip.departure_time ? ` at ${trip.departure_time}` : ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{trip.seats_available} seat{trip.seats_available !== 1 ? 's' : ''} available</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-accent text-lg">{trip.price_per_seat} EGP</p>
                  <p className="text-[10px] text-muted-foreground">per seat</p>
                </div>
              </div>
              {trip.car_type && <p className="text-xs text-muted-foreground mb-2">🚗 {trip.car_type}</p>}
              {trip.notes && <p className="text-sm text-muted-foreground mb-3">{trip.notes}</p>}
              {trip.contact_phone && (
                <a href={`https://wa.me/${trip.contact_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-xl text-sm font-bold">
                  <Phone className="w-4 h-4" />
                  WhatsApp: {trip.contact_name || trip.contact_phone}
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Post trip form */}
      <button onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-2xl p-4 text-sm font-bold mb-6">
        <Plus className="w-4 h-4" />
        Post a Trip / Offer Seats
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-8 space-y-3">
          <h3 className="font-bold text-base">Post Your Trip</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">From *</label>
              <input value={form.from_city} onChange={e => update('from_city', e.target.value)} required placeholder="e.g. Hurghada" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">To *</label>
              <input value={form.to_city} onChange={e => update('to_city', e.target.value)} required placeholder="e.g. Cairo" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Date *</label>
              <input type="date" value={form.departure_date} onChange={e => update('departure_date', e.target.value)} required className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Time</label>
              <input type="time" value={form.departure_time} onChange={e => update('departure_time', e.target.value)} className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Seats available *</label>
              <input type="number" min="1" max="8" value={form.seats_available} onChange={e => update('seats_available', parseInt(e.target.value))} required className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Price/seat (EGP) *</label>
              <input type="number" value={form.price_per_seat} onChange={e => update('price_per_seat', e.target.value)} required placeholder="e.g. 250" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Your Name</label>
            <input value={form.contact_name} onChange={e => update('contact_name', e.target.value)} placeholder="First name" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">WhatsApp / Phone *</label>
            <input value={form.contact_phone} onChange={e => update('contact_phone', e.target.value)} required placeholder="+20 1XX XXX XXXX" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Car type / notes</label>
            <input value={form.car_type} onChange={e => update('car_type', e.target.value)} placeholder="e.g. Toyota Corolla, comfortable AC" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-secondary rounded-xl text-sm font-bold">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-bold disabled:opacity-50">
              {submitting ? 'Posting...' : 'Post Trip'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <SafeNextStep title="Egypt Transport Guide" description="Official transport options by city" to="/city/hurghada/transport" />
      </div>
    </div>
  );
}