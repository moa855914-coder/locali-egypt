import { useOutletContext } from 'react-router-dom';
import { TrendingUp, MapPin, Star, DollarSign, Eye, MousePointerClick, ShieldCheck, Bell } from 'lucide-react';

const STATS = [
  { label: 'Total Bookings (This Month)', value: '1,247', change: '+18%', icon: TrendingUp, color: 'text-success' },
  { label: 'Estimated Commission (EGP)', value: '43,820', change: '+22%', icon: DollarSign, color: 'text-accent' },
  { label: 'Page Views', value: '38,402', change: '+31%', icon: Eye, color: 'text-blue-500' },
  { label: 'WhatsApp Clicks', value: '3,891', change: '+15%', icon: MousePointerClick, color: 'text-green-500' },
];

const TOP_CITIES = [
  { city: 'Hurghada', bookings: 487, pct: 85, color: 'bg-blue-500' },
  { city: 'Sharm El Sheikh', bookings: 342, pct: 60, color: 'bg-teal-500' },
  { city: 'Luxor', bookings: 198, pct: 35, color: 'bg-amber-500' },
  { city: 'Aswan', bookings: 156, pct: 27, color: 'bg-orange-500' },
  { city: 'El Gouna', bookings: 64, pct: 11, color: 'bg-violet-500' },
];

const TOP_SERVICES = [
  { name: 'Red Sea Snorkeling Day Trip', city: 'Hurghada', clicks: 412, bookings: 89, commission: 6503, verified: true },
  { name: 'Valley of the Kings Private Tour', city: 'Luxor', clicks: 287, bookings: 61, commission: 7381, verified: true },
  { name: 'Ras Mohammed Diving Tour', city: 'Sharm', clicks: 341, bookings: 74, commission: 9744, verified: true },
  { name: 'Abu Simbel Day Trip', city: 'Aswan', clicks: 213, bookings: 48, commission: 9504, verified: true },
  { name: 'Quad Bike Desert Safari', city: 'Hurghada', clicks: 301, bookings: 63, commission: 2835, verified: true },
];

const TRACKING_RECENT = [
  { code: 'LOC-HUR-TOU-A4X2K', service: 'Snorkeling Trip', city: 'Hurghada', status: 'Confirmed', commission: 59.5 },
  { code: 'LOC-LUX-TOU-B8Y7R', service: 'Valley of Kings', city: 'Luxor', status: 'Confirmed', commission: 77 },
  { code: 'LOC-SHA-DIV-C3Z1P', service: 'Diving Ras Mohammed', city: 'Sharm', status: 'Pending', commission: 84 },
  { code: 'LOC-ASW-TOU-D9W5T', service: 'Abu Simbel Trip', city: 'Aswan', status: 'Confirmed', commission: 126 },
  { code: 'LOC-HUR-BCH-E2V4L', service: 'Giftun Island Beach', city: 'Hurghada', status: 'Confirmed', commission: 42 },
];

const NOTIFICATIONS = [
  { type: 'deal', msg: '🔥 New deal in Hurghada: 20% off snorkeling today only', time: '2 min ago' },
  { type: 'booking', msg: '✅ New booking: Valley of Kings tour — LOC-LUX-TOU-B8Y7R', time: '15 min ago' },
  { type: 'alert', msg: '⚠️ Price update: Taxi rates in Luxor increased +10 EGP avg', time: '1 hour ago' },
  { type: 'deal', msg: '🎯 Flash deal: El Gouna kitesurfing — 15% off this weekend', time: '3 hours ago' },
  { type: 'booking', msg: '✅ New booking: Abu Simbel trip — LOC-ASW-TOU-D9W5T', time: '5 hours ago' },
];

export default function AnalyticsDashboard() {
  const { lang } = useOutletContext();

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">Locali Egypt — Live Performance Overview</p>
        </div>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 mb-6 text-xs text-muted-foreground">
        📊 Simulation mode — data is representative. Connect backend for live figures.
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <Icon className={`w-5 h-5 mb-2 ${s.color}`} />
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              <span className="text-[10px] font-bold text-success">{s.change} vs last month</span>
            </div>
          );
        })}
      </div>

      {/* Top Cities */}
      <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Top Cities by Bookings</h2>
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-8">
        <div className="space-y-4">
          {TOP_CITIES.map((c, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold">{c.city}</span>
                <span className="font-extrabold text-accent">{c.bookings} bookings</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services */}
      <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Top Services by Commission</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-8">
        <div className="grid grid-cols-5 px-4 py-2 bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <span className="col-span-2">Service</span>
          <span className="text-center">Clicks</span>
          <span className="text-center">Bookings</span>
          <span className="text-right">Commission (EGP)</span>
        </div>
        {TOP_SERVICES.map((s, i) => (
          <div key={i} className="grid grid-cols-5 px-4 py-3 border-t border-border/20 items-center">
            <div className="col-span-2">
              <p className="font-semibold text-xs">{s.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{s.city}</span>
                {s.verified && <ShieldCheck className="w-2.5 h-2.5 text-success" />}
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">{s.clicks}</p>
            <p className="text-xs text-center font-bold">{s.bookings}</p>
            <p className="text-xs text-right font-extrabold text-accent">{s.commission.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent Tracking Codes */}
      <h2 className="text-lg font-extrabold mb-4">Recent Tracking Codes</h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-8">
        {TRACKING_RECENT.map((t, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-border/20 last:border-0">
            <div>
              <p className="font-mono text-xs font-bold">{t.code}</p>
              <p className="text-[10px] text-muted-foreground">{t.service} · {t.city}</p>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === 'Confirmed' ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-600'}`}>{t.status}</span>
              <p className="text-xs font-extrabold text-accent mt-0.5">{t.commission} EGP</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <h2 className="text-lg font-extrabold mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-accent" /> Recent Notifications</h2>
      <div className="space-y-2">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 px-4 py-3 flex items-start justify-between gap-3">
            <p className="text-sm">{n.msg}</p>
            <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}