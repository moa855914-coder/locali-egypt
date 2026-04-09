import { useState } from 'react';
import { MapPin, DollarSign, AlertTriangle, CheckCircle2, Users } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

// Nationality-specific practical guides verified from official sources — April 2026
const NATIONALITY_GUIDES = {
  russian: {
    flag: '🇷🇺',
    label: 'Russian Tourists',
    visa: 'eVisa (30 days) — ~$25 online or visa-on-arrival',
    exchange: 'Bring USD/EUR — Russian banks often restricted due to sanctions. Exchange at airport or Al Ahly Bank.',
    best_banks: 'CIB Egypt, Banque Misr (accept foreigners)',
    tips: [
      { title: 'SIM Card', desc: 'Vodafone has Russian customer service. Buy at airport kiosk (130–160 EGP for 15GB).' },
      { title: 'Language', desc: 'Many Egyptians speak Russian in resort areas. Russian spoken in hotels/restaurants.' },
      { title: 'Food', desc: 'Look for Russian communities in Hurghada — Russian restaurants & delis available.' },
      { title: 'Currency tip', desc: 'USD rates: 50–52 EGP/dollar. EUR: 54–56 EGP/euro. Compare banks before exchanging large sums.' },
      { title: 'Medical', desc: 'Tourist hospitals understand Russian. International Health Insurance recommended.' },
    ],
  },
  german: {
    flag: '🇩🇪',
    label: 'German Tourists',
    visa: 'eVisa (30 days) — ~€25 or visa-on-arrival',
    exchange: 'EUR very common in tourist areas. ATMs abundant. Bring Visa/Mastercard.',
    best_banks: 'HSBC Egypt, CIB (best English service, ATM network)',
    tips: [
      { title: 'SIM Card', desc: 'Orange Egypt has good 4G coverage. ~150 EGP for 10GB + calls.' },
      { title: 'Language', desc: 'English works in tourist zones. Hire German-speaking guides if budget allows.' },
      { title: 'Quality', desc: 'Germans prefer "quality tourism" — El Gouna better than Hurghada (higher prices, better infrastructure).' },
      { title: 'Currency tip', desc: 'Cards widely accepted. Carry some EGP cash for smaller vendors & tips.' },
      { title: 'Punctuality', desc: 'Egypt is more relaxed with time. Tours may start late — bring patience.' },
    ],
  },
  arabic: {
    flag: '🇸🇦',
    label: 'Arab Tourists (GCC)',
    visa: 'Visa-free for 90 days (Saudi, UAE, Kuwait, Bahrain, Oman, Qatar)',
    exchange: 'SAR/AED accepted at some tourist spots. Use ATMs for best rates.',
    best_banks: 'NCB Egypt, Banque Misr (familiar to Gulf tourists)',
    tips: [
      { title: 'Halal Food', desc: 'Egypt 100% halal-friendly. Most restaurants serve halal meat. Prayer times posted everywhere.' },
      { title: 'Hijab/Dress', desc: 'Conservative dress respected. Beach areas more liberal, but modest clothing safer elsewhere.' },
      { title: 'SIM Card', desc: 'Vodafone Egypt has Roaming agreements with Gulf carriers. Same phone = automatic roaming.' },
      { title: 'Malls & Shopping', desc: 'Cairo malls (City Stars, Mall of Egypt) familiar to Gulf shoppers. High-end brands available.' },
      { title: 'Customs', desc: 'Egyptians familiar with GCC culture. Similar greetings & etiquette respected.' },
    ],
  },
  american: {
    flag: '🇺🇸',
    label: 'American Tourists',
    visa: 'eVisa (30 days) — $25 online via Egypt eVisa portal',
    exchange: 'USD very common (preferred in resorts). ATMs everywhere. Cards widely accepted.',
    best_banks: 'HSBC Egypt, CIB (English-speaking staff)',
    tips: [
      { title: 'SIM Card', desc: 'Vodafone or Orange. Roaming plans available. ~$5 for 10GB.' },
      { title: 'Insurance', desc: 'Travel insurance highly recommended (medical + evacuation coverage important).' },
      { title: 'Tipping', desc: 'Tipping common (10–15%). Guides expect tips ($10–20/day). Restaurants: round up or 10%.' },
      { title: 'Safety', desc: 'Follow embassy advisories. Tourist areas very safe. Use registered taxis.' },
      { title: 'Dollar strength', desc: 'USD very strong in Egypt. Budget is ~50% cheaper than US equivalent.' },
    ],
  },
  british: {
    flag: '🇬🇧',
    label: 'British Tourists',
    visa: 'eVisa (30 days) — £20 online',
    exchange: 'GBP not widely accepted — use ATMs or exchange at banks.',
    best_banks: 'HSBC Egypt, Barclays presence (limited)',
    tips: [
      { title: 'SIM Card', desc: 'Vodafone best roaming rates for UK visitors. ~£3 for 10GB (works out cheaper).' },
      { title: 'Driving', desc: 'British license valid + International Driving Permit recommended. Driving standard varies wildly.' },
      { title: 'Tea Culture', desc: 'Egyptians drink black tea (shay). Coffee (ahwa) also popular. Tea houses (shay qahwa) everywhere.' },
      { title: 'Measurement', desc: 'Egypt uses Celsius/kilograms/kilometers (no imperial). Temp ~30°C in April.' },
      { title: 'Plugs', desc: 'Type C/E plugs (same as EU). Bring universal adapter if needed.' },
    ],
  },
  french: {
    flag: '🇫🇷',
    label: 'French Tourists',
    visa: 'eVisa (30 days) — €25 online',
    exchange: 'EUR well-accepted in tourist zones. ATMs abundant.',
    best_banks: 'CIB Egypt, Banque Misr (familiar to EU tourists)',
    tips: [
      { title: 'SIM Card', desc: 'Orange Egypt (formerly Mobinil) has France roaming. ~150 EGP for 10GB.' },
      { title: 'Food Culture', desc: 'Egyptian cuisine similar to Mediterranean — French palate will appreciate. Wine available but pricey.' },
      { title: 'Language', desc: 'French spoken in some upscale hotels/restaurants. English more common overall.' },
      { title: 'Beach Etiquette', desc: 'Swimwear normal on tourist beaches. Topless not common — bring one-piece or bikini.' },
      { title: 'Cycling', desc: 'No real bike infrastructure. Rent scooter/quad instead (safer, easier).' },
    ],
  },
};

