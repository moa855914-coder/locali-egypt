import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin } from 'lucide-react';

export default function ServiceCard({ service }) {
  const priceLabel = { budget: '€', moderate: '€€', premium: '€€€' };

  return (
    <Link
      to={`/service/${service.id}`}
      className="group block bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
    >
      {service.photos?.[0] && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={service.photos[0]}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {service.is_verified && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-success text-success-foreground px-2 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] font-bold">VERIFIED</span>
            </div>
          )}
          {service.is_featured && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2 py-1 rounded-full">
              <span className="text-[10px] font-bold">FEATURED</span>
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground truncate">{service.name}</h3>
          {service.price_range && (
            <span className="text-xs font-bold text-accent shrink-0">
              {priceLabel[service.price_range]}
            </span>
          )}
        </div>
        {service.address && (
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{service.address}</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          {service.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              <span className="text-sm font-bold">{service.avg_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({service.review_count})</span>
            </div>
          )}
          {service.scam_score > 0 && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              service.scam_score > 60 ? 'bg-red-500/10 text-red-600' :
              service.scam_score > 30 ? 'bg-amber-500/10 text-amber-600' :
              'bg-emerald-500/10 text-emerald-600'
            }`}>
              Risk: {service.scam_score}%
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}