import { useState } from 'react';
import { useLiveRates } from '../hooks/useLiveRates';
import { useSEO } from '../lib/seo';
import { base44 } from '@/api/base44Client';
import SafeNextStep from '../components/SafeNextStep';
import { TrendingUp, RefreshCw, AlertTriangle, CheckCircle2, CreditCard, DollarSign, MapPin, Phone } from 'lucide-react';

const OFFICIAL_RATES_FALLBACK = [
  { currency: 'USD 🇺🇸', symbol: '$', rate: 49.85, flag: '🇺🇸' },
  { currency: 'EUR 🇪🇺', symbol: '€', rate: 54.20, flag: '🇪🇺' },
  { currency: 'GBP 🇬🇧', symbol: '£', rate: 62.90, flag: '🇬🇧' },
  { currency: 'RUB 🇷🇺', symbol: '₽', rate: 0.555, flag: '🇷🇺' },
  { currency: 'PLN 🇵🇱', symbol: 'zł', rate: 12.15, flag: '🇵🇱' },
  { currency: 'CAD 🇨🇦', symbol: 'CA$', rate: 36.20, flag: '🇨🇦' },
  { currency: 'AUD 🇦🇺', symbol: 'A$', rate: 31.50, flag: '🇦🇺' },
  { currency: 'SAR 🇸🇦', symbol: 'SR', rate: 13.30, flag: '🇸🇦' },
];

const BANK_HOTLINES = [
  { name: 'Banque Misr', hotline: '19888', desc: 'خط ساخن 24/7 — الموقع الرسمي: banquemisr.com', verified: true },
  { name: 'CIB Egypt', hotline: '19666', desc: 'خدمة عملاء — من أي خط داخل مصر', verified: true },
  { name: 'NBE (National Bank of Egypt)', hotline: '19623', desc: 'البنك الأهلي المصري — 24/7', verified: true },
  { name: 'QNB Egypt', hotline: '19700', desc: 'بنك قطر الوطني مصر', verified: true },
];

const EXCHANGE_TIPS_BY_CITY = {
  'sharm-el-sheikh': [
    { name: 'Banque Misr (Naama Bay) — ☎ 19888', type: 'Bank ATM', rating: '✅ Best', note: 'Official bank rate. Inside branch premises. Most reliable ATM in Naama Bay.' },
    { name: 'CIB ATM (Naama Bay Mall) — ☎ 19666', type: 'Bank ATM', rating: '✅ Good', note: 'Low fees. Part of major Egyptian bank network.' },
    { name: 'NBE — National Bank of Egypt — ☎ 19623', type: 'Bank', rating: '✅ Good', note: 'Official exchange desk. Good rates, slightly slower.' },
    { name: 'Hotel reception exchange desk', type: 'Exchange', rating: '⚠️ Acceptable', note: '5–8% worse than bank rate. Use only for convenience.' },
    { name: 'Airport kiosk', type: 'Exchange', rating: '❌ Avoid', note: 'Worst rate at the airport. Use only for emergency EGP on arrival.' },
    { name: 'Street money changers', type: 'Unofficial', rating: '🚫 Never', note: 'Illegal. Common counterfeit notes. Not worth any "better rate" they claim.' },
  ],
  hurghada: [
    { name: 'Banque Misr (Marina area) — ☎ 19888', type: 'Bank ATM', rating: '✅ Best', note: 'Inside branch. Highest reliability, lowest ATM fees.' },
    { name: 'CIB (Sahl Hasheesh) — ☎ 19666', type: 'Bank ATM', rating: '✅ Good', note: 'Consistent service. Good for large withdrawals.' },
    { name: 'NBE (El Dahar) — ☎ 19623', type: 'Bank', rating: '✅ Good', note: 'Good official exchange rate at teller.' },
    { name: 'QNB ATM (Marina road) — ☎ 19700', type: 'Bank ATM', rating: '✅ Good', note: 'Qatar National Bank. Good rates, reliable.' },
    { name: 'Alex Bank (New Hurghada)', type: 'Bank ATM', rating: '✅ Good', note: 'Less queue than Banque Misr during peak hours.' },
    { name: 'Airport exchange kiosk', type: 'Exchange', rating: '❌ Avoid', note: '8–12% worse than official rate. Same as all airports.' },
  ],
  luxor: [
    { name: 'Banque Misr (Corniche) — ☎ 19888', type: 'Bank ATM', rating: '✅ Best', note: 'Main branch, reliable supply. Best on East Bank.' },
    { name: 'NBE (Luxor Temple Road) — ☎ 19623', type: 'Bank', rating: '✅ Good', note: 'Official exchange desk. Good rates for large amounts.' },
    { name: 'CIB (East Bank) — ☎ 19666', type: 'Bank ATM', rating: '✅ Good', note: 'Reliable. Lower risk of skimming.' },
    { name: 'Hotel Corniche exchange', type: 'Exchange', rating: '⚠️ Acceptable', note: 'Add 5–8% buffer. Convenient if ATM has no cash.' },
    { name: '⚠️ West Bank — NO ATMs', type: 'Warning', rating: '🚫 None', note: 'Zero reliable ATMs near Valley of Kings or Karnak West Bank. Withdraw everything before crossing the Nile.' },
  ],
  aswan: [
    { name: 'Banque Misr (Corniche) — ☎ 19888', type: 'Bank ATM', rating: '✅ Best', note: 'Corniche area. Most reliable in Aswan.' },
    { name: 'NBE (Train Station area) — ☎ 19623', type: 'Bank ATM', rating: '✅ Good', note: 'Good for immediate arrival needs from the train.' },
    { name: 'Egyptian Arab Land Bank', type: 'Bank ATM', rating: '✅ Good', note: 'Less known but reliable. Usually shorter queues.' },
    { name: '⚠️ Abu Simbel — ZERO ATMs', type: 'Warning', rating: '🚫 None', note: 'Bring ALL cash before leaving Aswan. Abu Simbel site has no banking infrastructure.' },
    { name: 'Corniche exchange bureau', type: 'Exchange', rating: '⚠️ Acceptable', note: 'Count every note before leaving the desk. Shortchange errors "happen" regularly.' },
  ],
};

