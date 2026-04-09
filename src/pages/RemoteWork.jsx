import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import { CITIES } from '../lib/constants';
import SafeNextStep from '../components/SafeNextStep';
import { Laptop, Wifi, Zap, MapPin, CheckCircle2, Clock, Briefcase, ExternalLink, AlertTriangle, Search } from 'lucide-react';

const WORK_SOURCES = [
  {
    category: '📋 Official — Work Permit Application',
    items: [
      {
        title: 'GAFI — Obtain a Work Permit (Official Portal)',
        desc: 'Official Egyptian government portal. Submit work permit applications, check prerequisites, fees, and required documents.',
        url: 'https://www.gafi.gov.eg/English/eServices/Pages/DepartmentService.aspx?DSID=40',
        badge: '🏛️ Official Gov',
        badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
      },
      {
        title: 'Ministry of Manpower Egypt — Official Site',
        desc: 'Egyptian Ministry of Manpower — the authority that issues and approves all foreign work permits in Egypt.',
        url: 'https://www.manpower.gov.eg',
        badge: '🏛️ Official Gov',
        badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
      },
    ],
  },
  {
    category: '📰 Legal Updates — New Labor Law 2025',
    items: [
      {
        title: 'EY Tax Alert — Egypt New Labor Law No. 14 of 2025',
        desc: 'Ernst & Young official analysis: Labor Law No. 14 of 2025 effective September 1, 2025. Replaces Law No. 12 of 2003. Key changes for foreign employers.',
        url: 'https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025',
        badge: '⚖️ Legal Analysis',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
      },
      {
        title: 'Mondaq — Resolution 279/2025: Foreign Work Permit Rules',
        desc: 'Detailed breakdown of Ministry of Labour Resolution 279 of 2025. Conditions, controls, and new framework for foreign worker licensing.',
        url: 'https://www.mondaq.com/employee-rights-labour-relations/1735194/foreign-work-permits-in-egypt-%7C-legal-requirements-under-resolution-279-of-2025',
        badge: '⚖️ Legal Analysis',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
      },
      {
        title: 'Safeguard Global — Egypt 10% Foreign Worker Cap (Decree 279)',
        desc: 'Effective December 2025: Egypt caps foreign workers at 10% of workforce per company. Updated permit rules, fees, and employer reporting requirements.',
        url: 'https://www.safeguardglobal.com/resources/blog/egypt-279-decree-limits-foreign-workers/',
        badge: '⚠️ Key Change',
        badgeColor: 'bg-red-500/10 text-red-700 border-red-200',
      },
      {
        title: 'Sterling Lexicon — New Foreign Worker Law from Sept 2025',
        desc: 'Summary of the September 2025 law changes: waiver of reciprocal treatment, updated permit categories, and compliance timelines.',
        url: 'https://www.sterlinglexicon.com/immigration-blog/new-law-governing-foreign-workers-in-egypt-to-be-introduced-in-september-2025/',
        badge: '⚖️ Legal Summary',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
      },
      {
        title: 'Legal Way Law Firm — Work Permits for Foreign Nationals in Egypt',
        desc: 'Step-by-step guide: GAFI Labor Office submission, Ministry of Manpower approval, 3-week processing, annual validity. Requirements and documents checklist.',
        url: 'https://legalwayfirm.com/work-permits-for-foreign-nationals-in-egypt/',
        badge: '📋 How-To Guide',
        badgeColor: 'bg-green-500/10 text-green-700 border-green-200',
      },
    ],
  },
  {
    category: '💼 Job Boards — Find Work in Egypt',
    items: [
      {
        title: 'Wuzzuf — Remote Jobs in Egypt (3,000+ listings)',
        desc: 'Egypt\'s #1 job platform. 3,000+ remote and on-site jobs updated daily. Filter by field, salary, and experience level.',
        url: 'https://wuzzuf.net/a/remote-Jobs-in-Egypt',
        badge: '🔍 Job Board',
        badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
      },
      {
        title: 'Bayt.com — Remote Jobs in Egypt',
        desc: 'Middle East\'s leading job site. 330+ remote jobs in Egypt updated weekly. Strong for multinational company roles.',
        url: 'https://www.bayt.com/en/egypt/jobs/remote-jobs/',
        badge: '🔍 Job Board',
        badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
      },
      {
        title: 'LinkedIn — Remote Jobs in Egypt (1,000+ roles)',
        desc: '1,000+ remote jobs in Egypt on LinkedIn. Includes international companies hiring Egypt-based workers. Updated daily.',
        url: 'https://www.linkedin.com/jobs/remote-jobs-egypt',
        badge: '🔍 Job Board',
        badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
      },
      {
        title: 'Working Nomads — Remote Egypt Jobs',
        desc: 'Curated list of fully remote jobs open to Egypt-based workers. Tech, marketing, writing, and customer support roles.',
        url: 'https://www.workingnomads.com/remote-egypt-jobs',
        badge: '🌍 Nomad Board',
        badgeColor: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
      },
    ],
  },
];

