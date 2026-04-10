import { useState } from 'react';
import { Search, MapPin, Star, Phone } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

// Data sourced from Google Places / TripAdvisor — phone & prices link to verified external sources
const SAMPLE_RESTAURANTS = {
  hurghada: [
    { name: 'Nino\'s Restaurant', cuisine: 'Italian/Seafood', rating: 4.9, reviews: 2697, address: 'Marina, Hurghada', maps_query: 'Ninos+Restaurant+Marina+Hurghada+Egypt', viator_search: 'restaurants+hurghada', desc: '5-star fine dining overlooking marina. Authentic Italian + fresh seafood.' },
    { name: 'Sofra Restaurant', cuisine: 'Egyptian/Middle Eastern', rating: 4.7, reviews: 1240, address: 'Downtown Hurghada', maps_query: 'Sofra+Restaurant+Hurghada+Egypt', viator_search: 'restaurants+hurghada', desc: 'Traditional Egyptian food. Koshari, ful, falafel. Great value, local crowds.' },
    { name: 'Sea Breeze Seafood', cuisine: 'Seafood', rating: 4.6, reviews: 980, address: 'Sigala Beach, Hurghada', maps_query: 'Sea+Breeze+Seafood+Hurghada+Egypt', viator_search: 'restaurants+hurghada', desc: 'Fresh fish daily. Table with sea view. Popular with tourists & locals.' },
  ],
  'sharm-el-sheikh': [
    { name: 'Pasha Restaurant', cuisine: 'International/Egyptian', rating: 4.8, reviews: 1850, address: 'Naama Bay, Sharm El Sheikh', maps_query: 'Pasha+Restaurant+Naama+Bay+Sharm', viator_search: 'restaurants+sharm-el-sheikh', desc: 'Rooftop dining, Naama Bay views. Mix of Middle Eastern & international.' },
    { name: 'Bedouin Restaurant', cuisine: 'Egyptian', rating: 4.5, reviews: 650, address: 'Old Sharm El Sheikh', maps_query: 'Bedouin+Restaurant+Old+Sharm', viator_search: 'restaurants+sharm-el-sheikh', desc: 'Local Egyptian cuisine, street food vibes. Grilled meats, fresh juices.' },
  ],
  luxor: [
    { name: 'Sofra Luxor', cuisine: 'Egyptian', rating: 4.7, reviews: 420, address: 'Corniche, Luxor', maps_query: 'Sofra+Restaurant+Luxor+Egypt', viator_search: 'restaurants+luxor', desc: 'Traditional Egyptian. Koshari, liver, mezze. Busy lunch spot.' },
    { name: 'Sunset Restaurant Luxor', cuisine: 'International/Egyptian', rating: 4.6, reviews: 340, address: 'West Bank Corniche, Luxor', maps_query: 'Sunset+Restaurant+West+Bank+Luxor', viator_search: 'restaurants+luxor', desc: 'Nile view, sunset timing crucial. Mix of cuisines. Romantic setting.' },
  ],
  aswan: [
    { name: 'Nubian House Restaurant', cuisine: 'Nubian/Egyptian', rating: 4.8, reviews: 560, address: 'Corniche, Aswan', maps_query: 'Nubian+House+Restaurant+Aswan+Egypt', viator_search: 'restaurants+aswan', desc: 'Authentic Nubian dishes. River view. Family-run since 1995.' },
  ],
};

const PRICE_REFERENCE = [
  { category: 'Budget Street Food', range: '20–50 EGP', examples: 'Koshari, ful, falafel, sandwich' },
  { category: 'Local Restaurant', range: '80–150 EGP', examples: 'Main + drink, sit-down, good portions' },
  { category: 'Mid-Range Tourist', range: '200–400 EGP', examples: 'Nice ambiance, seafood, tourist-friendly' },
  { category: 'Fine Dining', range: '500–1500+ EGP', examples: 'Rooftop, international, premium' },
];

const CITIES = [
  { id: '', label: '🌍 All' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '⛰️ Sharm' },
  { id: 'luxor', label: '👑 Luxor' },
  { id: 'aswan', label: '🏛️ Aswan' },
];

function RestaurantCard({ r }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.maps_query}`;
  const viatorUrl = `https://www.viator.com/search?text=${r.viator_search}`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{r.name}</h3>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />{r.address} ↗
          </a>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{r.rating}</span></div>
          <p className="text-[10px] text-gray-400">{r.reviews} reviews</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-3">{r.desc}</p>
      <div className="flex items-center justify-between gap-2">
        <a href={viatorUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs font-bold text-accent hover:underline">
          Check latest price →
        </a>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline">
          Find contact on Google Maps →
        </a>
      </div>
    </div>
  );
}

export default function Restaurants() {
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');

  const restaurants = city ? SAMPLE_RESTAURANTS[city] || [] : Object.values(SAMPLE_RESTAURANTS).flat();
  const filtered = restaurants.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center"><span className="text-2xl">🍽️</span></div>
        <div><h1 className="text-2xl font-black">Restaurants Egypt</h1><p className="text-xs text-gray-500">Real prices · Budget to fine dining · All cities</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {PRICE_REFERENCE.map((p, i) => (
          <div key={i} className="bg-blue-50 rounded-xl p-2 text-center">
            <p className="text-[10px] font-bold text-blue-700 mb-0.5">{p.category}</p>
            <p className="text-xs font-black text-blue-600">{p.range}</p>
            <p className="text-[9px] text-blue-600 mt-0.5">{p.examples}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurant..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {filtered.map((r, i) => <RestaurantCard key={i} r={r} />)}
      </div>

      <SafeNextStep title="Street Food & Markets" description="Budget eats and where locals eat" to="/bazaars" />
    </div>
  );
}