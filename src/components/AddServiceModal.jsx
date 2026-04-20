import { useState } from 'react';
import { X, MapPin, Tag, Phone, User, ChevronDown, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const CITIES = [
  { label: 'Hurghada', value: 'hurghada' },
  { label: 'Sharm El Sheikh', value: 'sharm-el-sheikh' },
  { label: 'Luxor', value: 'luxor' },
  { label: 'Aswan', value: 'aswan' },
  { label: 'El Gouna', value: 'el-gouna' },
];

const CATEGORIES = [
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Transport / Driver', value: 'transport' },
  { label: 'Medical / Clinic', value: 'medical' },
  { label: 'Activities & Tours', value: 'activities' },
  { label: 'Kids & Family', value: 'kids_family' },
  { label: 'SIM / Internet', value: 'sim_internet' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Remote Work', value: 'remote_work' },
  { label: 'Long Stay Services', value: 'long_stay' },
  { label: 'Other', value: 'other' },
];

const EMPTY_FORM = { name: '', city: '', category: '', whatsapp: '', description: '' };

export default function AddServiceModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const queryClient = useQueryClient();

  if (!open) return null;

  const isValid = form.name.trim() && form.city && form.category && form.whatsapp.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await base44.entities.Service.create({
        name: form.name.trim(),
        city: form.city,
        category: form.category,
        description: form.description.trim() || undefined,
        phone: form.whatsapp.trim(),
        is_verified: false,
        is_featured: false,
        avg_rating: 0,
        review_count: 0,
        scam_score: 0,
        subscription_tier: 'none',
      });
      // Invalidate services queries so listings refresh immediately
      queryClient.invalidateQueries({ queryKey: ['allServices'] });
      setStatus('success');
    } catch (err) {
      setErrorMsg(err?.message || 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setStatus('idle');
    setErrorMsg('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg" style={{ color: '#3A2A1E' }}>Add Your Service Free</h2>
            <p className="text-xs text-gray-500 mt-0.5">Reach thousands of tourists across Egypt</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F5E9DA' }}>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-black text-lg mb-2" style={{ color: '#3A2A1E' }}>Listing Submitted!</h3>
            <p className="text-sm text-gray-500 mb-6">Your service is now live in the listings. It will be reviewed for verification within 24 hours.</p>
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: '#2E7D8A' }}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Trust badges */}
            <div className="flex gap-2 flex-wrap">
              {['✅ Free listing', '🚀 Live instantly', '📲 Direct WhatsApp'].map(b => (
                <span key={b} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#F5E9DA', color: '#3A2A1E' }}>{b}</span>
              ))}
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700 font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Business Name */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Business / Service Name *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Ahmed's Desert Tours"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D8A] focus:border-transparent transition-all"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> City *
              </label>
              <div className="relative">
                <select
                  value={form.city}
                  onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none appearance-none bg-white pr-10"
                >
                  <option value="">Select city...</option>
                  {CITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Category *
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none appearance-none bg-white pr-10"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> WhatsApp Number *
              </label>
              <input
                value={form.whatsapp}
                onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="e.g. 201001234567"
                type="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D8A] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Brief Description (optional)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Tell tourists about your service..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none resize-none focus:ring-2 focus:ring-[#2E7D8A] focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid || status === 'loading'}
              className="w-full py-4 rounded-2xl font-black text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: isValid && status !== 'loading' ? '#2E7D8A' : '#9ca3af' }}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Listing →'
              )}
            </button>

            <p className="text-[10px] text-center text-gray-400">
              Free to list. Verified badge available after review. No commission on direct contacts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}