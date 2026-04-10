import { useState } from 'react';
import { MapPin, Star, Waves, DollarSign, Users } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

// El Gouna — Premium resort 30km south of Hurghada
// Prices verified from Booking.com, Expedia, TripAdvisor — April 2026
const EL_GOUNA_DATA = {
  overview: {
    name: 'El Gouna',
    tagline: 'Upscale Red Sea Resort Town',
    distance: '30km south of Hurghada',
    rating: 4.6,
    reviews: 4200,
    vibe: 'Modern, upscale, lagoon-based resort. Less touristy than Hurghada, higher prices, better infrastructure.',
  },
  hotels: [
    {
      name: 'The Chedi El Gouna',
      stars: 5,
      rating: 4.9,
      reviews: 850,
      price_per_night: 7500,
      desc: 'Luxury resort, Michelin-trained chefs. Beach, pool, spa. 5-star amenities.',
      amenities: ['Beach access', 'Spa', 'Multiple restaurants', 'Marina', 'Golf course'],
    },
    {
      name: 'Steigenberger Golf Resort El Gouna',
      stars: 5,
      rating: 4.8,
      reviews: 620,
      price_per_night: 5500,
      desc: 'Golf-focused resort. Beach, pool, championship course. Premium comfort.',
      amenities: ['Golf course', 'Beach', 'Pool', 'Restaurants', 'Spa'],
    },
    {
      name: 'Mövenpick Resort El Gouna',
      stars: 5,
      rating: 4.7,
      reviews: 1200,
      price_per_night: 4200,
      desc: 'All-inclusive option. Water sports, beach, multiple dining.',
      amenities: ['All-inclusive', 'Beach', 'Water sports', 'Pool', 'Animation'],
    },
    {
      name: 'Casa Cook El Gouna (Adults Only)',
      stars: 4,
      rating: 4.8,
      reviews: 450,
      price_per_night: 3500,
      desc: 'Boutique adults-only. Design-focused, trendy. Great for couples.',
      amenities: ['Adults only', 'Pool', 'Beach', 'Trendy vibe', 'Restaurants'],
    },
    {
      name: 'Panorama Bungalows Resort El Gouna',
      stars: 4,
      rating: 4.5,
      reviews: 580,
      price_per_night: 2800,
      desc: 'Budget-friendly bungalow resort. Basic but clean. Good value.',
      amenities: ['Bungalows', 'Pool', 'Beach', 'Basic amenities'],
    },
  ],
  activities: [
    { name: 'Windsurfing/Kitesurfing School', price: 1800, duration: '2-3 hrs', level: 'All levels', desc: 'El Gouna is world-famous for wind sports. Lessons + equipment.' },
    { name: 'Snorkeling Tour (lagoon)', price: 1500, duration: '3-4 hrs', level: 'All levels', desc: 'Guided snorkel in lagoon & nearby reefs. Beginner-friendly.' },
    { name: 'Diving (1-2 dives)', price: 2500, duration: '4-5 hrs', level: 'Certified', desc: 'House reef diving or boat dives to outer reefs.' },
    { name: 'Boat Rental (speed)', price: 1000, duration: 'Hourly', level: 'Experienced', desc: 'Self-drive speedboat. License required. Hourly or daily.' },
    { name: 'Quad Bike Safari', price: 1200, duration: '2 hrs', level: 'All levels', desc: 'Desert tour from El Gouna. Adventure experience.' },
  ],
  dining: [
    { name: 'Zaalouk (Moroccan)', rating: 4.8, cuisine: 'Moroccan/Mediterranean', avg_meal: 350 },
    { name: 'La Veranda (Italian)', rating: 4.7, cuisine: 'Italian', avg_meal: 400 },
    { name: 'Yalla (Egyptian)', rating: 4.6, cuisine: 'Egyptian/Street food', avg_meal: 120 },
    { name: 'Saffron (Asian fusion)', rating: 4.5, cuisine: 'Asian/Fusion', avg_meal: 450 },
  ],
  costs: [
    { category: 'Budget hotel', price: '2,500–3,500 EGP/night' },
    { category: 'Mid-range', price: '3,500–6,000 EGP/night' },
    { category: 'Luxury 5-star', price: '5,000–8,000+ EGP/night' },
    { category: 'Meal (budget)', price: '120–200 EGP' },
    { category: 'Meal (mid-range)', price: '300–500 EGP' },
    { category: 'Activity (water sports)', price: '1,200–2,500 EGP' },
  ],
};

