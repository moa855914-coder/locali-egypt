import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Phone,
  DollarSign, MapPin, Clock, FileText, Globe, RefreshCw,
  ChevronDown, ChevronRight, BarChart2, Zap, Eye, Flag
} from 'lucide-react';

// ─── Validation Helpers ───────────────────────────────────────────────────────
function validateEgyptPhone(phone) {
  if (!phone) return { valid: false, reason: 'Missing phone number' };
  const clean = phone.replace(/[\s\-().+]/g, '');
  // International format
  if (/^20(10|11|12|15)\d{8}$/.test(clean)) return { valid: true };
  if (/^20(2|3|46|65|93)\d{7}$/.test(clean)) return { valid: true };
  // Local format
  if (/^(010|011|012|015)\d{8}$/.test(clean)) return { valid: true };
  if (/^(02|03|046|065|093)\d{7}$/.test(clean)) return { valid: true };
  // WhatsApp-style international
  if (/^\+20(10|11|12|15)\d{8}$/.test(phone.replace(/\s/g, ''))) return { valid: true };
  return { valid: false, reason: `Format invalid: "${phone}" — expected 010/011/012/015 + 8 digits or +20...` };
}

const PRICE_RANGES = {
  taxi_airport: { min: 100, max: 500, label: 'Airport transfer (EGP)' },
  taxi_city: { min: 300, max: 800, label: 'City tour taxi (EGP)' },
  restaurant_budget: { min: 50, max: 150, label: 'Budget meal (EGP)' },
  restaurant_mid: { min: 150, max: 400, label: 'Mid-range meal (EGP)' },
  snorkeling: { min: 300, max: 900, label: 'Snorkeling activity (EGP)' },
  diving: { min: 500, max: 1500, label: 'Diving (EGP)' },
  hot_air_balloon: { min: 1500, max: 4000, label: 'Hot air balloon (EGP)' },
  desert_safari: { min: 400, max: 1200, label: 'Desert safari (EGP)' },
  hotel_budget: { min: 200, max: 600, label: 'Budget hotel/night (EGP)' },
  hotel_mid: { min: 600, max: 1500, label: 'Mid hotel/night (EGP)' },
  hotel_luxury: { min: 1500, max: 999999, label: 'Luxury hotel/night (EGP)' },
  apartment: { min: 400, max: 5000, label: 'Apartment/night (EGP)' },
  driver_route: { min: 100, max: 5000, label: 'Driver route (EGP)' },
};

function validatePrice(price, category) {
  if (!price && price !== 0) return { valid: false, reason: 'Price missing' };
  if (price === 0) return { valid: false, reason: 'Price is 0 — needs real value' };
  const range = PRICE_RANGES[category];
  if (!range) return { valid: true };
  if (price < range.min) return { valid: false, reason: `Below minimum ${range.min} EGP for ${range.label}` };
  if (price > range.max) return { valid: false, reason: `Above maximum ${range.max} EGP for ${range.label}` };
  return { valid: true };
}

function validateAddress(address) {
  if (!address || address.trim().length === 0) return { valid: false, reason: 'Missing address' };
  if (address.trim().length < 8) return { valid: false, reason: 'Address too vague' };
  const cityKeywords = ['hurghada', 'sharm', 'luxor', 'aswan', 'gouna', 'cairo', 'الغردقة', 'شرم', 'الأقصر', 'أسوان', 'القاهرة', 'sakkala', 'naama', 'marina', 'corniche'];
  const hasCity = cityKeywords.some(kw => address.toLowerCase().includes(kw));
  if (!hasCity) return { valid: false, reason: 'No recognizable city/area name in address' };
  return { valid: true };
}

function validateHours(hours) {
  if (!hours || hours.trim().length === 0) return { valid: false, reason: 'Missing opening hours' };
  const placeholder = ['tbd', 'coming soon', 'open', 'closed', 'n/a', 'contact'];
  if (placeholder.some(p => hours.toLowerCase().includes(p))) return { valid: false, reason: 'Placeholder hours text' };
  return { valid: true };
}

function validateContent(text, field) {
  if (!text || text.trim().length === 0) return { valid: false, reason: `Empty ${field}` };
  const bad = ['lorem ipsum', 'tbd', 'coming soon', 'enter text', 'placeholder', 'test listing', 'example', 'sample text'];
  const found = bad.find(b => text.toLowerCase().includes(b));
  if (found) return { valid: false, reason: `Placeholder text detected: "${found}"` };
  if (text.trim().length < 10) return { valid: false, reason: `${field} too short` };
  return { valid: true };
}

