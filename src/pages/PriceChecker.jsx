import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CITIES, t, getCityName } from '../lib/constants';
import { DollarSign, Search, Zap, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';
import LiveTrustBadge from '../components/LiveTrustBadge';
import VerifiedPriceCard from '../components/VerifiedPriceCard';
import { getCachedPrice, setCachedPrice } from '../lib/priceCache';

const PRICE_CATEGORIES = ['transport', 'food', 'accommodation', 'activities', 'shopping', 'telecom', 'medical'];

// Popular presets for quick lookup
const QUICK_ITEMS = [
  { item: 'Short taxi ride (5–10 min)', category: 'taxi' },
  { item: 'Bottled water 500ml', category: 'food_drinks' },
  { item: 'Restaurant meal (local)', category: 'food_drinks' },
  { item: 'SIM card with data', category: 'telecom' },
  { item: 'Day trip snorkeling tour', category: 'activities' },
  { item: 'Hotel room (3-star)', category: 'accommodation' },
];

export default function PriceChecker() {
  const { lang } = useOutletContext();
  const qc = useQueryClient();
  const [selectedCity, setSelectedCity] = useState('hurghada');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [verifiedResults, setVerifiedResults] = useState([]);
  const [verifying, setVerifying] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const { data: prices = [], isLoading } = useQuery({
    queryKey: ['prices', selectedCity, selectedCategory],
    queryFn: () => {
      const filter = {};
      if (selectedCity !== 'all') filter.city = selectedCity;
      if (selectedCategory) filter.category = selectedCategory;
      return Object.keys(filter).length > 0
        ? base44.entities.PriceGuide.filter(filter, 'item', 50)
        : base44.entities.PriceGuide.list('item', 50);
    },
  });

  const filtered = prices.filter(p =>
    !search || p.item.toLowerCase().includes(search.toLowerCase())
  );

  const verifyItem = async (item, category) => {
    setActiveItem(item);
    setVerifying(true);
    // Check client cache first
    const city = selectedCity === 'all' ? 'hurghada' : selectedCity;
    const cached = getCachedPrice(item, city, category || 'default');
    if (cached) {
      setVerifiedResults(prev => {
        const filtered = prev.filter(r => r.item !== item);
        return [{ item, city, category, ...cached, from_cache: true }, ...filtered];
      });
      setVerifying(false);
      return;
    }
    const res = await base44.functions.invoke('verifyPrices', {
      items: [{ item, category: category || 'default', city }],
    });
    const result = res.data?.results?.[0];
    if (result && !result.error) {
      setCachedPrice(item, city, category || 'default', result);
      setVerifiedResults(prev => {
        const filtered = prev.filter(r => r.item !== item);
        return [result, ...filtered];
      });
    }
    setVerifying(false);
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('price_checker', lang)}</h1>
          <p className="text-sm text-muted-foreground">Google Places + AI verified · Know before you pay</p>
          <LiveTrustBadge records={prices} reportCount={240} className="mt-1" />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items (e.g. taxi, water, SIM card)..."
            className="w-full pl-10 pr-4 py-3 bg-card rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCity('all')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCity === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
            }`}
          >
            {t('all_cities', lang)}
          </button>
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCity === city.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
              }`}
            >
              {getCityName(city, lang)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory('')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              !selectedCategory ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'
            }`}
          >
            All
          </button>
          {PRICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                selectedCategory === cat ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Verified results */}
      {verifiedResults.length > 0 && (
        <div className="mb-6">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">🔍 Verified Results</p>
          <div className="space-y-3">
            {verifiedResults.map((r, i) => (
              <VerifiedPriceCard key={i} result={r}
                onRefresh={() => verifyItem(r.item, r.category)} />
            ))}
          </div>
        </div>
      )}

      {/* Quick verify presets */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">⚡ Quick Price Check</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ITEMS.map((qi, i) => {
            const isActive = activeItem === qi.item && verifying;
            const result = verifiedResults.find(r => r.item === qi.item);
            return (
              <button key={i} onClick={() => verifyItem(qi.item, qi.category)}
                disabled={verifying}
                className="flex items-start gap-2 p-3 bg-card border border-border rounded-xl hover:border-accent/40 transition-all text-left disabled:opacity-60">
                {isActive
                  ? <Loader2 className="w-3.5 h-3.5 text-accent animate-spin shrink-0 mt-0.5" />
                  : <Zap className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{qi.item}</p>
                  {result && !result.error ? (
                    <p className="text-[10px] text-emerald-600 font-bold">
                      {result.min}–{result.max} EGP
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground capitalize">{qi.category.replace('_', ' ')}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-[10px] font-bold">
        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-emerald-700">Google Verified</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-amber-700">AI Estimated</span>
        </div>
      </div>

      {/* Price List from DB */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">📋 Price Database</p>
          <div className="space-y-3">
            {filtered.map((price) => (
              <div key={price.id} className="bg-card rounded-2xl border border-border/50 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm">{price.item}</h3>
                    <span className="text-[10px] text-muted-foreground capitalize">{price.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {price.city !== 'all' && (
                      <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full capitalize">
                        {price.city?.replace('-', ' ')}
                      </span>
                    )}
                    <button onClick={() => verifyItem(price.item, price.category)}
                      disabled={verifying && activeItem === price.item}
                      className="flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full hover:bg-accent/20 transition-colors disabled:opacity-50">
                      {verifying && activeItem === price.item
                        ? <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        : <Zap className="w-2.5 h-2.5" />}
                      Verify
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-success/5 rounded-xl p-3 text-center">
                    <p className="text-lg font-extrabold text-success">{price.local_price} EGP</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t('local_price', lang)}</p>
                  </div>
                  <div className="bg-accent/5 rounded-xl p-3 text-center border-2 border-accent/20">
                    <p className="text-lg font-extrabold text-accent">{price.fair_tourist_price} EGP</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t('fair_price', lang)}</p>
                  </div>
                  {price.scam_price && (
                    <div className="bg-destructive/5 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                        <p className="text-lg font-extrabold text-destructive">{price.scam_price} EGP</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t('scam_price', lang)}</p>
                    </div>
                  )}
                </div>
                {price.notes && (
                  <p className="text-xs text-muted-foreground mt-3 italic">{price.notes}</p>
                )}
                {/* Show verified result inline if available */}
                {verifiedResults.find(r => r.item === price.item) && (
                  <div className="mt-3 pt-3 border-t border-border/40">
                    <VerifiedPriceCard compact result={verifiedResults.find(r => r.item === price.item)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No prices found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Try a different search or category</p>
        </div>
      )}

      <div className="mt-8">
        <SafeNextStep
          title="Found a wrong price?"
          description="Help fellow tourists — report real prices"
          to="/services"
        />
      </div>
    </div>
  );
}