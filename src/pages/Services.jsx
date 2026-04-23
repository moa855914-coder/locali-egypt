import { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CITIES, SERVICE_CATEGORIES, t, getCityName } from '../lib/constants';
import { Search, SlidersHorizontal, Plus, Wrench, Loader2, CheckCircle } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import AdminServiceForm from '../components/AdminServiceForm';
import VerifiedKidsActivities from '../components/VerifiedKidsActivities';
import VerifiedNightlifeVenues from '../components/VerifiedNightlifeVenues';
import { useAuth } from '@/lib/AuthContext';

// ── City normalization map ────────────────────────────────────────────────────
const CITY_NORMALIZE = {
  'luxor': 'luxor', 'Luxor': 'luxor', 'LUXOR': 'luxor', 'luxor ': 'luxor', ' luxor': 'luxor',
  'al-uqsur': 'luxor', 'el-uqsur': 'luxor',
  'aswan': 'aswan', 'Aswan': 'aswan', 'ASWAN': 'aswan', 'aswan ': 'aswan', ' aswan': 'aswan',
  'assuan': 'aswan', 'assouan': 'aswan',
  'hurghada': 'hurghada', 'Hurghada': 'hurghada', 'HURGHADA': 'hurghada',
  'el-hurghada': 'hurghada', 'al-hurghada': 'hurghada',
  'sharm-el-sheikh': 'sharm-el-sheikh', 'sharm el sheikh': 'sharm-el-sheikh',
  'Sharm El Sheikh': 'sharm-el-sheikh', 'sharm': 'sharm-el-sheikh',
  'sharm-el-shaikh': 'sharm-el-sheikh', 'Sharm': 'sharm-el-sheikh',
  'el-gouna': 'el-gouna', 'el gouna': 'el-gouna', 'El Gouna': 'el-gouna',
  'elgouna': 'el-gouna', 'El-Gouna': 'el-gouna',
};

const VALID_CITY_IDS = new Set(CITIES.map(c => c.id));

function normalizeCity(raw) {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (CITY_NORMALIZE[trimmed]) return CITY_NORMALIZE[trimmed];
  const lower = trimmed.toLowerCase();
  if (CITY_NORMALIZE[lower]) return CITY_NORMALIZE[lower];
  if (VALID_CITY_IDS.has(lower)) return lower;
  return null;
}

function sortServices(services) {
  return [...services].sort((a, b) => {
    const aImg = !!(a.main_image || a.photos?.length);
    const bImg = !!(b.main_image || b.photos?.length);
    if (aImg !== bImg) return aImg ? -1 : 1;
    if (a.is_verified !== b.is_verified) return a.is_verified ? -1 : 1;
    return (a.name || '').localeCompare(b.name || '');
  });
}