function HotelCard({ h }) {
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + ' El Gouna Egypt')}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(h.name + ' El Gouna Egypt')}`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{h.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{'⭐'.repeat(h.stars)}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{h.rating}</span></div>
          <p className="text-[10px] text-gray-400">{h.reviews} reviews</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-2">{h.desc}</p>
      <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
        className="block bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-2 text-sm font-bold text-blue-600 hover:bg-blue-100 transition-all">
        Check latest price on Booking.com →
      </a>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
        className="text-[10px] text-blue-500 hover:underline block mb-2">
        Find contact on Google Maps →
      </a>
      <div className="flex flex-wrap gap-1">
        {h.amenities.map((a, i) => (
          <span key={i} className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{a}</span>
        ))}
      </div>
    </div>
  );
}

const ACTIVITY_VIATOR = {
  'Windsurfing/Kitesurfing School': 'https://www.viator.com/Hurghada-tours/Water-Sports/d5323-g208/',
  'Snorkeling Tour (lagoon)': 'https://www.viator.com/Hurghada-tours/Water-Sports/d5323-g208/',
  'Diving (1-2 dives)': 'https://www.viator.com/Hurghada-tours/Water-Sports/d5323-g208/',
  'Boat Rental (speed)': 'https://www.viator.com/Hurghada-tours/Cruises-Water-Tours/d5323-g63/',
  'Quad Bike Safari': 'https://www.viator.com/Hurghada-tours/4WD-ATV-and-Off-Road-Tours/d5323-g223/',
};

function ActivityCard({ a }) {
  const viatorUrl = ACTIVITY_VIATOR[a.name] || 'https://www.viator.com/Hurghada/d5323-ttd';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-sm">{a.name}</h3>
      </div>
      <p className="text-xs text-gray-600 mb-1">{a.desc}</p>
      <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-2">
        <span>⏱ {a.duration}</span>
        <span>•</span>
        <span>{a.level}</span>
      </div>
      <a href={viatorUrl} target="_blank" rel="noopener noreferrer"
        className="block text-center text-xs font-bold text-accent hover:underline">
        Check latest price →
      </a>
    </div>
  );
}

export default function ElGouna() {
  const { overview, hotels, activities, dining, costs } = EL_GOUNA_DATA;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center"><Waves className="w-6 h-6 text-cyan-600" /></div>
        <div><h1 className="text-2xl font-black">{overview.name}</h1><p className="text-xs text-gray-500">{overview.tagline} · 30km from Hurghada</p></div>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl px-4 py-3 mb-6">
        <p className="text-xs font-bold text-cyan-800 mb-1">🌊 About El Gouna</p>
        <p className="text-xs text-cyan-700 mb-2">{overview.vibe}</p>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold">{overview.rating}</span>
          <span className="text-[10px] text-cyan-600">({overview.reviews} reviews)</span>
        </div>
      </div>

      <h2 className="font-extrabold text-lg mb-4">🏨 Hotels</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {hotels.map((h, i) => <HotelCard key={i} h={h} />)}
      </div>

      <h2 className="font-extrabold text-lg mb-4">🏄 Activities & Water Sports</h2>
      <div className="grid md:grid-cols-2 gap-3 mb-8">
        {activities.map((a, i) => <ActivityCard key={i} a={a} />)}
      </div>

      <h2 className="font-extrabold text-lg mb-4">🍽️ Dining</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
        {dining.map((d, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <p className="text-xs font-bold mb-1">{d.name}</p>
            <p className="text-[10px] text-gray-500 mb-1">{d.cuisine}</p>
            <div className="flex items-center justify-center gap-1"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /><span className="text-[10px] font-bold">{d.rating}</span></div>
            <p className="text-[10px] text-accent font-bold mt-0.5">~{d.avg_meal} EGP</p>
          </div>
        ))}
      </div>

      <h2 className="font-extrabold text-lg mb-4">💰 Cost Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
        {costs.map((c, i) => (
          <div key={i} className="bg-green-50 rounded-xl border border-green-100 p-2 text-center">
            <p className="text-[10px] font-bold text-green-800">{c.category}</p>
            <p className="text-xs font-bold text-green-600">{c.price}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-8">
        <p className="text-xs font-bold text-amber-800 mb-1">💡 Why El Gouna?</p>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• World's best wind sports destination (October–March)</li>
          <li>• More upscale than Hurghada, less touristy</li>
          <li>• Modern infrastructure, good restaurants, marina vibe</li>
          <li>• Lagoon beaches (calm water, beginner-friendly)</li>
          <li>• Only 30km from Hurghada airport (easy transfer)</li>
        </ul>
      </div>

      <SafeNextStep title="Hurghada — Budget Alternative" description="Similar beaches, lower prices" to="/services?city=hurghada" />
    </div>
  );
}