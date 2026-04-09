import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Anchor, Search, Filter, X, Copy, Check, Phone, ChevronDown, ChevronUp, Plus, Users, Clock, Star } from 'lucide-react';

const CITIES = [
  { id: 'hurghada', label: 'Hurghada' },
  { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh' },
  { id: 'dahab', label: 'Dahab' },
  { id: 'el-gouna', label: 'El Gouna' },
  { id: 'aswan', label: 'Aswan' },
];

const BOAT_TYPES = [
  { id: 'yacht', label: '⛵ Yacht' },
  { id: 'speedboat', label: '🚤 Speedboat' },
  { id: 'fishing_boat', label: '🎣 Fishing Boat' },
  { id: 'sailboat', label: '🌊 Sailboat' },
  { id: 'catamaran', label: '🛥️ Catamaran' },
];

const CITY_LABELS = { hurghada: 'Hurghada', 'sharm-el-sheikh': 'Sharm El Sheikh', dahab: 'Dahab', 'el-gouna': 'El Gouna', aswan: 'Aswan' };
const TYPE_LABELS = { yacht: '⛵ Yacht', speedboat: '🚤 Speedboat', fishing_boat: '🎣 Fishing Boat', sailboat: '🌊 Sailboat', catamaran: '🛥️ Catamaran' };
const PRICE_TYPE_LABELS = { per_hour: '/hr', per_trip: '/trip', per_person: '/person' };

// Sample data shown when no DB records exist yet
const SAMPLE_BOATS = [
  {
    id: 's1', boat_name: 'Blue Horizon Yacht', city: 'hurghada', boat_type: 'yacht',
    price: 3500, price_type: 'per_trip', capacity: 12, duration_hours: 4,
    description: 'Luxury yacht cruise along the Red Sea coast. Includes snorkeling stop, BBQ lunch, and soft drinks. Perfect for groups and special occasions.',
    photos: ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'],
    whatsapp: '201001234567', discount_code: 'LOCALI10', is_featured: true, status: 'approved',
    includes: 'Snorkeling gear, BBQ lunch, soft drinks, towels',
  },
  {
    id: 's2', boat_name: 'Red Sea Explorer', city: 'hurghada', boat_type: 'speedboat',
    price: 1800, price_type: 'per_trip', capacity: 6, duration_hours: 3,
    description: 'Thrilling speedboat adventure to the best snorkeling spots. Visit Giftun Island and spot dolphins along the way.',
    photos: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    whatsapp: '201009876543', discount_code: 'LOCALI10', is_featured: false, status: 'approved',
    includes: 'Snorkeling gear, water, safety equipment',
  },
  {
    id: 's3', boat_name: 'Sharm Pearl Catamaran', city: 'sharm-el-sheikh', boat_type: 'catamaran',
    price: 4200, price_type: 'per_trip', capacity: 20, duration_hours: 6,
    description: 'Full-day catamaran trip to Ras Mohamed National Park. World-class coral reefs and marine life. Lunch and equipment included.',
    photos: ['https://images.unsplash.com/photo-1504539473023-3b5a5e9e7ae7?w=800'],
    whatsapp: '201111234567', discount_code: 'LOCALI10', is_featured: true, status: 'approved',
    includes: 'Snorkeling gear, full lunch, drinks, guide',
  },
  {
    id: 's4', boat_name: 'Nile Dream Felucca', city: 'aswan', boat_type: 'sailboat',
    price: 800, price_type: 'per_hour', capacity: 8, duration_hours: 2,
    description: 'Authentic Nubian felucca sail on the Nile between Aswan islands. Enjoy sunset views and Nubian hospitality.',
    photos: ['https://images.unsplash.com/photo-1553601258-3252bd63c0a9?w=800'],
    whatsapp: '201222345678', discount_code: 'LOCALI10', is_featured: false, status: 'approved',
    includes: 'Tea, traditional music, Nubian guide',
  },
];

function DiscountModal({ boat, onClose }) {
  const [copied, setCopied] = useState(false);
  const code = boat.discount_code || 'LOCALI10';

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Track click
    if (boat.id && !boat.id.startsWith('s')) {
      base44.entities.BoatTrip.update(boat.id, { discount_clicks: (boat.discount_clicks || 0) + 1 }).catch(() => {});
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hi! I found your boat "${boat.boat_name}" on Locali Egypt. I'd like to book using the 10% discount code: ${code}. Please confirm availability and price.`
  );
  const waUrl = `https://wa.me/${boat.whatsapp}?text=${whatsappMsg}`;

  const handleWA = () => {
    if (boat.id && !boat.id.startsWith('s')) {
      base44.entities.BoatTrip.update(boat.id, { whatsapp_clicks: (boat.whatsapp_clicks || 0) + 1 }).catch(() => {});
    }
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🎁</span>
          </div>
          <h3 className="text-xl font-black text-gray-900">Your Exclusive Discount</h3>
          <p className="text-sm text-gray-500 mt-1">For Locali Egypt users only</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 text-center mb-4">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Your Discount Code</p>
          <p className="text-3xl font-black text-white tracking-widest">{code}</p>
          <p className="text-white/80 text-xs mt-1">10% OFF — Show this to the boat owner</p>
        </div>

        <p className="text-xs text-gray-500 text-center mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          💬 Use this code when contacting the boat owner to get your <strong>10% discount</strong> on the total price.
        </p>

        <div className="space-y-2">
          <button onClick={copy}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm transition-all">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <button onClick={handleWA}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-all">
            <Phone className="w-4 h-4" />
            Contact on WhatsApp (with code)
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center mt-3">✨ Exclusive for Locali Egypt users</p>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function BoatCard({ boat }) {
  const [showModal, setShowModal] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const photos = boat.photos?.length ? boat.photos : ['https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800'];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img src={photos[imgIdx]} alt={boat.boat_name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          {boat.is_featured && (
            <span className="bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-full">⭐ Featured</span>
          )}
          <span className="bg-white/90 text-blue-600 text-[10px] font-black px-2 py-1 rounded-full border border-blue-200">
            {TYPE_LABELS[boat.boat_type] || boat.boat_type}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-black px-2 py-1 rounded-full">
          10% OFF
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-base text-gray-900 leading-tight">{boat.boat_name}</h3>
          <div className="text-right shrink-0">
            <p className="font-black text-blue-600 text-lg">{boat.price?.toLocaleString()} EGP</p>
            <p className="text-[10px] text-gray-400">{PRICE_TYPE_LABELS[boat.price_type] || ''}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <span>📍</span>{CITY_LABELS[boat.city] || boat.city}
          {boat.duration_hours && <><span className="mx-1">·</span><Clock className="w-3 h-3" />{boat.duration_hours}h</>}
          <span className="mx-1">·</span><Users className="w-3 h-3" />Up to {boat.capacity}
        </p>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{boat.description}</p>

        {boat.includes && (
          <p className="text-[10px] text-gray-400 bg-gray-50 rounded-xl px-3 py-1.5 mb-3">
            ✅ Includes: {boat.includes}
          </p>
        )}

        <button onClick={() => setShowModal(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-2xl font-extrabold text-sm hover:opacity-90 transition-all shadow-md shadow-blue-200">
          🎁 Unlock 10% Discount
        </button>
      </div>

      {showModal && <DiscountModal boat={boat} onClose={() => setShowModal(false)} />}
    </div>
  );
}

function SubmitForm({ onClose }) {
  const [form, setForm] = useState({ boat_name: '', city: '', boat_type: '', price: '', price_type: 'per_trip', capacity: '', duration_hours: '', description: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!form.boat_name || !form.city || !form.boat_type || !form.price || !form.whatsapp) return;
    setLoading(true);
    await base44.entities.BoatTrip.create({ ...form, price: parseFloat(form.price), capacity: parseInt(form.capacity), discount_code: 'LOCALI10', status: 'pending' });
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black mb-2">Submitted Successfully!</h3>
      <p className="text-sm text-gray-500 mb-4">Your listing is under review. We'll approve it within 24 hours.</p>
      <button onClick={onClose} className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold">Close</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
        ⚓ By submitting, you agree to offer a <strong>10% discount</strong> to users who provide the Locali code.
      </div>
      {[
        { label: 'Boat Name', key: 'boat_name', type: 'text' },
        { label: 'Price (EGP)', key: 'price', type: 'number' },
        { label: 'Capacity (people)', key: 'capacity', type: 'number' },
        { label: 'Duration (hours)', key: 'duration_hours', type: 'number' },
        { label: 'WhatsApp Number', key: 'whatsapp', type: 'text', placeholder: '201001234567' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs font-bold text-gray-600 mb-1 block">{f.label}</label>
          <input type={f.type} placeholder={f.placeholder || f.label} value={form[f.key]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
      ))}
      {[
        { label: 'City', key: 'city', options: CITIES.map(c => ({ value: c.id, label: c.label })) },
        { label: 'Boat Type', key: 'boat_type', options: BOAT_TYPES.map(t => ({ value: t.id, label: t.label })) },
        { label: 'Price Type', key: 'price_type', options: [{ value: 'per_trip', label: 'Per Trip' }, { value: 'per_hour', label: 'Per Hour' }, { value: 'per_person', label: 'Per Person' }] },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs font-bold text-gray-600 mb-1 block">{f.label}</label>
          <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
            <option value="">Select {f.label}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <div>
        <label className="text-xs font-bold text-gray-600 mb-1 block">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
          placeholder="Describe your boat trip experience..."
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
      </div>
      <button onClick={submit} disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit My Boat'}
      </button>
    </div>
  );
}

export default function BoatTrips() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: dbBoats = [] } = useQuery({
    queryKey: ['boattrips'],
    queryFn: () => base44.entities.BoatTrip.filter({ status: 'approved' }),
  });

  const boats = dbBoats.length > 0 ? dbBoats : SAMPLE_BOATS;

  const filtered = boats.filter(b => {
    const matchSearch = !search || b.boat_name.toLowerCase().includes(search.toLowerCase()) || CITY_LABELS[b.city]?.toLowerCase().includes(search.toLowerCase());
    const matchCity = !cityFilter || b.city === cityFilter;
    const matchType = !typeFilter || b.boat_type === typeFilter;
    return matchSearch && matchCity && matchType;
  });

  const featured = filtered.filter(b => b.is_featured);
  const regular = filtered.filter(b => !b.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 px-4 pt-10 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">⛵</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Boat Trips Marketplace</h1>
          <p className="text-white/80 text-sm mb-6">Verified Red Sea & Nile boat experiences · Exclusive 10% discount for Locali users</p>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 font-extrabold px-6 py-3 rounded-2xl text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> List Your Boat
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Search + Filters */}
        <div className="bg-white rounded-3xl shadow-lg p-4 mb-6 border border-gray-100">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search boats or city..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">All Boat Types</option>
              {BOAT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            {(cityFilter || typeFilter || search) && (
              <button onClick={() => { setCityFilter(''); setTypeFilter(''); setSearch(''); }}
                className="px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Featured Boats
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map(b => <BoatCard key={b.id} boat={b} />)}
            </div>
          </div>
        )}

        {/* All listings */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900">All Boat Trips ({filtered.length})</h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">⛵</span>
            <p className="mt-3 font-bold">No boats found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {(featured.length > 0 ? regular : filtered).map(b => <BoatCard key={b.id} boat={b} />)}
          </div>
        )}

        {/* Submit CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-center text-white mb-10">
          <h3 className="font-extrabold text-lg mb-1">Own a Boat? List It Free!</h3>
          <p className="text-white/80 text-xs mb-4">Reach thousands of tourists. No commission — just leads.</p>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 font-extrabold px-6 py-2.5 rounded-2xl text-sm hover:opacity-90">
            List My Boat →
          </button>
        </div>
      </div>

      {/* Submit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black mb-4 text-gray-900">⛵ List Your Boat</h2>
            <SubmitForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}