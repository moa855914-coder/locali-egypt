import { useState } from 'react';
import { Home, MapPin, ExternalLink } from 'lucide-react';

const CITIES = [
  {
    id: 'hurghada',
    name: 'Hurghada',
    emoji: '🌊',
    airbnb: 'https://www.airbnb.com/s/Hurghada-Egypt/homes?adults=1&monthly_length=1',
    booking: 'https://www.booking.com/searchresults.html?ss=Hurghada+Egypt&nflt=ht_id%3D201',
    neighborhoods: ['Sahl Hasheesh', 'El Mamsha (Marina Walk)', 'Hadaba', 'New Hurghada'],
    rent: {
      budget: '3,000–6,000 EGP/month',
      mid: '7,000–15,000 EGP/month',
      luxury: '18,000–40,000 EGP/month',
    },
    tips: 'Sahl Hasheesh is gated and premium. El Mamsha is walkable and social. Hadaba is local and budget-friendly.',
  },
  {
    id: 'sharm',
    name: 'Sharm El Sheikh',
    emoji: '⛰️',
    airbnb: 'https://www.airbnb.com/s/Sharm-El-Sheikh-Egypt/homes?adults=1&monthly_length=1',
    booking: 'https://www.booking.com/searchresults.html?ss=Sharm+El+Sheikh+Egypt&nflt=ht_id%3D201',
    neighborhoods: ['Naama Bay', 'Sharks Bay', 'Hadaba', 'Mountain View'],
    rent: {
      budget: '4,000–8,000 EGP/month',
      mid: '9,000–18,000 EGP/month',
      luxury: '20,000–50,000 EGP/month',
    },
    tips: 'Naama Bay is central but expensive. Sharks Bay is quieter. Hadaba is the most affordable area with local shops.',
  },
  {
    id: 'luxor',
    name: 'Luxor',
    emoji: '👑',
    airbnb: 'https://www.airbnb.com/s/Luxor-Egypt/homes?adults=1&monthly_length=1',
    booking: 'https://www.booking.com/searchresults.html?ss=Luxor+Egypt&nflt=ht_id%3D201',
    neighborhoods: ['West Bank (Gezira)', 'East Bank Corniche', 'Karnak Area', 'City Center'],
    rent: {
      budget: '1,500–3,500 EGP/month',
      mid: '4,000–9,000 EGP/month',
      luxury: '10,000–20,000 EGP/month',
    },
    tips: 'West Bank is peaceful and authentic — popular with long-stay travelers. East Bank has more amenities. Cheapest rents in Egypt.',
  },
  {
    id: 'aswan',
    name: 'Aswan',
    emoji: '🏛️',
    airbnb: 'https://www.airbnb.com/s/Aswan-Egypt/homes?adults=1&monthly_length=1',
    booking: 'https://www.booking.com/searchresults.html?ss=Aswan+Egypt&nflt=ht_id%3D201',
    neighborhoods: ['Corniche (Nile views)', 'Nubian Village', 'City Center', 'Elephantine Island'],
    rent: {
      budget: '1,500–3,000 EGP/month',
      mid: '3,500–8,000 EGP/month',
      luxury: '9,000–18,000 EGP/month',
    },
    tips: 'Corniche has the best Nile views. Nubian Village is a unique cultural experience. Most affordable long-stay destination in Egypt.',
  },
  {
    id: 'el-gouna',
    name: 'El Gouna',
    emoji: '🏝️',
    airbnb: 'https://www.airbnb.com/s/El-Gouna-Egypt/homes?adults=1&monthly_length=1',
    booking: 'https://www.booking.com/searchresults.html?ss=El+Gouna+Egypt&nflt=ht_id%3D201',
    neighborhoods: ['Downtown El Gouna', 'Abu Tig Marina', 'Kafr El Gouna', 'Lagoon View'],
    rent: {
      budget: '6,000–10,000 EGP/month',
      mid: '12,000–22,000 EGP/month',
      luxury: '25,000–60,000 EGP/month',
    },
    tips: 'El Gouna is a fully self-contained lagoon town. Great for remote workers and digital nomads. Abu Tig Marina is the social hub.',
  },
];

function CityCard({ city }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{city.emoji}</span>
          <div>
            <h3 className="font-extrabold text-lg text-gray-900">{city.name}</h3>
            <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />Egypt</p>
          </div>
        </div>

        {/* Rent ranges */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Budget', value: city.rent.budget, color: 'bg-green-50 text-green-700 border-green-100' },
            { label: 'Mid-range', value: city.rent.mid, color: 'bg-blue-50 text-blue-700 border-blue-100' },
            { label: 'Luxury', value: city.rent.luxury, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          ].map((r) => (
            <div key={r.label} className={`rounded-xl border p-2 text-center ${r.color}`}>
              <p className="text-[9px] font-bold uppercase mb-1">{r.label}</p>
              <p className="text-[9px] font-extrabold leading-tight">{r.value}</p>
            </div>
          ))}
        </div>

        {/* Neighborhoods */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-1.5">Best Areas</p>
          <div className="flex flex-wrap gap-1">
            {city.neighborhoods.map((n) => (
              <span key={n} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{n}</span>
            ))}
          </div>
        </div>

        {/* Tip */}
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-accent font-bold mb-3 hover:underline">
          {expanded ? '▲ Hide tip' : '▼ Local tip'}
        </button>
        {expanded && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
            <p className="text-[10px] text-amber-700">💡 {city.tips}</p>
          </div>
        )}

        {/* Booking buttons */}
        <div className="space-y-2">
          <a href={city.airbnb} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#FF5A5F] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            <ExternalLink className="w-4 h-4" /> Find Apartments on Airbnb →
          </a>
          <a href={city.booking} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#003580] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            <ExternalLink className="w-4 h-4" /> Find Apartments on Booking →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Apartments() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400 px-4 pt-10 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">🏠</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Long Stay & Apartments</h1>
          <p className="text-white/80 text-sm">Monthly rentals · Real price ranges · Best neighborhoods · All cities</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Pro tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-bold text-sm text-amber-800 mb-0.5">Pro tip</p>
            <p className="text-xs text-amber-700">Always book at least 2 weeks in advance for better monthly rates. Mention you want a monthly deal — most hosts give 20–40% discounts for stays over 28 days.</p>
          </div>
        </div>

        {/* City cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {CITIES.map((city) => <CityCard key={city.id} city={city} />)}
        </div>

        {/* Bottom info */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-10 text-center shadow-sm">
          <Home className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
          <h3 className="font-extrabold text-base mb-1">Looking for verified apartments?</h3>
          <p className="text-xs text-gray-500 mb-3">Locali Egypt also lists verified long-stay apartments directly from local hosts — no platform fees.</p>
          <a href="/long-stay" className="inline-block bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            View Verified Long Stay Options →
          </a>
        </div>
      </div>
    </div>
  );
}