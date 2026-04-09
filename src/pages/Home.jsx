import { useOutletContext } from 'react-router-dom';
import QuickFunnel from '../components/QuickFunnel';
import LiveSituationBanner from '../components/LiveSituationBanner';
import HeroSection from '../components/HeroSection';
import CityCard from '../components/CityCard';
import HomeSections from '../components/HomeSections';
import HomeTips from '../components/HomeTips';
import FlashDeals from '../components/FlashDeals';
import { CITIES, t } from '../lib/constants';

export default function Home() {
  const { lang, openAIChat } = useOutletContext();

  return (
    <div>
      <HeroSection lang={lang} onOpenChat={openAIChat} />
      
      {/* Quick Funnel */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <QuickFunnel lang={lang} />
      </section>

      {/* Live Situation Banner */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <LiveSituationBanner />
      </section>

      {/* Flash Deals */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <FlashDeals />
      </section>

      {/* Quick Access */}
      <section className="px-4 py-6 max-w-7xl mx-auto">
        <HomeSections lang={lang} />
      </section>

      {/* Cities */}
      <section className="py-6 max-w-7xl mx-auto">
        <div className="px-4 mb-4">
          <h2 className="text-xl font-extrabold tracking-tight">{t('explore_cities', lang)}</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:grid md:grid-cols-4 md:overflow-visible">
          {CITIES.map((city) => (
            <CityCard key={city.id} city={city} lang={lang} />
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="px-4 py-6 max-w-7xl mx-auto">
        <HomeTips lang={lang} />
      </section>
    </div>
  );
}