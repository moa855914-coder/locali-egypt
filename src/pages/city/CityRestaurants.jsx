import { useParams } from 'react-router-dom';
import { CITY_META, CITY_LISTINGS } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import ListingCard from '../../components/city/ListingCard';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import CityMap from '../../components/city/CityMap';
import { UtensilsCrossed, Info } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Where do locals eat in Sharm El Sheikh?', a: 'Locals eat in the Old Market area and Hadaba district. These areas have no tourist markup and serve genuine Egyptian food at Egyptian prices.' },
    { q: 'Are Naama Bay restaurants good value?', a: 'No. Naama Bay is the tourist strip and prices are 2–4x what you\'d pay elsewhere. Eat here for the experience, not the value.' },
  ],
  hurghada: [
    { q: 'Where can I find local food in Hurghada?', a: 'El Dahar is the old town area where Hurghada\'s real food scene is. Restaurants here serve Egyptians, not tourists, and prices show it.' },
    { q: 'Is food safe to eat in Hurghada?', a: 'Stick to cooked food, especially from busy restaurants with high turnover. Avoid salads and raw items from street carts if you have a sensitive stomach.' },
  ],
  luxor: [
    { q: 'What is Nubian food?', a: 'Nubian cuisine features slow-cooked stews, black-eyed peas, grilled fish from the Nile, and fresh-baked bread. Distinctly different from Cairo\'s food scene and excellent.' },
    { q: 'Should I eat at my hotel in Luxor?', a: 'Hotel restaurants are convenient but overpriced. Walking 5 minutes from your hotel will halve your meal cost. Sofra and Habiba\'s are worth the short trip.' },
  ],
  aswan: [
    { q: 'What is the food like in Aswan?', a: 'Aswan has a distinct Nubian and Upper Egyptian cuisine. Fish from the Nile, grilled meats, and Nubian staples. Much cheaper than Luxor or the Red Sea resorts.' },
    { q: 'Can I eat on a felucca?', a: 'Many felucca captains can arrange simple meals on the boat. It\'s a memorable experience — packed lunches of bread, cheese, and fuul on the Nile.' },
  ],
};

export default function CityRestaurants() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const listings = CITY_LISTINGS[cityId]?.restaurants || [];
  const faqs = FAQS[cityId] || [];

  if (!meta) return <div className="p-4">City not found</div>;

  const mapMarkers = listings.map(r => ({ lat: r.lat, lng: r.lng, label: r.name, type: 'restaurant' }));

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Best Restaurants in {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          Honest restaurant recommendations in {meta.name}. No sponsored listings. No promoted content. These are places that serve real food at real prices — popular with locals and tourists who know better.
        </p>

        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex gap-3 mb-8">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Policy:</strong> No restaurant has paid for placement on this page. Listings are based on honest quality and value.
          </p>
        </div>

        {/* Map */}
        {mapMarkers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold mb-3">Map</h2>
            <CityMap cityId={cityId} markers={mapMarkers} />
          </div>
        )}

        {/* Listings */}
        <h2 className="text-lg font-extrabold mb-4">Recommended Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {listings.map((r, i) => <ListingCard key={i} listing={r} />)}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8">
          <SafeNextStep
            title={`Real Prices in ${meta.name}`}
            description="Know what a meal should actually cost"
            to={`/city/${cityId}/prices`}
          />
        </div>
      </div>
    </div>
  );
}