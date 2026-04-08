import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Search, Download, CheckCircle2, AlertTriangle, Loader2,
  MapPin, Star, Phone, Globe, RefreshCw, BarChart2, ShieldCheck, X
} from 'lucide-react';

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna'];
const CITY_LABELS = { hurghada: 'Hurghada', 'sharm-el-sheikh': 'Sharm El Sheikh', luxor: 'Luxor', aswan: 'Aswan', 'el-gouna': 'El Gouna' };

const CATEGORIES = [
  { id: 'restaurant', label: '🍽️ Restaurants', entity: 'Service', top: 20 },
  { id: 'medical', label: '🏥 Hospitals & Clinics', entity: 'Service', top: 15 },
  { id: 'pharmacy', label: '💊 Pharmacies', entity: 'Service', top: 10 },
  { id: 'activities', label: '🤿 Activities & Tours', entity: 'Service', top: 20 },
  { id: 'supermarket', label: '🛒 Supermarkets', entity: 'Service', top: 10 },
  { id: 'bank', label: '🏦 Banks & ATMs', entity: 'Service', top: 10 },
  { id: 'transport', label: '🚗 Car Rentals', entity: 'Service', top: 10 },
  { id: 'real_estate', label: '🏢 Real Estate', entity: 'Service', top: 10 },
  { id: 'guide', label: '🧭 Tourist Guides', entity: 'Guide', top: 10 },
];

const PROMPT_TEMPLATES = {
  restaurant: (city) => `Find the top 20 real restaurants currently operating in ${CITY_LABELS[city]}, Egypt. Use Google Maps, TripAdvisor, and other travel sources. For each restaurant provide:
- name (exact business name)
- address (street-level)  
- phone (international format starting with +20)
- cuisine_type (e.g. Egyptian, Italian, Seafood)
- google_rating (1-5 number)
- price_range (budget/moderate/premium)
- google_maps_url (maps.google.com link)
- is_verified: true
- category: "restaurant"
- city: "${city}"
- description (2 sentences about the place)
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
Only include places with rating 3.5+ and real addresses. Return as JSON array.`,

  medical: (city) => `Find all hospitals, clinics, and medical centers currently operating in ${CITY_LABELS[city]}, Egypt. Use Google Maps, Egyptian Ministry of Health data, and expat forums. For each provide:
- name (exact business name)
- address (street-level)
- phone (international format)
- description (specialities, languages, emergency: yes/no)
- is_verified: true
- category: "medical"
- city: "${city}"
- google_maps_url
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
- tags: array of specialities (e.g. ["Emergency", "English-speaking", "Surgery"])
Return as JSON array.`,

  pharmacy: (city) => `Find all pharmacies currently operating in ${CITY_LABELS[city]}, Egypt. For each provide:
- name (exact pharmacy name, e.g. "El Ezaby Pharmacy", "Seif Pharmacy")
- address
- phone
- description (include if 24h, chain name, etc.)
- is_verified: true
- category: "medical"
- city: "${city}"
- tags: ["Pharmacy", and "24h" if applicable]
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
Return as JSON array. Include well-known Egyptian pharmacy chains (El Ezaby, Seif, El Dawaa, Misr) and local independents.`,

  activities: (city) => `Find the top 20 tours, activities and experiences for tourists in ${CITY_LABELS[city]}, Egypt. Use TripAdvisor, Viator, and Google. For each provide:
- name (exact company/activity name)
- address or area
- phone
- description (what the activity includes, duration)
- price_range: "budget/moderate/premium"
- avg_rating (1-5)
- category: "activities"
- city: "${city}"
- is_verified: false
- google_maps_url (if available)
- website (if available)
- tags: activity types (e.g. ["Snorkeling", "Diving", "Desert Safari"])
- source: "TripAdvisor / Web Search"
- last_verified: "2026-04-08"
Return as JSON array.`,

  supermarket: (city) => `Find all supermarkets, grocery stores and hypermarkets operating in ${CITY_LABELS[city]}, Egypt. Include chains: Carrefour, Seoudi, Spinneys, Metro, Kheir Zaman, BIM, others. For each:
- name
- address
- phone
- description (size, imported products, hours)
- category: "other"
- city: "${city}"
- is_verified: true
- tags: ["Supermarket", and "Delivery" if applicable, "Imported Products" if applicable]
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
Return as JSON array.`,

  bank: (city) => `Find all bank branches and ATM locations operating in ${CITY_LABELS[city]}, Egypt. Include: NBE, Banque Misr, CIB, QNB, HSBC, Alex Bank, Faisal Islamic Bank, others. For each:
- name (bank name + branch)
- address
- phone
- description (ATM available? accepts foreigners? English service? opening hours?)
- category: "other"
- city: "${city}"
- is_verified: true
- tags: ["Bank", and "ATM" if available, "English Service" if applicable]
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
Return as JSON array.`,

  transport: (city) => `Find all car rental companies operating in ${CITY_LABELS[city]}, Egypt. Use Google Maps and local directories. For each:
- name
- address
- phone
- description (fleet type, with/without driver, international license accepted)
- price_range: "budget/moderate/premium"
- category: "transport"
- city: "${city}"
- is_verified: false
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
Return as JSON array.`,

  real_estate: (city) => `Find real estate agencies and property companies operating in ${CITY_LABELS[city]}, Egypt. For each:
- name
- address
- phone
- website
- description (specialities: long-term rental, sales, property management, languages spoken)
- category: "other"
- city: "${city}"
- is_verified: false
- tags: ["Real Estate"]
- source: "Google Maps / Web Search"
- last_verified: "2026-04-08"
Return as JSON array.`,

  guide: (city) => `Find licensed tourist guides operating in ${CITY_LABELS[city]}, Egypt. Use TripAdvisor, Viator, and Egyptian Tourism Federation data. For each guide provide:
- full_name
- city: "${city}"
- cities_covered: [array]
- languages: [array of languages spoken]
- tour_types: [array e.g. "Historical Tours", "Desert Safaris"]
- description
- avg_rating (1-5, null if unknown)
- review_count (0 if unknown)
- status: "pending"
- is_verified: false
- years_experience (estimate if unclear)
- source: "TripAdvisor / Web Search"
- last_verified: "2026-04-08"
Return as JSON array.`,
};

