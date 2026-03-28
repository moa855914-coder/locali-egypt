import { Link } from 'react-router-dom';
import { Radio, CheckCircle2, AlertTriangle, Plane, ArrowRight } from 'lucide-react';

const SITUATION = {
  lastUpdated: 'March 28, 2026',
  touristsArriving: true,
  flightStatus: 'Normal operations',
  activeWarnings: ['UK FCO: Normal precautions for Sharm, Hurghada, Luxor, Aswan', 'Avoid North Sinai (no tourist sites there)'],
  overallStatus: 'GREEN',
  summary: 'Tourist areas operating normally. Flights running on schedule. No alerts affecting Sharm El Sheikh, Hurghada, Luxor or Aswan.',
};

export default function LiveSituationBanner() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-success/10 border-b border-success/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-success uppercase tracking-wide">Live Situation Update</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Updated {SITUATION.lastUpdated}</span>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm font-medium">{SITUATION.summary}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-success/5 rounded-xl px-3 py-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Tourists Arriving</p>
              <p className="text-xs font-bold">{SITUATION.touristsArriving ? 'Yes — normally' : 'Limited'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-success/5 rounded-xl px-3 py-2">
            <Plane className="w-4 h-4 text-success shrink-0" />
            <div>
              <p className="text-[10px] text-muted-foreground">Flights</p>
              <p className="text-xs font-bold">{SITUATION.flightStatus}</p>
            </div>
          </div>
        </div>

        {SITUATION.activeWarnings.length > 0 && (
          <div className="space-y-1">
            {SITUATION.activeWarnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                {w}
              </div>
            ))}
          </div>
        )}

        <Link to="/egypt-safe-now" className="flex items-center justify-between text-xs font-bold text-accent hover:underline pt-1">
          Full safety assessment
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}