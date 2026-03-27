import { useParams, useOutletContext } from 'react-router-dom';
import { CITY_META, CITY_PRICES, CITY_FAQS } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

export default function CityPrices() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const prices = CITY_PRICES[cityId] || [];
  const faqs = CITY_FAQS[cityId] || [];

  if (!meta) return <div className="p-4">City not found</div>;

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Real Prices in {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          Honest price data for tourists in {meta.name}. Three columns: what locals pay, what's fair for tourists, and what scammers charge. Know before you pay.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-success">Local Price</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-accent">Fair Tourist Price</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-destructive">Scam / Inflated Price</span>
          </div>
        </div>

        <div className="space-y-4">
          {prices.map((price, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-4 border-b border-border/30">
                <h2 className="font-bold text-sm">{price.item}</h2>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 text-center border-r border-border/30">
                  <p className="text-[10px] text-muted-foreground mb-1">LOCAL</p>
                  <p className="text-lg font-extrabold text-success">{price.local}</p>
                  <p className="text-[10px] text-muted-foreground">EGP</p>
                </div>
                <div className="p-4 text-center border-r border-border/30 bg-accent/5">
                  <p className="text-[10px] text-accent font-bold mb-1">FAIR</p>
                  <p className="text-lg font-extrabold text-accent">{price.fair}</p>
                  <p className="text-[10px] text-muted-foreground">EGP</p>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[10px] text-destructive font-bold mb-1">SCAM</p>
                  <p className="text-lg font-extrabold text-destructive">{price.scam}</p>
                  <p className="text-[10px] text-muted-foreground">EGP</p>
                </div>
              </div>
              {price.note && (
                <div className="px-4 py-2.5 bg-secondary/50 text-xs text-muted-foreground italic border-t border-border/30">
                  💡 {price.note}
                </div>
              )}
            </div>
          ))}
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8 space-y-3">
          <SafeNextStep
            title={`Common Scams in ${meta.name}`}
            description="Know the tricks before they happen to you"
            to={`/city/${cityId}/scams`}
          />
          <SafeNextStep
            title="Full Price Checker Tool"
            description="Compare prices across all Egyptian cities"
            to="/price-checker"
          />
        </div>
      </div>
    </div>
  );
}