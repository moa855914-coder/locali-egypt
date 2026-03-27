import { useParams } from 'react-router-dom';
import { CITY_META, CITY_LISTINGS } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import ListingCard from '../../components/city/ListingCard';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import CityMap from '../../components/city/CityMap';
import { Map, Info } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'What is the best activity in Sharm El Sheikh?', a: 'Diving and snorkeling are the main draws. The reefs around Ras Mohammed National Park and Tiran Island are world-class. Book with a PADI-certified center.' },
    { q: 'Can beginners dive in Sharm El Sheikh?', a: 'Yes, Sharm has some of the best conditions for beginners. Many centers offer intro dives (no certification needed) and PADI Open Water courses in 3–4 days.' },
  ],
  hurghada: [
    { q: 'What are the best things to do in Hurghada?', a: 'Glass-bottom boats, snorkeling trips, desert safaris, and Giftun Island day trips are the top experiences. All can be booked at fair prices through the marina.' },
    { q: 'Is the desert safari in Hurghada worth it?', a: 'Yes, if booked correctly. A 4-hour desert safari includes quad biking, camel riding, and a Bedouin dinner. Fair price: 700–900 EGP. Avoid hotel packages (they mark up 3x).' },
  ],
  luxor: [
    { q: 'What are the must-see sites in Luxor?', a: 'Valley of the Kings (West Bank), Karnak Temple (East Bank), Luxor Temple at night, Medinet Habu, and a sunrise hot air balloon over the entire area.' },
    { q: 'How long does it take to see Valley of the Kings?', a: 'The standard ticket includes 3 tombs. Allocate 2–3 hours. Arrive early (7–8am) to beat the heat and crowds. The tombs are underground and cool.' },
  ],
  aswan: [
    { q: 'What is the most important site near Aswan?', a: 'Abu Simbel. Built by Ramesses II, it is one of the most impressive monuments in human history. The 3-hour drive is completely worth it.' },
    { q: 'Is Philae Temple worth visiting?', a: 'Absolutely. Philae (Temple of Isis) sits on an island in the Nile and is reached by boat. The sound and light show in the evening is spectacular.' },
  ],
};

export default function CityThingsToDo() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const activities = CITY_LISTINGS[cityId]?.activities || [];
  const clinics = CITY_LISTINGS[cityId]?.clinics || [];
  const faqs = FAQS[cityId] || [];

  if (!meta) return <div className="p-4">City not found</div>;

  const mapMarkers = activities.map(a => ({ lat: a.lat, lng: a.lng, label: a.name, type: 'activity' }));

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Things To Do in {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          Verified activities and experiences in {meta.name}. Every entry here has been selected for quality, fair pricing, and honest reputation. No paid placements.
        </p>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 mb-8">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Scam note:</strong> Many fake tour operators operate near tourist sites. Always book through official operators or certified centers — never through strangers on the street.
          </p>
        </div>

        {mapMarkers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold mb-3">Map</h2>
            <CityMap cityId={cityId} markers={mapMarkers} />
          </div>
        )}

        <h2 className="text-lg font-extrabold mb-4">Activities & Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {activities.map((a, i) => <ListingCard key={i} listing={a} />)}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Real Activity Prices in ${meta.name}`}
            description="Don't pay more than you should"
            to={`/city/${cityId}/prices`}
          />
        </div>
      </div>
    </div>
  );
}