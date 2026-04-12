import { useState } from 'react';
import { X, MapPin, Tag, Phone, User, ChevronDown } from 'lucide-react';

const CITIES = ['Hurghada', 'Sharm El Sheikh', 'Luxor', 'Aswan', 'El Gouna'];
const CATEGORIES = [
  'Tour Guide', 'Hotel / Accommodation', 'Boat Trip', 'Horse Riding',
  'Restaurant', 'Medical / Clinic', 'Transport / Driver', 'Water Sports',
  'Shopping / Bazaar', 'Other'
];

export default function AddServiceModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', city: '', category: '', whatsapp: '', note: '' });
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    const msg = encodeURIComponent(
      `Hi Locali Egypt! I want to list my service:\n\n` +
      `Business: ${form.name}\nCity: ${form.city}\nCategory: ${form.category}\nWhatsApp: ${form.whatsapp}\nNote: ${form.note}`
    );
    window.open(`https://wa.me/201000000000?text=${msg}`, '_blank');
    setDone(true);
  };

  const isValid = form.name && form.city && form.category && form.whatsapp;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg" style={{ color: '#3A2A1E' }}>Add Your Service Free</h2>
            <p className="text-xs text-gray-500 mt-0.5">Reach thousands of tourists across Egypt</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F5E9DA' }}>
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="font-black text-lg mb-2" style={{ color: '#3A2A1E' }}>Submitted via WhatsApp!</h3>
            <p className="text-sm text-gray-500 mb-6">We'll review your listing and get back to you within 24 hours.</p>
            <button onClick={() => { setDone(false); onClose(); }}
              className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
              style={{ background: '#2E7D8A' }}>
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Trust badges */}
            <div className="flex gap-2 flex-wrap">
              {['✅ Free listing', '🚀 Live in 24h', '📲 WhatsApp contact'].map(b => (
                <span key={b} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#F5E9DA', color: '#3A2A1E' }}>{b}</span>
              ))}
            </div>

            {/* Fields */}
            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Business / Service Name *
              </label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Ahmed's Desert Tours"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#2E7D8A' }}
              />
            </div>

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
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

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
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> WhatsApp Number *
              </label>
              <input
                value={form.whatsapp}
                onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
                placeholder="e.g. 201001234567"
                type="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 mb-1.5 block">Brief Description (optional)</label>
              <textarea
                value={form.note}
                onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                placeholder="Tell tourists about your service..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full py-4 rounded-2xl font-black text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: isValid ? '#2E7D8A' : '#9ca3af' }}
            >
              Submit via WhatsApp →
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