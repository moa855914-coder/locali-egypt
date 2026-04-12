import { useOutletContext } from 'react-router-dom';
import QuickFunnel from '../components/QuickFunnel';
import LiveSituationBanner from '../components/LiveSituationBanner';
import HeroSection from '../components/HeroSection';
import CityCard from '../components/CityCard';
import HomeSections from '../components/HomeSections';
import HomeTips from '../components/HomeTips';
import { CITIES, t } from '../lib/constants';
import useHomeContent from '../hooks/useHomeContent';
import {
  DynamicBanners, DynamicCityPills, DynamicFeatureCards,
  DynamicTipCards, DynamicTextBlocks, DynamicImageBlocks
} from '../components/DynamicHomeSections';

export default function Home() {
  const { lang, openAIChat } = useOutletContext();
  const { hasDB, hero, cityPills, featureCards, tipCards, banners, textBlocks, imageBlocks, ctaButtons } = useHomeContent();

  // Hero props: DB overrides static hero if available
  const heroOverride = hasDB && hero ? {
    titleOverride: hero.title,
    subtitleOverride: hero.subtitle,
    descOverride: hero.description,
    imageOverride: hero.image_url,
  } : {};

  return (
    <div>
      <HeroSection lang={lang} onOpenChat={openAIChat} {...heroOverride} />

      {/* DB Banners (shown just below hero) */}
      {banners.length > 0 && (
        <section className="px-4 pt-4 max-w-7xl mx-auto">
          <DynamicBanners banners={banners} />
        </section>
      )}

      {/* City Guide Pills — DB driven if available, else static */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <DynamicCityPills cityPills={cityPills} />
      </section>

      {/* Quick Funnel */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <QuickFunnel lang={lang} />
      </section>

      {/* Live Situation Banner */}
      <section className="px-4 pt-4 max-w-7xl mx-auto">
        <LiveSituationBanner />
      </section>

      {/* DB Feature Cards (if any) */}
      {featureCards.length > 0 && (
        <section className="px-4 py-4 max-w-7xl mx-auto">
          <DynamicFeatureCards featureCards={featureCards} />
        </section>
      )}

      {/* DB Text Blocks */}
      {textBlocks.length > 0 && (
        <section className="px-4 py-4 max-w-7xl mx-auto">
          <DynamicTextBlocks textBlocks={textBlocks} />
        </section>
      )}

      {/* DB Image Blocks */}
      {imageBlocks.length > 0 && (
        <section className="px-4 py-4 max-w-7xl mx-auto">
          <DynamicImageBlocks imageBlocks={imageBlocks} />
        </section>
      )}

      {/* Journey Sections (static, always shown) */}
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

      {/* DB Tip Cards */}
      {tipCards.length > 0 && (
        <section className="px-4 py-4 max-w-7xl mx-auto">
          <DynamicTipCards tipCards={tipCards} />
        </section>
      )}

      {/* Tips (static, always shown) */}
      <section className="px-4 py-6 max-w-7xl mx-auto">
        <HomeTips lang={lang} />
      </section>
    </div>
  );
}