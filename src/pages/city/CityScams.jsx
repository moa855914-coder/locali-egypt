import { useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { CITY_META, CITY_SCAMS, CITY_FAQS } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const SEVERITY_STYLES = {
  high: { badge: 'bg-red-500 text-white', border: 'border-red-500/30 bg-red-500/5' },
  medium: { badge: 'bg-amber-500 text-white', border: 'border-amber-500/30 bg-amber-500/5' },
  low: { badge: 'bg-muted text-muted-foreground', border: 'border-border/50 bg-card' },
};

export default function CityScams() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const scams = CITY_SCAMS[cityId] || [];
  const faqs = CITY_FAQS[cityId] || [];
  const [expanded, setExpanded] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'other', severity: 'medium', location_name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!meta) return <div className="p-4">City not found</div>;

  const highCount = scams.filter(s => s.severity === 'high').length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ScamReport.create({ ...form, city: cityId, status: 'pending' });
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Common Scams in {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          Real scam reports from tourists in {meta.name}. Knowing these patterns in advance dramatically reduces your risk. None of this is sensationalism — these happen every week.
        </p>

        {/* Stats bar */}
        <div className="flex gap-4 mb-6">
          <div className="bg-red-500/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-red-500">{highCount}</p>
            <p className="text-[10px] font-bold text-red-500">HIGH RISK</p>
          </div>
          <div className="bg-amber-500/10 rounded-xl px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-amber-600">{scams.length - highCount}</p>
            <p className="text-[10px] font-bold text-amber-600">MODERATE</p>
          </div>
          <div className="flex-1 bg-card rounded-xl border border-border/50 px-4 py-3 flex items-center">
            <ShieldCheck className="w-4 h-4 text-success mr-2" />
            <p className="text-xs text-muted-foreground">Reading this makes you <strong>much safer</strong></p>
          </div>
        </div>

        {/* Scam list */}
        <div className="space-y-3 mb-8">
          {scams.map((scam, i) => {
            const styles = SEVERITY_STYLES[scam.severity] || SEVERITY_STYLES.low;
            return (
              <div key={i} className={`rounded-2xl border p-5 ${styles.border}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                        {scam.severity.toUpperCase()} RISK
                      </span>
                    </div>
                    <h2 className="font-bold text-sm">{scam.title}</h2>
                  </div>
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="p-1 shrink-0">
                    {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                {expanded === i && (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">{scam.desc}</p>
                    <div className="bg-success/10 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-success mb-1">HOW TO AVOID</p>
                      <p className="text-sm text-muted-foreground">{scam.avoid}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Report a scam */}
        {submitted ? (
          <div className="bg-success/10 border border-success/20 rounded-2xl p-5 text-center mb-8">
            <ShieldCheck className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="font-bold text-sm">Report submitted. Thank you for helping fellow travelers.</p>
          </div>
        ) : showForm ? (
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-8 space-y-3">
            <h3 className="font-bold">Report a Scam in {meta.name}</h3>
            <input type="text" placeholder="What happened? (brief title)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            <textarea placeholder="Describe the scam..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required className="w-full px-3 py-3 bg-background rounded-xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent" />
            <div className="grid grid-cols-2 gap-3">
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} className="px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none">
                <option value="low">Low severity</option>
                <option value="medium">Medium severity</option>
                <option value="high">High severity</option>
              </select>
              <input type="text" placeholder="Location (optional)" value={form.location_name} onChange={e => setForm({ ...form, location_name: e.target.value })} className="px-3 py-3 bg-background rounded-xl border border-border text-sm focus:outline-none" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-secondary rounded-xl text-sm font-bold">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 bg-card border border-border rounded-2xl p-4 text-sm font-bold hover:bg-secondary transition-colors mb-8">
            <Plus className="w-4 h-4" />
            Report a Scam in {meta.name}
          </button>
        )}

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8">
          <SafeNextStep
            title={`Verified Services in ${meta.name}`}
            description="Skip the risk — trusted providers only"
            to={`/services?city=${cityId}`}
          />
        </div>
      </div>
    </div>
  );
}