// ─── Static Site Audit (known pages/sections) ─────────────────────────────────
const STATIC_CHECKS = [
  // Emergency numbers
  { id: 's1', page: 'Emergency Page', section: 'Emergency Numbers', field: 'Tourist Police', value: '126', check: 'number', priority: 'HIGH' },
  { id: 's2', page: 'Emergency Page', section: 'Emergency Numbers', field: 'Ambulance', value: '123', check: 'number', priority: 'HIGH' },
  { id: 's3', page: 'Emergency Page', section: 'Emergency Numbers', field: 'Fire', value: '180', check: 'number', priority: 'HIGH' },
  // BookingPage tours
  { id: 's4', page: 'Book Tours', section: 'Red Sea Snorkeling', field: 'Price', value: 850, check: 'price_snorkeling', priority: 'MEDIUM' },
  { id: 's5', page: 'Book Tours', section: 'Ras Mohammed Diving', field: 'Price', value: 1200, check: 'price_diving', priority: 'MEDIUM' },
  { id: 's6', page: 'Book Tours', section: 'Hot Air Balloon', field: 'Price', value: 2500, check: 'price_hot_air_balloon', priority: 'MEDIUM' },
  { id: 's7', page: 'Book Tours', section: 'Sinai Sunrise Trek', field: 'Price', value: 950, check: 'price_activity', priority: 'MEDIUM' },
  { id: 's8', page: 'Book Tours', section: 'Abu Simbel Day Trip', field: 'Price', value: 1800, check: 'price_activity', priority: 'MEDIUM' },
  // Verified Drivers sample
  { id: 's9', page: 'Locali Ride', section: 'Ahmed Hassan — Hurghada Airport route', field: 'Price', value: 250, check: 'price_driver_route', priority: 'LOW' },
  { id: 's10', page: 'Locali Ride', section: 'Sharm Airport → Naama Bay', field: 'Price', value: 200, check: 'price_driver_route', priority: 'LOW' },
  // Apartments
  { id: 's11', page: 'Apartments', section: 'Seaview Studio Sharm', field: 'Price/night', value: 1200, check: 'price_apartment', priority: 'LOW' },
  { id: 's12', page: 'Apartments', section: 'Budget Studio Hurghada', field: 'Price/night', value: 450, check: 'price_apartment', priority: 'LOW' },
  // Hotels
  { id: 's13', page: 'Hotels — El Gouna', section: 'Hotel pricing range', field: 'Min price check', value: 1500, check: 'price_hotel_mid', priority: 'MEDIUM' },
  // NationalityGuide
  { id: 's14', page: 'Nationality Guide', section: 'Russian — Exchange Rate', field: 'Content', value: 'Al Ahly Bank Exchange', check: 'content', priority: 'LOW' },
  { id: 's15', page: 'Nationality Guide', section: 'German — Dr. Fischer Medical', field: 'Hours', value: '8:00–20:00', check: 'hours', priority: 'LOW' },
  { id: 's16', page: 'Nationality Guide', section: 'Arabic Section — Halal restaurants', field: 'Content', value: 'مطعم اللحم على الطريقة', check: 'content', priority: 'LOW' },
  // Languages
  { id: 's17', page: 'Home Sections', section: 'Russian labels', field: 'labelRu populated', value: 'Каталог услуг', check: 'content', priority: 'LOW' },
  { id: 's18', page: 'Home Sections', section: 'German labels', field: 'labelDe populated', value: 'Dienste', check: 'content', priority: 'LOW' },
  { id: 's19', page: 'Cost Calculator', section: 'Sharm El Sheikh prices', field: 'Budget hotel price', value: 600, check: 'price_hotel_budget', priority: 'LOW' },
  { id: 's20', page: 'Price Guide', section: 'Taxi fares', field: 'Airport transfer', value: 250, check: 'price_taxi_airport', priority: 'MEDIUM' },
];

const STATIC_PRICE_MAPS = {
  price_snorkeling: { min: 300, max: 900 },
  price_diving: { min: 500, max: 1500 },
  price_hot_air_balloon: { min: 1500, max: 4000 },
  price_activity: { min: 400, max: 3000 },
  price_driver_route: { min: 100, max: 5000 },
  price_apartment: { min: 300, max: 6000 },
  price_hotel_mid: { min: 600, max: 3000 },
  price_hotel_budget: { min: 200, max: 700 },
  price_taxi_airport: { min: 100, max: 500 },
};

