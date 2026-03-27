import { Star, MapPin, Tag } from 'lucide-react';

const PRICE_LABEL = { '€': 'Budget', '€€': 'Mid-range', '€€€': 'Premium' };

export default function ListingCard({ listing }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-bold text-base leading-tight">{listing.name}</h3>
        <span className="text-xs font-bold text-accent shrink-0">{listing.price}</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{listing.desc}</p>
      <div className="flex items-center gap-3 flex-wrap">
        {listing.area && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{listing.area}</span>
          </div>
        )}
        {listing.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-accent fill-accent" />
            <span className="text-sm font-bold">{listing.rating}</span>
          </div>
        )}
        {listing.tags?.map(tag => (
          <span key={tag} className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded-full capitalize">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}