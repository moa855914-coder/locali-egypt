import { useState } from 'react';
import { t } from '../lib/constants';
import { useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bot, Sparkles, DollarSign, AlertTriangle, ShieldCheck, ChevronRight, Users } from 'lucide-react';
import CityLivePanel from '../components/CityLivePanel';
import LiveTrustBadge from '../components/LiveTrustBadge';

const CITIES = [
  { id: 'hurghada', label: 'Hurghada', emoji: '🤿' },
  { id: 'sharm-el-sheikh', label: 'Sharm', emoji: '🐠' },
  { id: 'luxor', label: 'Luxor', emoji: '🏛️' },
  { id: 'aswan', label: 'Aswan', emoji: '🛶' },
  { id: 'el-gouna', label: 'El Gouna', emoji: '🌊' },
];

const CORE_ACTIONS = [
  {
    icon: DollarSign,
    label: 'Price Checker',
    labelKey: 'price_checker',
    micro: 'Know the real price before you pay',
    to: '/price-checker',
    highlight: true,
    color: 'bg-accent text-accent-foreground',
    iconBg: 'bg-white/20',
  },
  {
    icon: AlertTriangle,
    label: 'Pricing Insights',
    labelKey: 'pricing_insights',
    micro: 'Community-verified price transparency',
    to: '/price-insights',
    highlight: false,
    color: 'bg-amber-50 text-amber-800',
    iconBg: 'bg-amber-100',
  },
  {
    icon: ShieldCheck,
    label: 'Verified Services',
    labelKey: 'verified_services',
    micro: 'Book trusted drivers and services',
    to: '/services',
    highlight: false,
    color: 'bg-emerald-50 text-emerald-800',
    iconBg: 'bg-emerald-100',
  },
];

const TRUST_ITEMS = [
  { icon: '👥', text: '2,000+ travelers' },
  { icon: '📋', text: 'Real tourist reports' },
  { icon: '✅', text: 'Verified services' },
];

export default function Home() {
  const { openAIChat, lang = 'en' } = useOutletContext();
  const [selectedCity, setSelectedCity] = useState('hurghada');
  const [aiInput, setAiInput] = useState('');

  const { data: liveData } = useQuery({
    queryKey: ['liveInfo'],
    queryFn: async () => {
      const [rates, situation] = await Promise.all([
        base44.entities.CurrencyRate.list('-created_date', 1),
        base44.entities.LiveSituation.filter({ city: 'global' }, '-created_date', 1),
      ]);
      return {
        usd: rates?.[0]?.usd,
        status: situation?.[0]?.status || 'green',
        statusText: situation?.[0]?.recommendation || 'Normal',
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const statusColor = liveData?.status === 'red' ? 'text-red-600' : liveData?.status === 'yellow' ? 'text-amber-500' : 'text-emerald-600';
  const statusDot = liveData?.status === 'red' ? 'bg-red-500' : liveData?.status === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">

      {/* ── 1. HERO ── */}
      <div className="-mx-4 relative mb-6">
        {/* Background image */}
        <img
          src="https://media.base44.com/images/public/69c689e2d4aa000453950c3f/1b2cecb1f_generated_image.png"
          alt="Local life in Egypt"
          className="w-full h-72 object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white rounded-full px-3 py-1 text-[11px] font-bold mb-3 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Egypt's #1 Tourist Safety Platform
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight text-white mb-1.5">
            Navigate Egypt.<br />
            <span style={{ color: '#D8B58A' }}>Like a Local.</span>
          </h1>
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            Avoid scams, know real prices, and book verified services safely in Egypt.
          </p>
          {/* Primary CTA */}
          <Link
            to="/price-checker"
            className="flex items-center justify-between bg-accent text-accent-foreground px-5 py-3.5 rounded-2xl font-black text-base shadow-lg shadow-black/30 hover:opacity-95 transition-opacity mb-3"
          >
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t('check_prices', lang)}
            </span>
            <ChevronRight className="w-5 h-5 opacity-70" />
          </Link>
        </div>
      </div>

      <div className="pb-2">
        {/* AI Search (secondary) */}
        <button
          onClick={openAIChat}
          className="w-full flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-xl hover:border-accent/40 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm text-muted-foreground flex-1">Ask your Egypt guide…</span>
          <div className="flex items-center gap-1 bg-accent/10 rounded-full px-2 py-0.5">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-bold text-accent">AI</span>
          </div>
        </button>
      </div>

      {/* ── 2. CITY SELECTION ── */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t('select_city', lang)}</p>
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {CITIES.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedCity === city.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border text-foreground'
                }`}
              >
                <span>{city.emoji}</span>
                {city.label}
              </button>
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
        {/* City Live Panel */}
        <div className="mt-3">
          <CityLivePanel cityId={selectedCity} lang={lang} />
        </div>
      </div>

      {/* ── 3. CORE ACTIONS ── */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">{t('services', lang)}</p>
        <div className="space-y-3">
          {CORE_ACTIONS.map((action) => {
            const Icon = action.icon;
            const cityParam = selectedCity ? `?city=${selectedCity}` : '';
            const href = action.to + (action.to === '/price-checker' || action.to === '/scam-map' ? cityParam : '');
            return (
              <Link
                key={action.label}
                to={href}
                className={`flex items-center gap-4 p-4 rounded-2xl ${action.color} ${action.highlight ? 'shadow-md shadow-accent/15' : 'border border-current/10'} transition-all active:scale-[0.98]`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${action.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-extrabold text-sm ${action.highlight ? '' : ''}`}>{t(action.labelKey, lang) || action.label}</p>
                  <p className={`text-xs mt-0.5 ${action.highlight ? 'opacity-80' : 'opacity-60'}`}>{action.micro}</p>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 4. TRUST STRIP ── */}
      <div className="bg-card border border-border rounded-2xl px-4 py-3 mb-6 space-y-2">
        <LiveTrustBadge lastUpdated={new Date().toISOString()} reportCount={2000} label="travelers" />
        <div className="flex items-center justify-between">
          {TRUST_ITEMS.map((t, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1">
              <span className="text-lg">{t.icon}</span>
              <p className="text-[10px] font-bold text-muted-foreground leading-tight">{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. SMART HELP (AI / Ask a Local) ── */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-extrabold text-sm">{t('ask_local', lang)}</h3>
            <p className="text-xs text-muted-foreground">{t('ask_local', lang)}</p>
          </div>
          <Link to="/ask-a-local" className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 hover:bg-accent/20 active:scale-95 transition-all">
            <Users className="w-4 h-4 text-accent" />
          </Link>
        </div>
        <div className="flex gap-2">
          <input
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && openAIChat()}
            placeholder={t('search_placeholder', lang)}
            className="flex-1 bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none border border-transparent focus:border-accent/30"
          />
          <button
            onClick={openAIChat}
            className="w-10 h-10 bg-accent text-accent-foreground rounded-xl flex items-center justify-center shrink-0"
          >
            <Bot className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 6. LIVE INFO ── */}
      <div className="flex gap-3">
        <div className="flex-1 bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
          <span className="text-base">💵</span>
          <div>
            <p className="text-[10px] text-muted-foreground font-medium">USD → EGP</p>
            <p className="font-extrabold text-sm">{liveData?.usd ? `${liveData.usd}` : '—'}</p>
          </div>
        </div>
        <div className="flex-1 bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot}`} />
          <div>
            <p className="text-[10px] text-muted-foreground font-medium">Travel Status</p>
            <p className={`font-extrabold text-sm ${statusColor}`}>{liveData?.statusText?.split('.')[0] || 'Normal'}</p>
          </div>
        </div>
      </div>

    </div>
  );
}