const ATM_TIPS = [
  { icon: '💳', title: 'Use bank ATMs inside branch premises', desc: 'ATMs inside or directly attached to bank branches have significantly lower skimming risk and more reliable supply of cash.' },
  { icon: '💰', title: 'Withdrawal limits', desc: 'Most Egyptian ATMs limit 3,000–5,000 EGP per transaction, up to 10,000 EGP per day per card. You can use multiple ATMs.' },
  { icon: '🏦', title: 'Your home bank fees', desc: 'Most foreign cards pay 2–4% currency conversion fee + fixed withdrawal fee (€2–5). Use cards with low international fees (Revolut, N26, Wise, Charles Schwab).' },
  { icon: '🔢', title: 'Count every note', desc: 'At any exchange desk: count every note yourself, slowly, before leaving. "Counting errors" are common and deliberate.' },
  { icon: '🗓️', title: 'Revolut and Wise in Egypt', desc: 'Both work at Egyptian ATMs. You get the interbank rate minus a small fee. Far better than using a regular debit card. Top recommended option for European travelers.' },
  { icon: '💵', title: 'Cash beats card for markets and transport', desc: 'Taxis, markets, feluccas, temple guards, restaurant tips, street food — all cash only. Always keep 300–500 EGP in small notes on your person.' },
  { icon: '⚠️', title: 'No USD/EUR at tourist sites', desc: 'Vendors who accept USD/EUR always use an unfavorable rate. Only pay in EGP — it\'s always cheaper.' },
  { icon: '🔄', title: 'Official bank rate vs "black market"', desc: 'Since Egypt\'s EGP float in 2022, official and parallel rates have largely converged. The gap is now 1–3%. Street money changers are not worth the risk of counterfeit notes.' },
];



