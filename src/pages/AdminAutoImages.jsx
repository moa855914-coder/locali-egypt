import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image, Play, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';

const ENTITIES = [
  { id: 'Service', label: 'Services', description: 'Restaurants, transport, medical, activities…' },
  { id: 'Place', label: 'Places (Locali)', description: 'Locali host listings' },
  { id: 'HiddenGemPlace', label: 'Hidden Gems', description: 'Hidden gem locations' },
];

export default function AdminAutoImages() {
  const [selected, setSelected] = useState('Service');
  const [limit, setLimit] = useState(30);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    const res = await base44.functions.invoke('autoFillMissingImages', { entity: selected, limit });
    setResult(res.data);
    setRunning(false);
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Image className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Auto-Fill Missing Images</h1>
          <p className="text-sm text-muted-foreground">Fetches photos from Pexels & Unsplash for records missing images</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-5 mb-5">
        {/* Entity selector */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Select Entity</label>
          <div className="space-y-2">
            {ENTITIES.map(e => (
              <button key={e.id} onClick={() => setSelected(e.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${selected === e.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'}`}>
                <p className="font-bold text-sm">{e.label}</p>
                <p className="text-xs text-muted-foreground">{e.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Limit */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
            Max records to process: <span className="text-accent">{limit}</span>
          </label>
          <input type="range" min={5} max={100} step={5} value={limit}
            onChange={e => setLimit(parseInt(e.target.value))}
            className="w-full accent-accent" />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>5</span><span>50</span><span>100</span>
          </div>
        </div>

        <button onClick={run} disabled={running}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl font-bold disabled:opacity-50">
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Processing…' : `Fill Missing Images for ${ENTITIES.find(e => e.id === selected)?.label}`}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-3">Results for {result.entity}</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-success/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-success">{result.updated}</p>
              <p className="text-[10px] text-muted-foreground">Updated</p>
            </div>
            <div className="bg-destructive/10 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-destructive">{result.failed}</p>
              <p className="text-[10px] text-muted-foreground">No Image Found</p>
            </div>
            <div className="bg-secondary rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-muted-foreground">{result.skipped}</p>
              <p className="text-[10px] text-muted-foreground">Skipped</p>
            </div>
          </div>

          {result.details?.length > 0 && (
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {result.details.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {d.status === 'updated'
                    ? <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                    : <XCircle className="w-3.5 h-3.5 text-destructive shrink-0" />}
                  <span className="truncate font-medium">{d.name}</span>
                  {d.url && (
                    <img src={d.url} alt="" className="w-8 h-6 object-cover rounded ml-auto shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          <button onClick={run} disabled={running}
            className="mt-4 w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm font-bold hover:bg-secondary transition-colors">
            <RefreshCw className="w-4 h-4" /> Run Again
          </button>
        </div>
      )}
    </div>
  );
}