const STATIC_SPOTS = {
  'sharm-el-sheikh': [
    { name: 'Simba Café', type: 'cafe', location: 'Naama Bay', wifi_speed_mbps: 45, wifi_reliability: 'good', price_per_hour: 30, price_per_day: 150, power_outlets: true, ac: true, desc: 'Reliable WiFi, lots of power outlets. Popular with remote workers. Good coffee and food menu.' },
    { name: 'Costa Coffee Sharm Mall', type: 'cafe', location: 'Sharm El Sheikh City', wifi_speed_mbps: 30, wifi_reliability: 'good', price_per_hour: 40, price_per_day: 200, power_outlets: true, ac: true, desc: 'International chain standards. Consistent WiFi, comfortable seating. Order minimum one item per 2 hours.' },
    { name: 'Hayat Regency Business Center', type: 'coworking', location: 'Hadaba', wifi_speed_mbps: 80, wifi_reliability: 'excellent', price_per_hour: 80, price_per_day: 350, power_outlets: true, ac: true, desc: 'Full coworking facilities. Printing, meeting rooms, stable fiber internet. Day pass available.' },
  ],
  hurghada: [
    { name: 'The Workshop Coworking', type: 'coworking', location: 'Hurghada Marina', wifi_speed_mbps: 100, wifi_reliability: 'excellent', price_per_hour: 60, price_per_day: 280, power_outlets: true, ac: true, desc: 'Hurghada\'s best-equipped coworking space. Standing desks, fast fiber, meeting rooms. Mostly used by expats.' },
    { name: 'Cilantro Café', type: 'cafe', location: 'Sahl Hasheesh Road', wifi_speed_mbps: 35, wifi_reliability: 'good', price_per_hour: 35, price_per_day: 180, power_outlets: true, ac: true, desc: 'Egyptian chain café with reliable WiFi. Good working environment. Multiple locations.' },
    { name: 'Mövenpick Hotel Lobby', type: 'hotel_lobby', location: 'El Gouna area', wifi_speed_mbps: 60, wifi_reliability: 'excellent', price_per_hour: 100, price_per_day: 0, power_outlets: true, ac: true, desc: 'Hotel lobby with day pass for non-guests. Excellent WiFi, quiet, professional environment. Ask at reception.' },
    { name: 'Beachfront Café Azur', type: 'cafe', location: 'Makadi Bay', wifi_speed_mbps: 25, wifi_reliability: 'fair', price_per_hour: 20, price_per_day: 100, power_outlets: false, ac: false, desc: 'Work with a sea view. WiFi is adequate for emails and video calls. Not ideal for heavy tasks. Bring your own hotspot.' },
  ],
  luxor: [
    { name: 'Snack Time Café', type: 'cafe', location: 'East Bank, Corniche', wifi_speed_mbps: 20, wifi_reliability: 'fair', price_per_hour: 25, price_per_day: 120, power_outlets: true, ac: true, desc: 'Popular with archaeologists and long-stay tourists. Good enough for email and light work. Friendly owner.' },
    { name: 'Nefertiti Hotel Lobby', type: 'hotel_lobby', location: 'East Bank', wifi_speed_mbps: 40, wifi_reliability: 'good', price_per_hour: 0, price_per_day: 150, power_outlets: true, ac: true, desc: 'Day pass available. Quiet rooftop terrace with WiFi. Nile views. Popular with solo travelers.' },
  ],
  aswan: [
    { name: 'Panorama Café', type: 'cafe', location: 'Corniche', wifi_speed_mbps: 15, wifi_reliability: 'fair', price_per_hour: 20, price_per_day: 0, power_outlets: false, ac: false, desc: 'Open-air café on the Corniche. WiFi is basic but functional. Beautiful Nile views. Best for light tasks only.' },
    { name: 'Aswan Moon Hotel Lobby', type: 'hotel_lobby', location: 'Corniche', wifi_speed_mbps: 35, wifi_reliability: 'good', price_per_hour: 50, price_per_day: 200, power_outlets: true, ac: true, desc: 'Day pass for non-guests. Reliable WiFi and AC. Good for longer work sessions. Nile view terrace.' },
  ],
};

const TYPE_LABELS = { cafe: 'Café', coworking: 'Coworking', hotel_lobby: 'Hotel Lobby', library: 'Library' };

const WIFI_STYLES = {
  excellent: 'text-success bg-success/10',
  good: 'text-accent bg-accent/10',
  fair: 'text-amber-600 bg-amber-500/10',
  poor: 'text-red-500 bg-red-500/10',
};

