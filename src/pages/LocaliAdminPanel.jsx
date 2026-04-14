import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Trash2, Star, Loader2, Shield, MapPin, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const CATEGORY_ICONS = { hotel: '🏨', apartment: '🏠', experience: '🎯', service: '🛎️' };

export default function LocaliAdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('pending');
  const [acting, setActing] = useState(null);

  const { data: places = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-places'],
    queryFn: () => base44.entities.Place.list('-created_date', 200),
    enabled: user?.role === 'admin',
    staleTime: 30000,
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-500">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const tabs = {
    pending: places.filter(p => p.status === 'pending'),
    approved: places.filter(p => p.status === 'approved'),
    rejected: places.filter(p => p.status === 'rejected'),
  };

  const updateStatus = async (id, status) => {
    setActing(id);
    await base44.entities.Place.update(id, { status });
    refetch();
    setActing(null);
  };

  const toggleFeatured = async (place) => {
    setActing(place.id);
    await base44.entities.Place.update(place.id, { is_featured: !place.is_featured });
    refetch();
    setActing(null);
  };

  const deletePlace = async (id) => {
    if (!confirm('Delete this listing permanently?')) return;
    setActing(id);
    await base44.entities.Place.delete(id);
    refetch();
    setActing(null);
  };

  const currentPlaces = tabs[tab] || [];

  const stats = {
    total: places.length,
    pending: tabs.pending.length,
    approved: tabs.approved.length,
    featured: places.filter(p => p.is_featured).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/locali" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-900 rounded-xl flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-gray-900">Admin Panel</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Locali Admin</h1>
          <p className="text-gray-500 mt-1">Review and manage all listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'bg-gray-900 text-white' },
            { label: 'Pending', value: stats.pending, color: 'bg-amber-400 text-amber-900' },
            { label: 'Approved', value: stats.approved, color: 'bg-green-500 text-white' },
            { label: 'Featured', value: stats.featured, color: 'bg-rose-500 text-white' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-xs font-semibold mt-1 opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-6 w-fit">
          {['pending', 'approved', 'rejected'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t} ({tabs[t].length})
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
          </div>
        ) : currentPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-black text-gray-900">No {tab} listings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentPlaces.map(place => {
              const image = place.main_image || place.images?.[0];
              const isActing = acting === place.id;
              return (
                <div key={place.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="flex gap-4 p-4">
                    {/* Thumb */}
                    <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {image ? (
                        <img src={image} alt={place.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {CATEGORY_ICONS[place.category] || '🏠'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-black text-gray-900 text-sm">{place.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">
                            {CATEGORY_ICONS[place.category]} {place.category} · {place.city?.replace(/-/g,' ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">By: {place.host_name || place.host_email || 'Unknown'}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-rose-500 text-sm">{place.price?.toLocaleString()} EGP</p>
                          {place.is_featured && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">★ Featured</span>
                          )}
                        </div>
                      </div>

                      {place.description && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{place.description}</p>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {place.whatsapp && (
                          <a href={`https://wa.me/${place.whatsapp.replace(/\D/g,'')}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            <MessageCircle className="w-2.5 h-2.5" /> Contact Host
                          </a>
                        )}
                        {place.google_maps_link && (
                          <a href={place.google_maps_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            <MapPin className="w-2.5 h-2.5" /> View Map
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="flex border-t border-gray-50 divide-x divide-gray-50">
                    {tab === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(place.id, 'approved')} disabled={isActing}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50">
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                        <button onClick={() => updateStatus(place.id, 'rejected')} disabled={isActing}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {tab === 'approved' && (
                      <button onClick={() => updateStatus(place.id, 'pending')} disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50">
                        Unpublish
                      </button>
                    )}
                    {tab === 'rejected' && (
                      <button onClick={() => updateStatus(place.id, 'approved')} disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50">
                        <CheckCircle className="w-3.5 h-3.5" /> Re-approve
                      </button>
                    )}
                    <button onClick={() => toggleFeatured(place)} disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50">
                      <Star className={`w-3.5 h-3.5 ${place.is_featured ? 'fill-amber-400' : ''}`} />
                      {place.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => deletePlace(place.id)} disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}