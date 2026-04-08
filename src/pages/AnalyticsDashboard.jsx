import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  TrendingUp, MapPin, Star, DollarSign, Eye, MousePointerClick,
  ShieldCheck, Bell, Tag, Users, Building2, BadgeCheck, BarChart2, Zap
} from 'lucide-react';

// ─── Simulated data ───────────────────────────────────────────────────────────
const REVENUE = {
  verified_badges: 38,       // $6/mo each
  featured_listings: 14,     // $15/mo each
  guide_subscriptions: 22,   // $8/mo each
  operator_subscriptions: 9, // $25/mo each
  usd_to_egp: 50,
};

const monthly_usd = () =>
  REVENUE.verified_badges * 6 +
  REVENUE.featured_listings * 15 +
  REVENUE.guide_subscriptions * 8 +
  REVENUE.operator_subscriptions * 25;

const MONTHLY_GROWTH = [
  { month: 'Nov', usd: 180 }, { month: 'Dec', usd: 340 }, { month: 'Jan', usd: 520 },
  { month: 'Feb', usd: 710 }, { month: 'Mar', usd: 940 }, { month: 'Apr', usd: monthly_usd() },
];
const maxUsd = Math.max(...MONTHLY_GROWTH.map(m => m.usd));

const SUBSCRIPTION_LINES = [
  { label: 'Active Verified Badges', icon: BadgeCheck, count: REVENUE.verified_badges, price: 6, color: 'text-success', bg: 'bg-success/10', total: REVENUE.verified_badges * 6 },
  { label: 'Featured Listings', icon: Star, count: REVENUE.featured_listings, price: 15, color: 'text-amber-500', bg: 'bg-amber-500/10', total: REVENUE.featured_listings * 15 },
  { label: 'Guide Subscriptions', icon: Users, count: REVENUE.guide_subscriptions, price: 8, color: 'text-blue-500', bg: 'bg-blue-500/10', total: REVENUE.guide_subscriptions * 8 },
  { label: 'Operator Subscriptions', icon: Building2, count: REVENUE.operator_subscriptions, price: 25, color: 'text-violet-500', bg: 'bg-violet-500/10', total: REVENUE.operator_subscriptions * 25 },
];

const DISCOUNT_STATS = [
  { listing: 'Red Sea Snorkeling Trip', city: 'Hurghada', views: 1240, claims: 312 },
  { listing: 'Valley of the Kings Tour', city: 'Luxor', views: 980, claims: 241 },
  { listing: 'Ras Mohammed Diving', city: 'Sharm', views: 876, claims: 198 },
  { listing: 'Abu Simbel Day Trip', city: 'Aswan', views: 731, claims: 175 },
  { listing: 'El Gouna Kite Course', city: 'El Gouna', views: 412, claims: 88 },
];

const CITY_REVENUE = [
  { city: 'Hurghada', usd: 480, pct: 90, color: 'bg-blue-500' },
  { city: 'Sharm El Sheikh', usd: 340, pct: 64, color: 'bg-teal-500' },
  { city: 'Luxor', usd: 210, pct: 40, color: 'bg-amber-500' },
  { city: 'El Gouna', usd: 180, pct: 34, color: 'bg-violet-500' },
  { city: 'Aswan', usd: 120, pct: 23, color: 'bg-orange-500' },
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
  { type: 'subscription', msg: '💳 New verified badge subscription: Cairo Desert Tours', time: '2 hours ago' },
  { type: 'subscription', msg: '💳 New guide subscription: Ahmed Hassan — Luxor Egyptologist', time: '4 hours ago' },
  { type: 'deal', msg: '🎯 Flash deal: El Gouna kitesurfing — 15% off this weekend', time: '5 hours ago' },
];

const TABS = ['Revenue', 'Bookings', 'Discounts', 'Commissions'];