export default function CurrencyRates() {
  const [selectedCity, setSelectedCity] = useState('hurghada');
  const [calcAmount, setCalcAmount] = useState('100');
  const [calcCurrency, setCalcCurrency] = useState('EUR');

  const { rates: dbRates, isLoading: loading, rateDate, alert: rateAlert, refetch } = useLiveRates();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await base44.functions.invoke('updateCurrencyRates', {});
      await refetch();
    } catch(e) {
      await refetch();
    }
    setRefreshing(false);
  };

  const lastUpdated = rateDate ? `${rateDate} · Updated daily 8am` : null;

  const rates = [
    { currency: 'USD 🇺🇸', rate: dbRates.usd },
    { currency: 'EUR 🇪🇺', rate: dbRates.eur },
    { currency: 'GBP 🇬🇧', rate: dbRates.gbp },
    { currency: 'RUB 🇷🇺', rate: dbRates.rub },
    { currency: 'PLN 🇵🇱', rate: dbRates.pln },
    { currency: 'CAD 🇨🇦', rate: dbRates.cad },
    { currency: 'AUD 🇦🇺', rate: dbRates.aud },
    { currency: 'SAR 🇸🇦', rate: dbRates.sar },
  ];

  const CALCULATOR_CURRENCIES = [
    { symbol: '$', code: 'USD', rate: dbRates.usd },
    { symbol: '€', code: 'EUR', rate: dbRates.eur },
    { symbol: '£', code: 'GBP', rate: dbRates.gbp },
    { symbol: '₽', code: 'RUB', rate: dbRates.rub },
  ];

  const calcRate = CALCULATOR_CURRENCIES.find(c => c.code === calcCurrency);
  const egpResult = calcRate ? (parseFloat(calcAmount) * calcRate.rate).toFixed(0) : '—';

  const CITIES = [
    { id: 'hurghada', label: 'Hurghada' },
    { id: 'sharm-el-sheikh', label: 'Sharm' },
    { id: 'luxor', label: 'Luxor' },
    { id: 'aswan', label: 'Aswan' },
  ];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Egypt Currency Rates</h1>
          <p className="text-sm text-muted-foreground">Live rates to EGP · ATM tips · Exchange guide</p>
        </div>
      </div>

      {/* Live rates grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold">Live Rates → Egyptian Pound (EGP)</h2>
        <button onClick={handleRefresh} disabled={loading || refreshing}
        className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 text-xs font-bold hover:border-accent transition-colors disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {(loading || refreshing) ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {rateAlert && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2.5 mb-3 text-xs text-amber-700 font-semibold">{rateAlert}</div>
      )}
      {lastUpdated && (
        <p className="text-[11px] text-muted-foreground mb-4">Last updated: {lastUpdated} · Source: Central Bank of Egypt / XE.com</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {rates.map((r, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <p className="text-sm font-bold mb-1">{r.currency}</p>
            <p className="text-2xl font-black text-accent">{r.rate.toFixed(r.rate < 1 ? 3 : 2)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">EGP per 1 {r.currency.split(' ')[0]}</p>
          </div>
        ))}
      </div>

      {/* Official vs street */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-8">
        <h3 className="font-bold text-sm mb-3">Official Rate vs Street Rate — What\'s the Difference?</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-success/10 rounded-xl p-3">
            <p className="text-[10px] font-bold text-success mb-1">✅ OFFICIAL (BANK/ATM) RATE</p>
            <p className="text-xs text-muted-foreground">The rate shown above. Available at bank ATMs, official exchange desks, and Banque Misr branches. Legal, safe, no risk of counterfeit.</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3">
            <p className="text-[10px] font-bold text-red-500 mb-1">🚫 STREET RATE (AVOID)</p>
            <p className="text-xs text-muted-foreground">Post-2022 EGP float, the gap is only 1–3%. Street changers are NOT worth the risk of receiving counterfeit notes. Always use official channels.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <strong>Bottom line:</strong> The "black market" rate advantage has largely disappeared since the EGP was floated in 2022. Use bank ATMs. The tiny rate difference doesn't justify the counterfeit risk.
        </p>
      </div>

      {/* Quick Calculator */}
      <h2 className="text-xl font-extrabold mb-4">Quick Currency Calculator</h2>
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-8">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Amount</label>
            <input type="number" value={calcAmount} onChange={e => setCalcAmount(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Currency</label>
            <select value={calcCurrency} onChange={e => setCalcCurrency(e.target.value)}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
              {CALCULATOR_CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 bg-accent/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">= Egyptian Pounds</p>
            <p className="text-2xl font-black text-accent">{egpResult}</p>
            <p className="text-[10px] text-muted-foreground">EGP</p>
          </div>
        </div>
      </div>

      {/* Best ATMs by city */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-accent" />
        Best Places to Exchange Money — By City
      </h2>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCity === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="space-y-2 mb-10">
        {(EXCHANGE_TIPS_BY_CITY[selectedCity] || []).map((place, i) => (
          <div key={i} className={`rounded-2xl border p-4 ${place.rating.startsWith('🚫') ? 'bg-red-500/5 border-red-500/20' : place.rating.startsWith('❌') ? 'bg-red-500/5 border-red-500/10' : place.rating.startsWith('⚠️') ? 'bg-amber-500/5 border-amber-500/20' : 'bg-card border-border/50'}`}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <p className="font-bold text-sm">{place.name}</p>
                <p className="text-[10px] text-muted-foreground">{place.type}</p>
              </div>
              <span className={`text-xs font-bold shrink-0 ${place.rating.startsWith('✅') ? 'text-success' : place.rating.startsWith('⚠️') ? 'text-amber-600' : 'text-red-500'}`}>
                {place.rating}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{place.note}</p>
          </div>
        ))}
      </div>

      {/* Bank hotlines */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-accent" />
        Bank Hotlines — Verified Numbers
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-10">
        {BANK_HOTLINES.map((b, i) => (
          <a key={i} href={`tel:${b.hotline}`}
            className="bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-3 hover:border-accent/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <span className="text-xl font-black text-accent">{b.hotline}</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs">{b.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{b.desc}</p>
              {b.verified && <span className="text-[9px] text-success font-bold">✅ موثق</span>}
            </div>
          </a>
        ))}
      </div>

      {/* ATM tips */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-accent" />
        ATM Tips & Fee Warnings
      </h2>
      <div className="space-y-3 mb-10">
        {ATM_TIPS.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 bg-card rounded-2xl border border-border/50 p-4">
            <span className="text-xl shrink-0">{tip.icon}</span>
            <div>
              <p className="font-bold text-sm mb-0.5">{tip.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Price Checker — What Everything Costs" description="Real prices locals pay vs tourist prices" to="/price-checker" />
        <SafeNextStep title="Visa & Entry Guide" description="How to get your Egypt visa" to="/visa-entry" />
      </div>
    </div>
  );
}