export default function RemoteWork() {
  const [city, setCity] = useState('hurghada');

  useSEO({
    title: 'Remote Work in Egypt 2025 — Best Cafes, Coworking Spaces & WiFi Speeds',
    description: 'Work remotely from Egypt. Best cafes and coworking spaces in Sharm, Hurghada, Luxor and Aswan. WiFi speeds, prices, and practical advice for digital nomads.',
  });

  const { data: dbSpots = [] } = useQuery({
    queryKey: ['remote-work', city],
    queryFn: () => base44.entities.RemoteWorkSpot.filter({ city }, '-created_date', 20),
  });

  const staticSpots = STATIC_SPOTS[city] || [];
  const allSpots = [...staticSpots, ...dbSpots];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Laptop className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Remote Work in Egypt</h1>
          <p className="text-sm text-muted-foreground">Best cafes, coworking spaces & WiFi speeds — 2025</p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <Wifi className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-extrabold">15–100</p>
          <p className="text-[10px] text-muted-foreground">Mbps range</p>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-extrabold">20–100</p>
          <p className="text-[10px] text-muted-foreground">EGP/hour</p>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
          <Zap className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-lg font-extrabold">~€1</p>
          <p className="text-[10px] text-muted-foreground">per hour avg</p>
        </div>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground hover:border-accent/30'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Spots */}
      <div className="space-y-4 mb-10">
        {allSpots.map((spot, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{spot.name}</h3>
                  <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold">{TYPE_LABELS[spot.type]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{spot.location}</span>
                </div>
              </div>
              {spot.wifi_reliability && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${WIFI_STYLES[spot.wifi_reliability]}`}>
                  WiFi: {spot.wifi_reliability}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{spot.desc}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {spot.wifi_speed_mbps && (
                <div className="bg-secondary rounded-xl p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">WiFi Speed</p>
                  <p className="font-bold text-sm">{spot.wifi_speed_mbps} Mbps</p>
                </div>
              )}
              {spot.price_per_hour > 0 && (
                <div className="bg-secondary rounded-xl p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Per Hour</p>
                  <p className="font-bold text-sm">{spot.price_per_hour} EGP</p>
                </div>
              )}
              {spot.price_per_day > 0 && (
                <div className="bg-secondary rounded-xl p-2 text-center">
                  <p className="text-[10px] text-muted-foreground">Day Pass</p>
                  <p className="font-bold text-sm">{spot.price_per_day} EGP</p>
                </div>
              )}
              <div className="bg-secondary rounded-xl p-2 text-center">
                <p className="text-[10px] text-muted-foreground">Power / AC</p>
                <p className="font-bold text-sm">{spot.power_outlets ? '✓' : '✗'} / {spot.ac ? '✓' : '✗'}</p>
              </div>
            </div>
          </div>
        ))}

        {allSpots.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Laptop className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No spots listed yet for this city.</p>
          </div>
        )}
      </div>

      {/* SIM & data tips */}
      <h2 className="text-xl font-extrabold mb-4">SIM Cards & Mobile Data for Remote Work</h2>
      <div className="space-y-3 mb-10">
        {[
          { tip: 'Vodafone Egypt 15GB SIM: 130–160 EGP. Best coverage nationwide. Buy at official stores only.', icon: '📶' },
          { tip: 'Orange Egypt offers unlimited data plans for 200–300 EGP/month. Best for long stays.', icon: '📱' },
          { tip: 'Etisalat (now WE) has good 4G in cities. Consider as backup if Vodafone has issues.', icon: '📡' },
          { tip: 'A local hotspot backup is essential. Café WiFi is fine for most tasks, but critical calls should go through your SIM.', icon: '🔒' },
          { tip: 'VPN is recommended in Egypt. Some services may be throttled. ExpressVPN and NordVPN both work well.', icon: '🛡️' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
            <span className="text-lg">{item.icon}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
          </div>
        ))}
      </div>

      {/* Working in Egypt as a Foreigner */}
      <div className="flex items-center gap-3 mb-5 mt-4">
        <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold">Working in Egypt as a Foreigner</h2>
          <p className="text-xs text-muted-foreground">Official sources — updated directly by the issuing authorities</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>New law in effect since September 2025 (Labor Law No. 14/2025) + Decree 279 (December 2025).</strong> Foreign worker rules have changed significantly. Always verify with official sources below before making any decisions.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        {WORK_SOURCES.map((section, si) => (
          <div key={si}>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">{section.category}</h3>
            <div className="space-y-3">
              {section.items.map((item, ii) => (
                <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start gap-3 bg-card border border-border/50 rounded-2xl p-4 hover:border-accent/40 hover:shadow-sm transition-all block">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">{item.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5 truncate">{item.url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Long Stay Services in Egypt" description="Apartments, cleaning, internet setup for expats" to="/long-stay" />
        <SafeNextStep title="Real Costs of Living in Egypt" description="Budget for a remote working trip" to="/cost-calculator" />
      </div>
    </div>
  );
}