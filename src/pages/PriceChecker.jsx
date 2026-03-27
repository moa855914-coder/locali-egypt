import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CITIES, t, getCityName } from '../lib/constants';
import { DollarSign, Search, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

const PRICE_CATEGORIES = ['transport', 'food', 'accommodation', 'activities', 'shopping', 'telecom', 'medical'];

export default function PriceChecker() {
  const { lang } = useOutletContext();
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

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

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('price_checker', lang)}</h1>
          <p className="text-sm text-muted-foreground">Know before you pay</p>
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

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-[10px] font-bold">
        <div className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3 text-success" />
          <span className="text-success">{t('local_price', lang)}</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3 text-accent" />
          <span className="text-accent">{t('fair_price', lang)}</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-destructive" />
          <span className="text-destructive">{t('scam_price', lang)}</span>
        </div>
      </div>

      {/* Price List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((price) => (
            <div key={price.id} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm">{price.item}</h3>
                  <span className="text-[10px] text-muted-foreground capitalize">{price.category}</span>
                </div>
                {price.city !== 'all' && (
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full capitalize">
                    {price.city?.replace('-', ' ')}
                  </span>
                )}
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
            </div>
          ))}
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