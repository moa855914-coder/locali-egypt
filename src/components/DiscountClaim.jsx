import { useState } from 'react';
import { Tag, X, Copy, Check, ChevronDown } from 'lucide-react';

export default function DiscountClaim({ businessName, compact = false }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText('LOCALI');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Inline strip */}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className={`w-full flex items-center justify-between gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 hover:bg-amber-500/15 transition-colors ${compact ? 'text-[10px]' : 'text-xs'}`}
      >
        <div className="flex items-center gap-1.5">
          <Tag className={compact ? 'w-3 h-3 text-amber-600' : 'w-3.5 h-3.5 text-amber-600'} />
          <span className="font-bold text-amber-700">Show this page or use code <span className="font-mono bg-amber-500/20 px-1 rounded">LOCALI</span> for 10% off</span>
        </div>
        <ChevronDown className="w-3 h-3 text-amber-600 shrink-0" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card w-full max-w-sm rounded-2xl border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="font-extrabold text-sm">Claim Your 10% Discount</span>
              </div>
              <button onClick={() => setOpen(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>

            <div className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                {businessName ? `Show this to ${businessName}` : 'Show this to the business'} or enter the code at checkout:
              </p>

              {/* Big code display */}
              <div className="bg-secondary rounded-2xl p-5 text-center mb-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Your Discount Code</p>
                <p className="text-4xl font-black tracking-widest text-accent font-mono">LOCALI</p>
                <p className="text-xs text-muted-foreground mt-1">10% off — verified by Locali Egypt</p>
              </div>

              <button onClick={copy}
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm mb-3 hover:opacity-90 transition-opacity">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              {/* Show to business card */}
              <div className="border-2 border-dashed border-accent/30 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">📱 Show this screen to the business</p>
                <p className="text-sm font-bold">I found this listing on <span className="text-accent">Locali Egypt</span></p>
                <p className="text-xs text-muted-foreground mt-1">Code <strong>LOCALI</strong> — I am entitled to 10% discount on this service.</p>
              </div>

              <p className="text-[10px] text-muted-foreground text-center mt-3">
                This discount is provided by Locali Egypt verified partners. Valid for one use per visit.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}