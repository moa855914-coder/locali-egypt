import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CITIES, SERVICE_CATEGORIES, t, getCityName } from '../lib/constants';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import AdminServiceForm from '../components/AdminServiceForm';
import VerifiedKidsActivities from '../components/VerifiedKidsActivities';
import VerifiedNightlifeVenues from '../components/VerifiedNightlifeVenues';
import { useAuth } from '@/lib/AuthContext';

// All categories support manual admin creation
const ADMIN_CATEGORIES = ['medical', 'transport', 'kids_family', 'sim_internet', 'nightlife', 'remote_work', 'long_stay', 'restaurant', 'activities', 'other'];

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

  const isAdmin = user?.role === 'admin';
  const canAdd = isAdmin;
  const [editingRecord, setEditingRecord] = useState(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['allServices', selectedCity, selectedCategory],
    queryFn: () => {
      const filter = {};
      if (selectedCity) filter.city = selectedCity;
      if (selectedCategory) filter.category = selectedCategory;
      return Object.keys(filter).length > 0
        ? base44.entities.Service.filter(filter, '-created_date', 50)
        : base44.entities.Service.list('-created_date', 50);
    },
  });

  const filtered = useMemo(() => {
    let result = services;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }
    if (verifiedOnly) {
      result = result.filter(s => s.is_verified);
    }
    return result;
  }, [services, search, verifiedOnly]);

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black tracking-tight">{t('services', lang)}</h1>
        {canAdd && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" /> Add Listing
          </button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-6">Find trusted services across Egypt</p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="w-full pl-10 pr-4 py-3 bg-card rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* City Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
        <button
          onClick={() => setSelectedCity('')}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            !selectedCity ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
          }`}
        >
          {t('all_cities', lang)}
        </button>
        {CITIES.map(city => (
          <button
            key={city.id}
            onClick={() => setSelectedCity(city.id)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCity === city.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
            }`}
          >
            {getCityName(city, lang)}
          </button>
        ))}
      </div>

      {/* Category + Verified Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
            verifiedOnly ? 'bg-success text-success-foreground' : 'bg-card border border-border'
          }`}
        >
          <SlidersHorizontal className="w-3 h-3" />
          Verified Only
        </button>
        <button
          onClick={() => setSelectedCategory('')}
          className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            !selectedCategory ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'
          }`}
        >
          All
        </button>
        {SERVICE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id ? 'bg-accent text-accent-foreground' : 'bg-card border border-border'
            }`}
          >
            {lang === 'ru' ? cat.labelRu : lang === 'de' ? cat.labelDe : cat.label}
          </button>
        ))}
      </div>

      {(showForm || editingRecord) && (
        <AdminServiceForm
          category={selectedCategory || editingRecord?.category || 'medical'}
          record={editingRecord}
          onSave={() => { setShowForm(false); setEditingRecord(null); queryClient.invalidateQueries(['allServices']); }}
          onClose={() => { setShowForm(false); setEditingRecord(null); }}
        />
      )}

      {/* Admin banner */}
      {isAdmin && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-amber-800">⚡ Admin Mode — Manual Entry Active</p>
            <p className="text-xs text-amber-700 mt-0.5">Click "Add Listing" to enter name, city, area, rating & upload images.</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="shrink-0 flex items-center gap-1.5 bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-700">
            <Plus className="w-3.5 h-3.5" /> Add Place
          </button>
        </div>
      )}

      {/* Kids & Family activities section */}
      {selectedCategory === 'kids_family' && <VerifiedKidsActivities />}

      {/* Nightlife venues section */}
      {selectedCategory === 'nightlife' && <VerifiedNightlifeVenues />}

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => <ServiceCard key={s.id} service={s} isAdmin={isAdmin} onEdit={() => setEditingRecord(s)} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium text-muted-foreground">No services found</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {isAdmin ? 'Click "Add Place" above to add the first listing here.' : 'Try adjusting your filters'}
          </p>
          {isAdmin && (
            <button onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 mx-auto">
              <Plus className="w-4 h-4" /> Add First Listing
            </button>
          )}
        </div>
      )}
    </div>
  );
}