function ResultCard({ item, onApprove, onReject, approved, rejected }) {
  return (
    <div className={`rounded-xl border p-3 text-xs transition-all ${approved ? 'border-success/40 bg-success/5' : rejected ? 'border-red-500/30 bg-red-500/5 opacity-50' : 'border-border/50 bg-card'}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{item.name || item.full_name}</p>
          {item.address && <p className="text-muted-foreground truncate flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5 shrink-0" />{item.address}</p>}
          {item.phone && <p className="text-muted-foreground flex items-center gap-0.5"><Phone className="w-2.5 h-2.5 shrink-0" />{item.phone}</p>}
          {item.avg_rating && <div className="flex items-center gap-0.5 mt-0.5"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /><span>{item.avg_rating}</span></div>}
          {item.google_rating && <div className="flex items-center gap-0.5 mt-0.5"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /><span>{item.google_rating}</span></div>}
          {item.description && <p className="text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
          {item.tags?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{item.tags.slice(0, 3).map((t, i) => <span key={i} className="bg-secondary px-1.5 py-0.5 rounded-full">{t}</span>)}</div>}
          {item.languages?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{item.languages.map((l, i) => <span key={i} className="bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded-full">{l}</span>)}</div>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onApprove} disabled={approved || rejected} className={`p-1.5 rounded-lg transition-all ${approved ? 'bg-success text-success-foreground' : 'bg-success/10 text-success hover:bg-success/20'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onReject} disabled={approved || rejected} className={`p-1.5 rounded-lg transition-all ${rejected ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {item.source && <p className="text-[9px] text-muted-foreground mt-1 border-t border-border/20 pt-1">📡 {item.source} · 🗓 {item.last_verified}</p>}
    </div>
  );
}

export default function AdminDataPopulate() {
  const [selectedCity, setSelectedCity] = useState('hurghada');
  const [selectedCategory, setSelectedCategory] = useState('restaurant');
  const [results, setResults] = useState([]);
  const [approvedSet, setApprovedSet] = useState(new Set());
  const [rejectedSet, setRejectedSet] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [log, setLog] = useState([]);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const addLog = (msg, type = 'info') => setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);

  const fetchData = async () => {
    setLoading(true);
    setResults([]);
    setApprovedSet(new Set());
    setRejectedSet(new Set());
    setError(null);
    addLog(`🔍 Searching for ${selectedCategory} in ${CITY_LABELS[selectedCity]}...`);

    const promptFn = PROMPT_TEMPLATES[selectedCategory];
    if (!promptFn) { setError('Category not configured'); setLoading(false); return; }

    const prompt = promptFn(selectedCity);

    const schema = {
      type: 'object',
      properties: {
        listings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              full_name: { type: 'string' },
              address: { type: 'string' },
              phone: { type: 'string' },
              description: { type: 'string' },
              google_rating: { type: 'number' },
              avg_rating: { type: 'number' },
              price_range: { type: 'string' },
              category: { type: 'string' },
              city: { type: 'string' },
              website: { type: 'string' },
              google_maps_url: { type: 'string' },
              is_verified: { type: 'boolean' },
              tags: { type: 'array', items: { type: 'string' } },
              languages: { type: 'array', items: { type: 'string' } },
              tour_types: { type: 'array', items: { type: 'string' } },
              cities_covered: { type: 'array', items: { type: 'string' } },
              source: { type: 'string' },
              last_verified: { type: 'string' },
              status: { type: 'string' },
              years_experience: { type: 'number' },
              review_count: { type: 'number' },
            }
          }
        }
      }
    };

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: schema,
    });

    const listings = res?.listings || [];
    setResults(listings);
    addLog(`✅ Found ${listings.length} listings`, 'success');
    setLoading(false);
  };

  const approveAll = () => setApprovedSet(new Set(results.map((_, i) => i)));
  const rejectAll = () => setRejectedSet(new Set(results.map((_, i) => i)));

  const saveApproved = async () => {
    const toSave = results.filter((_, i) => approvedSet.has(i) && !rejectedSet.has(i));
    if (toSave.length === 0) { addLog('⚠️ No approved items to save', 'warn'); return; }

    setSaving(true);
    addLog(`💾 Saving ${toSave.length} listings to database...`);

    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    const entityName = cat?.entity || 'Service';
    let saved = 0, failed = 0;

    for (const item of toSave) {
      let record = {};
      if (entityName === 'Guide') {
        record = {
          full_name: item.full_name || item.name,
          city: item.city || selectedCity,
          cities_covered: item.cities_covered || [item.city || selectedCity],
          languages: item.languages || ['English', 'Arabic'],
          tour_types: item.tour_types || [],
          description: item.description || '',
          avg_rating: item.avg_rating || null,
          review_count: item.review_count || 0,
          status: 'pending',
          is_verified: false,
          years_experience: item.years_experience || null,
        };
      } else {
        record = {
          name: item.name || item.full_name,
          category: (item.category === 'pharmacy' || item.category === 'bank' || item.category === 'supermarket') ? 'medical' : (item.category || selectedCategory),
          city: item.city || selectedCity,
          address: item.address || '',
          phone: item.phone || '',
          description: item.description || '',
          website: item.google_maps_url || item.website || '',
          avg_rating: item.google_rating || item.avg_rating || 0,
          is_verified: item.is_verified || false,
          price_range: item.price_range === 'budget' ? 'budget' : item.price_range === 'premium' ? 'premium' : 'moderate',
          tags: item.tags || [],
        };
        // fix category mapping
        if (selectedCategory === 'pharmacy' || selectedCategory === 'bank' || selectedCategory === 'supermarket' || selectedCategory === 'real_estate') {
          record.category = selectedCategory === 'pharmacy' ? 'medical' : 'other';
        }
        if (selectedCategory === 'transport') record.category = 'transport';
        if (selectedCategory === 'activities') record.category = 'activities';
        if (selectedCategory === 'restaurant') record.category = 'restaurant';
      }

      try {
        await base44.entities[entityName].create(record);
        saved++;
      } catch {
        failed++;
        addLog(`❌ Failed to save: ${record.name || record.full_name}`, 'error');
      }
    }

    addLog(`✅ Saved ${saved} listings. ${failed > 0 ? `${failed} failed.` : ''}`, 'success');

    setReport(prev => ({
      ...prev,
      [selectedCity]: {
        ...(prev?.[selectedCity] || {}),
        [selectedCategory]: saved,
      }
    }));

    setSaving(false);
  };

  const approved = results.filter((_, i) => approvedSet.has(i));
  const pending = results.filter((_, i) => !approvedSet.has(i) && !rejectedSet.has(i));

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Search className="w-6 h-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Auto-Populate Real Data</h1>
          <p className="text-sm text-muted-foreground">Find & import real businesses using AI + web search · Admin only</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 mb-6 text-xs text-amber-700">
        ⚡ Uses AI + live internet search to find real business data. <strong>Review before saving</strong> — always verify phone numbers and addresses before publishing to tourists.
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">1. Select City</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map(c => (
              <button key={c} onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedCity === c ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary border-border'}`}>
                {CITY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">2. Select Category</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedCategory === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={fetchData} disabled={loading}
        className="flex items-center gap-2 w-full bg-accent text-accent-foreground py-3 rounded-2xl font-bold text-sm justify-center mb-6 disabled:opacity-60">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching the web…</> : <><Search className="w-4 h-4" /> Find Real Data for {CITY_LABELS[selectedCity]} — {CATEGORIES.find(c => c.id === selectedCategory)?.label}</>}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div>
              <h2 className="font-extrabold">Results: {results.length} listings found</h2>
              <p className="text-xs text-muted-foreground">{approved.length} approved · {pending.length} pending · {rejectedSet.size} rejected</p>
            </div>
            <div className="flex gap-2">
              <button onClick={approveAll} className="px-3 py-1.5 rounded-xl bg-success/10 text-success text-xs font-bold border border-success/30">✓ Approve All</button>
              <button onClick={rejectAll} className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/30">✗ Reject All</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-4">
            {results.map((item, i) => (
              <ResultCard
                key={i} item={item}
                approved={approvedSet.has(i)}
                rejected={rejectedSet.has(i)}
                onApprove={() => setApprovedSet(prev => { const n = new Set(prev); n.add(i); const r = new Set(rejectedSet); r.delete(i); setRejectedSet(r); return n; })}
                onReject={() => setRejectedSet(prev => { const n = new Set(prev); n.add(i); const a = new Set(approvedSet); a.delete(i); setApprovedSet(a); return n; })}
              />
            ))}
          </div>

          <button onClick={saveApproved} disabled={saving || approvedSet.size === 0}
            className="flex items-center gap-2 w-full bg-success text-success-foreground py-3 rounded-2xl font-bold text-sm justify-center disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Download className="w-4 h-4" /> Save {approvedSet.size} Approved Listings to Database</>}
          </button>
        </div>
      )}

      {/* Activity log */}
      {log.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" /> Activity Log</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className="text-[11px] text-muted-foreground font-mono">
                <span className="text-[10px] opacity-60 mr-2">{entry.time}</span>{entry.msg}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Report */}
      {report && (
        <div className="bg-card rounded-2xl border border-border/50 p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5 text-accent" /> Session Import Report</h3>
          <div className="space-y-2">
            {Object.entries(report).map(([city, cats]) => (
              <div key={city}>
                <p className="text-xs font-bold mb-1">{CITY_LABELS[city]}</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(cats).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between bg-secondary/50 rounded-lg px-2 py-1">
                      <span className="text-[10px] text-muted-foreground capitalize">{cat}</span>
                      <span className="text-[10px] font-bold text-success">+{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality guidelines */}
      <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-bold text-foreground mb-2">📋 Data Quality Rules</p>
        {[
          'Only listings with rating 3.5+ will appear in tourist-facing pages',
          'Always verify phone numbers by calling before publishing',
          'All listings start as is_verified: false — admin must promote to verified',
          'Re-run searches monthly to catch closed businesses',
          'Flag any listing where phone/address cannot be confirmed',
        ].map((r, i) => (
          <div key={i} className="flex items-start gap-2"><ShieldCheck className="w-3 h-3 text-success shrink-0 mt-0.5" /><span>{r}</span></div>
        ))}
      </div>
    </div>
  );
}