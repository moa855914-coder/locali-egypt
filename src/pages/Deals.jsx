import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CITIES, t, getCityName } from '../lib/constants';
import { Sparkles, Clock, Percent, Phone } from 'lucide-react';

export default function Deals() {
  const { lang } = useOutletContext();
  const [selectedCity, setSelectedCity] = useState('');

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['deals', selectedCity],
    queryFn: () => {
      if (selectedCity) {
        return base44.entities.TouristDeal.filter({ city: selectedCity, is_active: true }, '-created_date', 30);
      }
      return base44.entities.TouristDeal.filter({ is_active: true }, '-created_date', 30);
    },
  });

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('deals', lang)}</h1>
          <p className="text-sm text-muted-foreground">Exclusive offers for tourists</p>
        </div>
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        <button
          onClick={() => setSelectedCity('')}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            !selectedCity ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          }`}
        >
          {t('all_cities', lang)}
        </button>
        {CITIES.map(city => (
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

      {/* Deals */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : deals.length > 0 ? (
        <div className="space-y-4">
          {deals.map(deal => (
            <div key={deal.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {deal.photo && (
                <img src={deal.photo} alt={deal.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{deal.title}</h3>
                  {deal.discount_percent && (
                    <span className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-bold shrink-0">
                      <Percent className="w-3 h-3" />
                      {deal.discount_percent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{deal.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    {deal.deal_price && (
                      <div>
                        <span className="text-xl font-extrabold text-accent">{deal.deal_price} EGP</span>
                        {deal.original_price && (
                          <span className="text-sm text-muted-foreground line-through ml-2">{deal.original_price} EGP</span>
                        )}
                      </div>
                    )}
                    {deal.valid_until && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Until {new Date(deal.valid_until).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {deal.whatsapp && (
                    <a
                      href={`https://wa.me/${deal.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi! I saw your deal "${deal.title}" on Locali Egypt and I'm interested.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No active deals right now</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Check back soon for new offers</p>
        </div>
      )}
    </div>
  );
}