// ── Admin City Fix Tool ───────────────────────────────────────────────────────
function AdminCityFixTool({ onDone }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setRunning(true);
    setResult(null);
    try {
      const all = await base44.entities.Service.list('-created_date', 500);
      let fixed = 0, unknown = 0;
      const updates = [];

      for (const svc of all) {
        const normalized = normalizeCity(svc.city);
        if (normalized && normalized !== svc.city) {
          updates.push(base44.entities.Service.update(svc.id, { city: normalized }));
          fixed++;
        } else if (!normalized) {
          const text = ((svc.name || '') + ' ' + (svc.description || '')).toLowerCase();
          let inferred = null;
          if (text.includes('luxor') || text.includes('karnak') || text.includes('valley')) inferred = 'luxor';
          else if (text.includes('aswan') || text.includes('nubian') || text.includes('philae')) inferred = 'aswan';
          else if (text.includes('hurghada') || text.includes('el gouna')) inferred = 'hurghada';
          else if (text.includes('sharm') || text.includes('naama') || text.includes('sinai')) inferred = 'sharm-el-sheikh';

          if (inferred && inferred !== svc.city) {
            updates.push(base44.entities.Service.update(svc.id, { city: inferred }));
            fixed++;
          } else {
            unknown++;
          }
        }
      }

      await Promise.all(updates);
      setResult({ fixed, unknown, total: all.length });
      onDone();
    } catch (err) {
      setResult({ error: err.message });
    }
    setRunning(false);
  };

  return (
    <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <p className="text-xs font-bold text-amber-800">⚡ Admin Mode</p>
          <p className="text-xs text-amber-700">Normalize inconsistent city names across all services.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setRunning(false) || run()} disabled={running}
            className="flex items-center gap-1.5 bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 disabled:opacity-50">
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wrench className="w-3 h-3" />}
            {running ? 'Fixing…' : 'Fix Cities'}
          </button>
        </div>
      </div>
      {result && !result.error && (
        <p className="text-xs text-amber-800 flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
          Fixed {result.fixed} · {result.unknown} unknown · {result.total} total
        </p>
      )}
      {result?.error && <p className="text-xs text-red-600">Error: {result.error}</p>}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ cityId, category, onClearCity, onClearCategory, isAdmin, onAdd }) {
  const city = CITIES.find(c => c.id === cityId);
  const nearby = (cityId === 'luxor' || cityId === 'aswan')
    ? CITIES.filter(c => c.id !== cityId && c.region === 'Cultural')
    : CITIES.filter(c => c.id !== cityId && c.region === 'Red Sea');

  return (
    <div className="text-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
        <Search className="w-6 h-6 text-muted-foreground/40" />
      </div>
      <p className="font-bold text-base mb-1">
        {cityId ? `No services yet in ${city?.name || cityId}` : 'No services found'}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {category ? 'Try removing the category filter, or explore' : 'Try'} nearby cities.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {cityId && (
          <button onClick={() => onClearCity('')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-accent text-accent-foreground">
            View All Cities
          </button>
        )}
        {category && (
          <button onClick={onClearCategory}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary border border-border">
            Remove Category Filter
          </button>
        )}
        {nearby.slice(0, 2).map(c => (
          <button key={c.id} onClick={() => onClearCity(c.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-secondary border border-border">
            Try {c.name}
          </button>
        ))}
      </div>
      {isAdmin && (
        <button onClick={onAdd}
          className="mt-4 flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-bold mx-auto">
          <Plus className="w-4 h-4" /> Add First Listing
        </button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Services() {
  const { lang } = useOutletContext();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const [selectedCity, setSelectedCity] = useState(urlParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState(urlParams.get('category') || '');
  const [search, setSearch] = useState(urlParams.get('q') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const isAdmin = user?.role === 'admin';

  const { data: rawServices = [], isLoading } = useQuery({
    queryKey: ['allServices', selectedCity, selectedCategory],
    queryFn: () => {
      const filter = {};
      if (selectedCity) filter.city = selectedCity;
      if (selectedCategory) filter.category = selectedCategory;
      return Object.keys(filter).length > 0
        ? base44.entities.Service.filter(filter, '-created_date', 100)
        : base44.entities.Service.list('-created_date', 150);
    },
    staleTime: 5 * 60 * 1000,
  });

  const services = useMemo(() => rawServices.map(s => ({
    ...s,
    city: normalizeCity(s.city) || s.city || '',
  })), [rawServices]);

  const cityCounts = useMemo(() => {
    const counts = {};
    for (const s of services) {
      if (s.city) counts[s.city] = (counts[s.city] || 0) + 1;
    }
    return counts;
  }, [services]);

  const filtered = useMemo(() => {
    let result = services;
    if (selectedCity) result = result.filter(s => s.city === selectedCity);
    if (selectedCategory) result = result.filter(s => s.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
    }
    if (verifiedOnly) result = result.filter(s => s.is_verified);
    return sortServices(result);
  }, [services, selectedCity, selectedCategory, search, verifiedOnly]);

  const city = CITIES.find(c => c.id === selectedCity);
  const categoryLabel = SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.label || '';
  const sectionTitle = selectedCity
    ? `${categoryLabel ? categoryLabel + ' in ' : 'Services in '}${city?.name || selectedCity}`
    : categoryLabel ? `All ${categoryLabel} Services` : 'All Services';

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black tracking-tight">{t('services', lang)}</h1>
        {isAdmin && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90">
            <Plus className="w-3.5 h-3.5" /> Add Listing
          </button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-5">Find trusted services across Egypt</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full pl-10 pr-4 py-3 bg-card rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
        <button onClick={() => setSelectedCity('')}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${!selectedCity ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
          {t('all_cities', lang)}
        </button>
        {CITIES.map(city => {
          const count = cityCounts[city.id] || 0;
          return (
            <button key={city.id} onClick={() => setSelectedCity(city.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedCity === city.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
              {getCityName(city, lang)}
              <span className={`ml-1 text-[10px] ${selectedCity === city.id ? 'opacity-80' : 'opacity-50'}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Category + Verified Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
        <button onClick={() => setVerifiedOnly(v => !v)}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${verifiedOnly ? 'bg-success text-success-foreground' : 'bg-card border border-border'}`}>
          <SlidersHorizontal className="w-3 h-3" /> Verified Only
        </button>
        <button onClick={() => setSelectedCategory('')}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${!selectedCategory ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'}`}>
          All
        </button>
        {SERVICE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat.id ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'}`}>
            {lang === 'ru' ? cat.labelRu : lang === 'de' ? cat.labelDe : cat.label}
          </button>
        ))}
      </div>

      {isAdmin && <AdminCityFixTool onDone={() => queryClient.invalidateQueries(['allServices'])} />}

      {(showForm || editingRecord) && (
        <AdminServiceForm
          category={selectedCategory || editingRecord?.category || 'medical'}
          record={editingRecord}
          onSave={() => { setShowForm(false); setEditingRecord(null); queryClient.invalidateQueries(['allServices']); }}
          onClose={() => { setShowForm(false); setEditingRecord(null); }}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold tracking-tight">{sectionTitle}</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {selectedCategory === 'kids_family' && <VerifiedKidsActivities />}
      {selectedCategory === 'nightlife' && <VerifiedNightlifeVenues />}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <ServiceCard key={s.id} service={s} isAdmin={isAdmin} onEdit={() => setEditingRecord(s)} />
          ))}
        </div>
      ) : (
        <EmptyState
          cityId={selectedCity}
          category={selectedCategory}
          onClearCity={(id) => setSelectedCity(id || '')}
          onClearCategory={() => setSelectedCategory('')}
          isAdmin={isAdmin}
          onAdd={() => setShowForm(true)}
        />
      )}
    </div>
  );
}