export default function AnalyticsDashboard() {
  const { lang } = useOutletContext();
  const [tab, setTab] = useState('Revenue');
  const totalUsd = monthly_usd();
  const totalEgp = totalUsd * REVENUE.usd_to_egp;

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <BarChart2 className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Admin Revenue Dashboard</h1>
          <p className="text-sm text-muted-foreground">Locali Egypt — Subscriptions · Bookings · Discount Codes · Commissions</p>
        </div>
      </div>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2 mb-6 text-xs text-muted-foreground">
        📊 Simulation mode — data is representative. Connect backend for live figures.
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── REVENUE TAB ─────────────────────────────────────────────────── */}
      {tab === 'Revenue' && (
        <>
          {/* Total MRR */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 col-span-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Monthly Recurring Revenue</p>
              <p className="text-3xl font-black text-accent">${totalUsd.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">≈ {totalEgp.toLocaleString()} EGP</p>
              <span className="text-[10px] font-bold text-success">+18% vs last month</span>
            </div>
            <div className="bg-card border border-border/50 rounded-2xl p-5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Run Rate</p>
              <p className="text-3xl font-black text-foreground">${(totalUsd * 12).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">≈ {(totalEgp * 12).toLocaleString()} EGP/yr</p>
              <span className="text-[10px] font-bold text-success">Subscriptions only</span>
            </div>
          </div>

          {/* Subscription breakdown */}
          <h2 className="text-base font-extrabold mb-3">Active Subscriptions</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {SUBSCRIPTION_LINES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`rounded-2xl border border-border/50 p-4 ${s.bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-[10px] font-bold text-muted-foreground">${s.price}/mo each</span>
                  </div>
                  <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-xs font-bold mt-1">${s.total}/mo</p>
                </div>
              );
            })}
          </div>

          {/* Monthly growth chart */}
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" /> Monthly Revenue Growth
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
            <div className="flex items-end gap-2 h-32">
              {MONTHLY_GROWTH.map((m, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-accent">${m.usd}</span>
                  <div className="w-full rounded-t-lg bg-accent/80 transition-all"
                    style={{ height: `${Math.round((m.usd / maxUsd) * 100)}%`, minHeight: 4 }} />
                  <span className="text-[9px] text-muted-foreground">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by city */}
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" /> Revenue by City
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
            <div className="space-y-3">
              {CITY_REVENUE.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold">{c.city}</span>
                    <span className="font-extrabold text-accent">${c.usd}/mo</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission prep notice */}
          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4 flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-0.5">7% Booking Commission — Prepared, Not Yet Active</p>
              <p className="text-[11px] text-muted-foreground">Commission tracking fields are live on all listings (hidden from public). Admin can activate per listing individually when ready. Default: 0% (inactive).</p>
            </div>
          </div>
        </>
      )}

      {/* ── BOOKINGS TAB ────────────────────────────────────────────────── */}
      {tab === 'Bookings' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Bookings (This Month)', value: '1,247', change: '+18%', icon: TrendingUp, color: 'text-success' },
              { label: 'Commission Earned (EGP)', value: '43,820', change: '+22%', icon: DollarSign, color: 'text-accent' },
              { label: 'Page Views', value: '38,402', change: '+31%', icon: Eye, color: 'text-blue-500' },
              { label: 'WhatsApp Clicks', value: '3,891', change: '+15%', icon: MousePointerClick, color: 'text-green-500' },
            ].map((s, i) => {
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
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" /> Top Cities by Bookings</h2>
          <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
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
          <h2 className="text-base font-extrabold mb-3">Recent Tracking Codes</h2>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-6">
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
        </>
      )}

      {/* ── DISCOUNTS TAB ───────────────────────────────────────────────── */}
      {tab === 'Discounts' && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total Code Views', value: '4,239', icon: Eye, color: 'text-blue-500' },
              { label: 'Discount Claims', value: '1,014', icon: Tag, color: 'text-amber-500' },
              { label: 'Claim Rate', value: '23.9%', icon: TrendingUp, color: 'text-success' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
          <h2 className="text-base font-extrabold mb-3">Top Listings by Discount Claims</h2>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-6">
            <div className="grid grid-cols-4 px-4 py-2 bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase">
              <span className="col-span-2">Listing</span>
              <span className="text-center">Views</span>
              <span className="text-right">Claims</span>
            </div>
            {DISCOUNT_STATS.map((d, i) => (
              <div key={i} className="grid grid-cols-4 px-4 py-3 border-t border-border/20 items-center">
                <div className="col-span-2">
                  <p className="font-semibold text-xs">{d.listing}</p>
                  <p className="text-[10px] text-muted-foreground">{d.city}</p>
                </div>
                <p className="text-xs text-center text-muted-foreground">{d.views.toLocaleString()}</p>
                <p className="text-xs text-right font-extrabold text-accent">{d.claims}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs text-muted-foreground">
            <strong className="text-foreground">Code: LOCALI</strong> — Universal 10% discount shown on all listings. Businesses agreed to honour this code at verification. Claims tracked per listing view.
          </div>
        </>
      )}

      {/* ── COMMISSIONS TAB ─────────────────────────────────────────────── */}
      {tab === 'Commissions' && (
        <>
          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4 flex items-start gap-3 mb-6">
            <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold mb-0.5">7% Commission System — Prepared · Not Yet Activated</p>
              <p className="text-[11px] text-muted-foreground">Commission rate fields are live on all listings (visible to admin only). Default is 0% (inactive). Admin activates per-listing when ready. All bookings already carry tracking codes for future activation.</p>
            </div>
          </div>
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" /> Top Services by Commission (When Active)
          </h2>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-6">
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

          {/* Notifications */}
          <h2 className="text-base font-extrabold mb-3 flex items-center gap-2"><Bell className="w-4 h-4 text-accent" /> Recent Activity</h2>
          <div className="space-y-2">
            {NOTIFICATIONS.map((n, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 px-4 py-3 flex items-start justify-between gap-3">
                <p className="text-sm">{n.msg}</p>
                <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{n.time}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}