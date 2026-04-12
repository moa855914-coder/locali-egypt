import { useOutletContext, Link } from 'react-router-dom';
import QuickFunnel from '../components/QuickFunnel';
import LiveSituationBanner from '../components/LiveSituationBanner';
import HeroSection from '../components/HeroSection';
import CityCard from '../components/CityCard';
import HomeSections from '../components/HomeSections';
import HomeTips from '../components/HomeTips';
import { CITIES, t } from '../lib/constants';

const CITY_PILLS = [
  { id: 'hurghada', label: '🌊 Hurghada', path: '/city-guide/hurghada' },
  { id: 'sharm', label: '⛰️ Sharm', path: '/city-guide/sharm' },
  { id: 'luxor', label: '👑 Luxor', path: '/city-guide/luxor' },
  { id: 'aswan', label: '🏛️ Aswan', path: '/city-guide/aswan' },
  { id: 'el-gouna', label: '🏝️ El Gouna', path: '/city-guide/el-gouna' },
];

export default function Home() {
  const { lang, openAIChat } = useOutletContext();

  return (
    <div>
      <HeroSection lang={lang} onOpenChat={openAIChat} />

      {/* City Guide Pills */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CITY_PILLS.map(c => (
            <Link key={c.id} to={c.path}
              className="shrink-0 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:border-accent hover:text-accent transition-all shadow-sm">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Funnel */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <QuickFunnel lang={lang} />
      </section>

      {/* Live Situation Banner */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <LiveSituationBanner />
      </section>

      {/* Journey Sections */}
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