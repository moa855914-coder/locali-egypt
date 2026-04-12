/**
 * VerifiedPriceCard — displays a verified price result from the pipeline.
 *
 * Props:
 *   result  — price object from verifyPrices backend
 *   compact — optional boolean for compact mode
 */
import { CheckCircle2, Clock, Zap, AlertCircle, RefreshCw } from 'lucide-react';

const SOURCE_CONFIG = {
  google_places: {
    label: 'Google Places',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  ai_estimated: {
    label: 'AI Estimate',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    dot: 'bg-amber-400',
  },
  manual_verified: {
    label: 'Manually Verified',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-500',
  },
  cached: {
    label: 'Cached',
    icon: Clock,
    color: 'text-gray-500',
    bg: 'bg-gray-50 border-gray-200',
    dot: 'bg-gray-400',
  },
};

const CONFIDENCE_BAR = {
  high:      { width: 'w-[90%]', color: 'bg-emerald-500', label: 'High' },
  medium:    { width: 'w-[60%]', color: 'bg-amber-400',   label: 'Medium' },
  estimated: { width: 'w-[40%]', color: 'bg-orange-400',  label: 'Estimated' },
  low:       { width: 'w-[25%]', color: 'bg-red-400',     label: 'Low' },
};

export default function VerifiedPriceCard({ result, compact = false, onRefresh }) {
  if (!result) return null;
  if (result.error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        No price data available for this item
      </div>
    );
  }

  const src = SOURCE_CONFIG[result.source] || SOURCE_CONFIG.ai_estimated;
  const SrcIcon = src.icon;
  const conf = CONFIDENCE_BAR[result.confidence] || CONFIDENCE_BAR.estimated;

  const updatedText = result.updated
    ? (() => {
        const d = Math.floor((Date.now() - new Date(result.updated).getTime()) / 3600_000);
        return d < 1 ? 'Just updated' : d < 24 ? `${d}h ago` : `${Math.floor(d / 24)}d ago`;
      })()
    : null;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${src.bg} text-xs`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${src.dot}`} />
        <span className="font-extrabold text-foreground">
          {result.min}–{result.max} {result.currency || 'EGP'}
        </span>
        <span className={`font-medium ${src.color}`}>· {src.label}</span>
        {updatedText && <span className="text-muted-foreground ml-auto">🕒 {updatedText}</span>}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-4 ${src.bg}`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${src.dot}`} />
          <div>
            <p className="font-extrabold text-sm text-foreground">
              {result.item}
            </p>
            {result.city && (
              <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                📍 {result.city.replace('-', ' ')}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1 text-[10px] font-extrabold ${src.color}`}>
            <SrcIcon className="w-3 h-3" />
            {src.label}
          </span>
          {onRefresh && (
            <button onClick={onRefresh}
              className="w-6 h-6 rounded-lg hover:bg-white/60 flex items-center justify-center transition-colors">
              <RefreshCw className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="bg-white/70 rounded-xl p-3 mb-3 text-center">
        <p className="text-2xl font-black text-foreground">
          {result.min} – {result.max}
        </p>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          {result.currency || 'EGP'} · verified range
        </p>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Confidence</span>
          <span className={`text-[10px] font-extrabold ${src.color}`}>
            {conf.label}
            {result.confidence_score && ` (${Math.round(result.confidence_score * 100)}%)`}
          </span>
        </div>
        <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${conf.width} ${conf.color}`} />
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
        {result.source_count > 0 && (
          <span>📊 {result.source_count} reference{result.source_count > 1 ? 's' : ''}</span>
        )}
        {updatedText && <span>🕒 {updatedText}</span>}
        {result.from_cache && <span>⚡ From cache</span>}
      </div>

      {/* Notes */}
      {result.notes && (
        <p className="mt-2 pt-2 border-t border-black/5 text-[11px] text-muted-foreground italic">
          {result.source === 'ai_estimated'
            ? `⚠️ Estimated — ${result.notes}`
            : `💡 ${result.notes}`}
        </p>
      )}
    </div>
  );
}