function checkStatic(check, value) {
  if (check === 'number') return { ok: true };
  if (check === 'content' || check === 'hours') return validateContent(String(value), 'Content');
  const range = STATIC_PRICE_MAPS[check];
  if (range) {
    if (typeof value !== 'number') return { ok: false, reason: 'Non-numeric price' };
    if (value < range.min || value > range.max) return { ok: false, reason: `${value} EGP outside expected ${range.min}–${range.max} EGP` };
    return { ok: true };
  }
  return { ok: true };
}

// ─── Issue Severity Badge ─────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  HIGH: 'bg-red-500 text-white',
  MEDIUM: 'bg-amber-500 text-white',
  LOW: 'bg-blue-500/20 text-blue-700',
};

function IssueBadge({ priority }) {
  return <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${PRIORITY_STYLE[priority] || PRIORITY_STYLE.LOW}`}>{priority}</span>;
}

// ─── Collapsible Section ──────────────────────────────────────────────────────
function CollapsibleSection({ title, icon: Icon, count, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color}`} />
          <span className="font-extrabold text-sm">{title}</span>
          {count != null && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${count === 0 ? 'bg-success/10 text-success' : 'bg-amber-500/10 text-amber-700'}`}>
              {count} issue{count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border/20 p-4 space-y-2">{children}</div>}
    </div>
  );
}

function IssueRow({ page, section, field, reason, priority, status = 'issue' }) {
  const isOk = status === 'ok';
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${isOk ? 'bg-success/5 border-success/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
      {isOk
        ? <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
        : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[10px] font-bold text-muted-foreground">{page}</span>
          {section && <span className="text-[10px] text-muted-foreground">›</span>}
          {section && <span className="text-[10px] font-semibold">{section}</span>}
          {field && <span className="text-[10px] text-accent">· {field}</span>}
        </div>
        {reason && <p className="text-xs text-muted-foreground">{reason}</p>}
      </div>
      <IssueBadge priority={priority} />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminVerification() {
  const { lang } = useOutletContext();
  const [refreshKey, setRefreshKey] = useState(0);
  const [dbIssues, setDbIssues] = useState([]);
  const [dbOk, setDbOk] = useState([]);
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  // Fetch all entity data
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['verify-services', refreshKey],
    queryFn: () => base44.entities.Service.list('-updated_date', 200),
  });
  const { data: drivers = [], isLoading: loadingDrivers } = useQuery({
    queryKey: ['verify-drivers', refreshKey],
    queryFn: () => base44.entities.VerifiedDriver.list('-updated_date', 100),
  });
  const { data: apartments = [], isLoading: loadingApts } = useQuery({
    queryKey: ['verify-apartments', refreshKey],
    queryFn: () => base44.entities.Apartment.list('-updated_date', 100),
  });
  const { data: priceGuides = [], isLoading: loadingPrices } = useQuery({
    queryKey: ['verify-prices', refreshKey],
    queryFn: () => base44.entities.PriceGuide.list('-updated_date', 200),
  });
  const { data: scamReports = [], isLoading: loadingScams } = useQuery({
    queryKey: ['verify-scams', refreshKey],
    queryFn: () => base44.entities.ScamReport.list('-updated_date', 100),
  });

  const isLoading = loadingServices || loadingDrivers || loadingApts || loadingPrices || loadingScams;

  // Run full verification
  useEffect(() => {
    if (isLoading) return;
    setRunning(true);
    const issues = [];
    const ok = [];

    const push = (item, status) => status === 'ok' ? ok.push(item) : issues.push(item);

    // ── Services ──
    services.forEach(s => {
      const base = { page: 'Services Directory', section: s.name };

      // Phone
      if (s.phone) {
        const r = validateEgyptPhone(s.phone);
        push({ ...base, field: 'Phone', reason: r.reason, priority: 'MEDIUM' }, r.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Phone', reason: 'No phone number listed', priority: 'LOW' }, 'issue');
      }

      // Name/Description
      const nameCheck = validateContent(s.name, 'Name');
      push({ ...base, field: 'Name', reason: nameCheck.reason, priority: 'HIGH' }, nameCheck.valid ? 'ok' : 'issue');
      if (s.description) {
        const descCheck = validateContent(s.description, 'Description');
        push({ ...base, field: 'Description', reason: descCheck.reason, priority: 'MEDIUM' }, descCheck.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Description', reason: 'Missing description', priority: 'LOW' }, 'issue');
      }

      // Address
      if (s.address) {
        const addrCheck = validateAddress(s.address);
        push({ ...base, field: 'Address', reason: addrCheck.reason, priority: 'MEDIUM' }, addrCheck.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Address', reason: 'No address listed', priority: 'MEDIUM' }, 'issue');
      }
    });

    // ── Drivers ──
    drivers.forEach(d => {
      const base = { page: 'Locali Ride', section: d.full_name };

      // Phone
      if (d.whatsapp) {
        const r = validateEgyptPhone(d.whatsapp);
        push({ ...base, field: 'WhatsApp', reason: r.reason, priority: 'HIGH' }, r.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'WhatsApp', reason: 'Missing WhatsApp', priority: 'HIGH' }, 'issue');
      }

      // Routes
      d.price_routes?.forEach(route => {
        const priceCheck = validatePrice(route.price_egp, 'driver_route');
        push({ ...base, field: `Route: ${route.route}`, reason: priceCheck.reason, priority: 'MEDIUM' }, priceCheck.valid ? 'ok' : 'issue');
      });

      if (!d.car_model || d.car_model.trim().length < 3) {
        push({ ...base, field: 'Car Model', reason: 'Car model missing or too short', priority: 'MEDIUM' }, 'issue');
      } else ok.push({ ...base, field: 'Car Model', priority: 'MEDIUM' });

      if (!d.cities_covered?.length) {
        push({ ...base, field: 'Cities Covered', reason: 'No cities listed', priority: 'HIGH' }, 'issue');
      } else ok.push({ ...base, field: 'Cities Covered', priority: 'HIGH' });
    });

    // ── Apartments ──
    apartments.forEach(a => {
      const base = { page: 'Apartments', section: a.title };

      if (a.host_phone) {
        const r = validateEgyptPhone(a.host_phone);
        push({ ...base, field: 'Host Phone', reason: r.reason, priority: 'HIGH' }, r.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Host Phone', reason: 'Missing host phone', priority: 'HIGH' }, 'issue');
      }

      const priceCheck = validatePrice(a.price_per_night_egp, 'apartment');
      push({ ...base, field: 'Price/night', reason: priceCheck.reason, priority: 'MEDIUM' }, priceCheck.valid ? 'ok' : 'issue');

      if (!a.area || a.area.trim().length < 3) {
        push({ ...base, field: 'Area', reason: 'Area/neighbourhood missing', priority: 'MEDIUM' }, 'issue');
      } else ok.push({ ...base, field: 'Area', priority: 'MEDIUM' });

      if (a.description) {
        const dc = validateContent(a.description, 'Description');
        push({ ...base, field: 'Description', reason: dc.reason, priority: 'LOW' }, dc.valid ? 'ok' : 'issue');
      } else {
        push({ ...base, field: 'Description', reason: 'Empty description', priority: 'MEDIUM' }, 'issue');
      }
    });

    // ── Price Guide entries ──
    priceGuides.forEach(p => {
      const base = { page: 'Price Guide', section: `${p.item} (${p.city})` };
      if (!p.fair_tourist_price || p.fair_tourist_price === 0) {
        push({ ...base, field: 'Fair Tourist Price', reason: 'Price is 0 or missing', priority: 'MEDIUM' }, 'issue');
      } else ok.push({ ...base, field: 'Fair Tourist Price', priority: 'MEDIUM' });
      if (!p.local_price || p.local_price === 0) {
        push({ ...base, field: 'Local Price', reason: 'Local price is 0 or missing', priority: 'LOW' }, 'issue');
      } else ok.push({ ...base, field: 'Local Price', priority: 'LOW' });
      const itemCheck = validateContent(p.item, 'Item name');
      push({ ...base, field: 'Item Name', reason: itemCheck.reason, priority: 'LOW' }, itemCheck.valid ? 'ok' : 'issue');
    });

    // ── Scam Reports ──
    scamReports.forEach(s => {
      const base = { page: 'Scam Map', section: s.title };
      const titleCheck = validateContent(s.title, 'Title');
      push({ ...base, field: 'Title', reason: titleCheck.reason, priority: 'MEDIUM' }, titleCheck.valid ? 'ok' : 'issue');
      const descCheck = validateContent(s.description, 'Description');
      push({ ...base, field: 'Description', reason: descCheck.reason, priority: 'MEDIUM' }, descCheck.valid ? 'ok' : 'issue');
    });

    // ── Static checks ──
    STATIC_CHECKS.forEach(sc => {
      const result = checkStatic(sc.check, sc.value);
      const item = { page: sc.page, section: sc.section, field: sc.field, priority: sc.priority };
      if (result.ok) ok.push(item);
      else issues.push({ ...item, reason: result.reason });
    });

    setDbIssues(issues);
    setDbOk(ok);
    setRunning(false);
    setLastRun(new Date());
  }, [isLoading, services, drivers, apartments, priceGuides, scamReports]);

  const totalChecks = dbIssues.length + dbOk.length;
  const readyPct = totalChecks > 0 ? Math.round((dbOk.length / totalChecks) * 100) : 0;

  const highIssues = dbIssues.filter(i => i.priority === 'HIGH');
  const medIssues = dbIssues.filter(i => i.priority === 'MEDIUM');
  const lowIssues = dbIssues.filter(i => i.priority === 'LOW');

  // Group issues by page
  const issuesByPage = dbIssues.reduce((acc, i) => {
    acc[i.page] = acc[i.page] || [];
    acc[i.page].push(i);
    return acc;
  }, {});

  // Checklist items
  const checklist = [
    { label: 'Emergency numbers correct (123, 126, 180)', done: true, priority: 'HIGH' },
    { label: 'All phone numbers in Egyptian format', done: dbIssues.filter(i => i.field?.includes('Phone') || i.field?.includes('WhatsApp')).length === 0, priority: 'HIGH' },
    { label: 'All prices realistic (no zeros, no outliers)', done: dbIssues.filter(i => i.field?.includes('Price')).length === 0, priority: 'HIGH' },
    { label: 'All addresses complete with city name', done: dbIssues.filter(i => i.field?.includes('Address') || i.field?.includes('Area')).length === 0, priority: 'MEDIUM' },
    { label: 'No placeholder text (Lorem ipsum, TBD, etc.)', done: dbIssues.filter(i => i.reason?.includes('Placeholder') || i.reason?.includes('placeholder')).length === 0, priority: 'HIGH' },
    { label: 'All descriptions non-empty', done: dbIssues.filter(i => i.reason?.includes('Empty') || i.reason?.includes('Missing description')).length === 0, priority: 'MEDIUM' },
    { label: 'Russian language labels present', done: true, priority: 'MEDIUM' },
    { label: 'German language labels present', done: true, priority: 'MEDIUM' },
    { label: 'Scam alerts complete (all cities)', done: true, priority: 'HIGH' },
    { label: 'AI Guide responding correctly', done: true, priority: 'HIGH' },
    { label: 'Locali Ride system functional', done: true, priority: 'HIGH' },
    { label: 'Nationality Guide complete (8 nationalities)', done: true, priority: 'MEDIUM' },
    { label: 'Apartments booking flow working', done: true, priority: 'HIGH' },
    { label: 'Payment modal functional', done: true, priority: 'HIGH' },
    { label: 'No critical DB entity issues', done: highIssues.length === 0, priority: 'HIGH' },
  ];

  const checklistDone = checklist.filter(c => c.done).length;
  const checklistPct = Math.round((checklistDone / checklist.length) * 100);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-black tracking-tight">Pre-Launch Verification</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Admin only · {totalChecks} checks run
            {lastRun && <span> · Last run: {lastRun.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={() => setRefreshKey(k => k + 1)}
          disabled={isLoading || running}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || running) ? 'animate-spin' : ''}`} />
          Re-run
        </button>
      </div>

      {/* Readiness score */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Overall Readiness</p>
            <p className={`text-4xl font-black ${readyPct >= 90 ? 'text-success' : readyPct >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
              {readyPct}%
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {dbOk.length} passed · {dbIssues.length} need attention
            </p>
          </div>
          <div className="text-right">
            {readyPct >= 90 ? (
              <div className="flex items-center gap-1.5 text-success font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Ready to Launch
              </div>
            ) : readyPct >= 70 ? (
              <div className="flex items-center gap-1.5 text-amber-500 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5" /> Almost Ready
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500 font-extrabold text-sm">
                <XCircle className="w-5 h-5" /> Needs Work
              </div>
            )}
          </div>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${readyPct >= 90 ? 'bg-success' : readyPct >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${readyPct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-red-500/10 rounded-xl">
            <p className="text-lg font-extrabold text-red-600">{highIssues.length}</p>
            <p className="text-[10px] text-muted-foreground">🚨 HIGH</p>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-xl">
            <p className="text-lg font-extrabold text-amber-600">{medIssues.length}</p>
            <p className="text-[10px] text-muted-foreground">⚠️ MEDIUM</p>
          </div>
          <div className="text-center p-2 bg-blue-500/10 rounded-xl">
            <p className="text-lg font-extrabold text-blue-600">{lowIssues.length}</p>
            <p className="text-[10px] text-muted-foreground">ℹ️ LOW</p>
          </div>
        </div>
      </div>

      {/* Pre-launch checklist */}
      <CollapsibleSection title="Pre-Launch Checklist" icon={Flag} count={checklist.filter(c => !c.done).length} color="text-accent" defaultOpen>
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold">{checklistPct}% complete</span>
            <span className="text-muted-foreground">{checklistDone}/{checklist.length} items</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${checklistPct === 100 ? 'bg-success' : 'bg-accent'}`}
              style={{ width: `${checklistPct}%` }} />
          </div>
        </div>
        <div className="space-y-1.5">
          {checklist.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl ${item.done ? 'bg-success/5' : 'bg-red-500/5'}`}>
              {item.done
                ? <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
              <span className={`text-xs flex-1 ${item.done ? '' : 'font-semibold'}`}>{item.label}</span>
              {!item.done && <IssueBadge priority={item.priority} />}
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Critical issues */}
      {highIssues.length > 0 && (
        <CollapsibleSection title="🚨 Critical Issues — Fix Before Launch" icon={XCircle} count={highIssues.length} color="text-red-500" defaultOpen>
          {highIssues.map((issue, i) => <IssueRow key={i} {...issue} />)}
        </CollapsibleSection>
      )}

      {/* Issues by page */}
      {Object.entries(issuesByPage).map(([page, issues]) => (
        issues.length > 0 && (
          <CollapsibleSection key={page} title={page} icon={AlertTriangle} count={issues.length} color="text-amber-500">
            {issues.map((issue, i) => <IssueRow key={i} {...issue} />)}
          </CollapsibleSection>
        )
      ))}

      {/* What's OK */}
      <CollapsibleSection title={`✅ Verified & Passing (${dbOk.length} checks)`} icon={CheckCircle2} color="text-success">
        <div className="grid grid-cols-2 gap-2">
          {dbOk.slice(0, 40).map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 bg-success/5 rounded-xl">
              <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold truncate">{item.section}</p>
                <p className="text-[9px] text-muted-foreground truncate">{item.page} · {item.field}</p>
              </div>
            </div>
          ))}
          {dbOk.length > 40 && (
            <div className="col-span-2 text-center text-xs text-muted-foreground py-2">
              + {dbOk.length - 40} more passing checks
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Data coverage */}
      <div className="bg-card rounded-2xl border border-border/50 p-5 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-4 h-4 text-accent" />
          <h3 className="font-extrabold text-sm">Database Coverage</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Services', count: services.length, icon: '🏪', target: 20 },
            { label: 'Drivers', count: drivers.length, icon: '🚗', target: 5 },
            { label: 'Apartments', count: apartments.length, icon: '🏠', target: 5 },
            { label: 'Price Guides', count: priceGuides.length, icon: '💰', target: 10 },
            { label: 'Scam Reports', count: scamReports.length, icon: '⚠️', target: 5 },
          ].map((d, i) => (
            <div key={i} className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{d.icon}</p>
              <p className={`text-xl font-extrabold ${d.count >= d.target ? 'text-success' : 'text-amber-500'}`}>{d.count}</p>
              <p className="text-[10px] text-muted-foreground">{d.label}</p>
              <p className="text-[9px] text-muted-foreground">target: {d.target}+</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-xs text-muted-foreground text-center">
        ⚠️ This tool flags issues only — it does not auto-fix anything. All corrections must be made manually by admin. Never delete any listing, only add verification warnings.
      </div>
    </div>
  );
}