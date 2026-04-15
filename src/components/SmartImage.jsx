/**
 * SmartImage — Drop-in image component with auto fallback chain:
 *   real photo → Unsplash stock (category-matched) → gradient placeholder
 *
 * Props:
 *   place      — { id, name, category, image?, photo?, photos? }
 *   width      — number (default 600)
 *   height     — number (default 400)
 *   className  — extra classes for the img/div
 *   alt        — alt text override
 */
import { useState } from 'react';
import { getStockImageUrl, getCategoryGradient, CATEGORY_EMOJI } from '../lib/imageSystem';

export default function SmartImage({ place = {}, width = 600, height = 400, className = '', alt }) {
  const realUrl = place.main_image || place.image || place.photo || place.photos?.[0] || null;
  const identifier = place.id || place.name || 'place';
  const stockUrl = getStockImageUrl(identifier, place.category, { width, height });

  const [src, setSrc] = useState(realUrl || stockUrl);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [source, setSource] = useState(realUrl ? 'real' : 'stock');

  const handleError = () => {
    if (source === 'real') {
      // Fallback to stock
      setSrc(stockUrl);
      setSource('stock');
    } else {
      // All sources failed → show gradient placeholder
      setFailed(true);
    }
  };

  const gradient = getCategoryGradient(place.category);
  const emoji = CATEGORY_EMOJI[place.category?.toLowerCase()] || CATEGORY_EMOJI.default;
  const altText = alt || place.name || place.category || 'Place image';

  if (failed) {
    return (
      <div className={`bg-gradient-to-br ${gradient} flex flex-col items-center justify-center ${className}`}>
        <span className="text-4xl mb-1 opacity-60">{emoji}</span>
        <span className="text-xs text-muted-foreground/60 font-medium capitalize">
          {place.category?.replace(/_/g, ' ') || 'Place'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton while loading */}
      {!loaded && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse flex items-center justify-center`}>
          <span className="text-3xl opacity-40">{emoji}</span>
        </div>
      )}
      <img
        src={src}
        alt={altText}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {/* Subtle source badge */}
      {loaded && source === 'stock' && (
        <div className="absolute bottom-1.5 right-1.5 bg-black/30 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full">
          📷 Stock
        </div>
      )}
    </div>
  );
}