import { useParams } from 'react-router-dom';
import { CITY_META, CITY_TRANSPORT } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import ListingCard from '../../components/city/ListingCard';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { CITY_LISTINGS } from '../../lib/cityContent';
import { Car, CheckCircle2, AlertTriangle } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Is Uber available in Sharm El Sheikh?', a: 'Yes, both Uber and Careem operate in Sharm El Sheikh. They are the recommended way to get around as prices are fixed and transparent.' },
    { q: 'How do I get from Sharm airport to my hotel?', a: 'Pre-book a hotel transfer, use the official taxi desk inside arrivals, or order a Careem/Uber when you exit. Do not accept offers from drivers approaching you.' },
  ],
  hurghada: [
    { q: 'How do I get around Hurghada?', a: 'Careem is reliable and widely used. Alternatively, the local microbus (5–10 EGP) runs along the main road. Renting a bicycle works for short distances in the resort area.' },
    { q: 'Is there a bus from Hurghada airport?', a: 'No public bus. Use the official airport taxi desk (inside arrivals) or pre-arrange a hotel transfer. Prices from airport to most hotels: 120–200 EGP.' },
  ],
  luxor: [
    { q: 'How do I get to the West Bank in Luxor?', a: 'Take the local passenger ferry from the Corniche (5 EGP). Runs from 6am to around 10pm. On the West Bank, rent a bicycle or hire a taxi for temple visits.' },
    { q: 'Is it safe to rent a bike in Luxor?', a: 'Yes, the West Bank roads are quiet and relatively flat. Rent from guesthouses near the ferry landing for 80–120 EGP/day. Bring water and a hat.' },
  ],
  aswan: [
    { q: 'How do I get to Elephantine Island?', a: 'Small motor boats depart from the Corniche constantly — 5–10 EGP per trip. Agree on price before boarding. The island is a 5-minute crossing.' },
    { q: 'Can I travel to Abu Simbel by car?', a: 'Individual vehicles must join the official convoy that departs daily at 4am. The convoy is the only legal way to drive to Abu Simbel for security reasons.' },
  ],
};

export default function CityTransport() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const transport = CITY_TRANSPORT[cityId];
  const transportListings = CITY_LISTINGS[cityId]?.transport || [];
  const faqs = FAQS[cityId] || [];

  if (!meta || !transport) return <div className="p-4">City not found</div>;

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Transport &amp; Taxi Guide — {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">{transport.intro}</p>

        {/* Tips */}
        <h2 className="text-lg font-extrabold mb-4">How to Get Around</h2>
        <div className="space-y-3 mb-8">
          {transport.tips.map((tip, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm mb-1">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-3 mb-8">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700 mb-1">Safety Rule</p>
            <p className="text-sm text-muted-foreground">{transport.safety}</p>
          </div>
        </div>

        {/* Transport Listings */}
        {transportListings.length > 0 && (
          <>
            <h2 className="text-lg font-extrabold mb-4">Trusted Transport Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {transportListings.map((t, i) => <ListingCard key={i} listing={t} />)}
            </div>
          </>
        )}

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8">
          <SafeNextStep
            title={`Taxi Prices in ${meta.name}`}
            description="Know what you should be paying"
            to={`/city/${cityId}/prices`}
          />
        </div>
      </div>
    </div>
  );
}