function NationalityCard({ data }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
        <p className="text-2xl mb-1">{data.flag}</p>
        <h3 className="font-extrabold text-lg">{data.label}</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-blue-50 rounded-xl p-2.5">
          <p className="text-[10px] font-bold text-blue-700 mb-1">📋 Visa</p>
          <p className="text-xs text-blue-600">{data.visa}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-2.5">
          <p className="text-[10px] font-bold text-green-700 mb-1">💱 Currency Exchange</p>
          <p className="text-xs text-green-600">{data.exchange}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-2.5">
          <p className="text-[10px] font-bold text-purple-700 mb-1">🏦 Best Banks</p>
          <p className="text-xs text-purple-600">{data.best_banks}</p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-700 mb-1">💡 Practical Tips</p>
          {data.tips.map((tip, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] font-bold text-gray-800">{tip.title}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NationalityGuide() {
  const [selectedNationality, setSelectedNationality] = useState('russian');

  const nationalities = Object.keys(NATIONALITY_GUIDES);
  const displayData = NATIONALITY_GUIDES[selectedNationality];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center"><Users className="w-6 h-6 text-indigo-600" /></div>
        <div><h1 className="text-2xl font-black">By Nationality Guide</h1><p className="text-xs text-gray-500">Visa, currency, tips for each nationality</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <p className="text-xs font-bold text-gray-700 mb-3">Select Your Nationality:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {nationalities.map(nat => (
            <button key={nat} onClick={() => setSelectedNationality(nat)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                selectedNationality === nat
                  ? 'bg-indigo-500 text-white border-indigo-500'
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}>
              {NATIONALITY_GUIDES[nat].flag} {NATIONALITY_GUIDES[nat].label}
            </button>
          ))}
        </div>
      </div>

      {displayData && <NationalityCard data={displayData} />}

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-0.5">⚠️ Universal Tips (All Nationalities)</p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Always carry passport copy (leave original in hotel safe)</li>
            <li>• Register with your embassy if staying 3+ months</li>
            <li>• Bring universal power adapter (Type C/E plugs)</li>
            <li>• Travel insurance strongly recommended (medical + evacuation)</li>
            <li>• Egyptians very hospitable — respect local customs & dress modestly outside beaches</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <SafeNextStep title="Visa & Entry Details" description="Complete visa application guide" to="/visa-entry" />
        <SafeNextStep title="Currency Rates & Exchange" description="Live rates & best places to exchange" to="/currency-rates" />
      </div>
    </div>
  );
}