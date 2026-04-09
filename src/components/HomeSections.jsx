import { Link } from 'react-router-dom';
import {
  Bot, DollarSign, Calculator, ShieldCheck, LayoutGrid,
  Phone, ShieldAlert, AlertTriangle, Car, Home, Wifi, Utensils,
  Waves, Baby, Music, ShoppingBag, Star, Radio, TrendingUp,
  CheckSquare, Pill, Hotel, Calendar, MessageSquare, Heart, Users, Package, Building2, Anchor, Sailboat
} from 'lucide-react';

const SECTIONS = [
  {
    group: 'Essential Tools',
    groupAr: 'الأدوات الأساسية',
    groupRu: 'Основные инструменты',
    groupDe: 'Wichtige Tools',
    groupFr: 'Outils essentiels',
    groupIt: 'Strumenti essenziali',
    groupEs: 'Herramientas esenciales',
    groupZh: '基本工具',
    color: 'text-accent',
    items: [
      { label: 'Services Directory', labelRu: 'Каталог услуг', labelDe: 'Dienste', icon: LayoutGrid, path: '/services', color: 'bg-blue-500/10 text-blue-500' },
      { label: 'Cost Calculator', labelRu: 'Калькулятор', labelDe: 'Kostenrechner', icon: Calculator, path: '/cost-calculator', color: 'bg-emerald-500/10 text-emerald-600' },
      { label: 'Real Prices', labelRu: 'Реальные цены', labelDe: 'Echte Preise', icon: DollarSign, path: '/price-checker', color: 'bg-accent/10 text-accent' },
      { label: 'Smart AI Guide', labelRu: 'AI Гид', labelDe: 'AI Guide', icon: Bot, path: '/ai-assistant', color: 'bg-violet-500/10 text-violet-500', isAI: true },
      { label: 'Deals & Offers', labelRu: 'Скидки', labelDe: 'Angebote', labelFr: 'Offres', icon: Star, path: '/deals', color: 'bg-amber-500/10 text-amber-600' },
      { label: 'Book a Tour', labelRu: 'Забронировать', labelDe: 'Tour buchen', labelFr: 'Réserver', icon: Calendar, path: '/book', color: 'bg-green-500/10 text-green-600' },
      { label: 'Hotels', labelRu: 'Отели', labelDe: 'Hotels buchen', labelFr: 'Hôtels', icon: Building2, path: '/hotels', color: 'bg-blue-500/10 text-blue-600' },
    ],
  },
  {
    group: 'Safety & Security',
    groupAr: 'السلامة والأمان',
    groupRu: 'Безопасность',
    groupDe: 'Sicherheit',
    color: 'text-red-500',
    items: [
      { label: "Women's Safety", labelRu: 'Безопасность женщин', labelDe: 'Frauensicherheit', icon: ShieldAlert, path: '/women-safety', color: 'bg-pink-500/10 text-pink-500' },
      { label: 'Emergency & SOS', labelRu: 'Экстренная помощь', labelDe: 'Notfall & SOS', icon: Phone, path: '/emergency', color: 'bg-red-500/10 text-red-500' },
      { label: 'Scam Alerts', labelRu: 'Предупреждения', labelDe: 'Betrugs-Warnungen', icon: AlertTriangle, path: '/scam-map', color: 'bg-orange-500/10 text-orange-500' },
      { label: 'Is Egypt Safe?', labelRu: 'Безопасен ли Египет?', labelDe: 'Ist Ägypten sicher?', icon: ShieldCheck, path: '/egypt-safe-now', color: 'bg-success/10 text-success' },
      { label: 'Health & Hygiene', labelRu: 'Здоровье', labelDe: 'Gesundheit', icon: Heart, path: '/services?category=medical', color: 'bg-rose-500/10 text-rose-500' },
      { label: 'Pharmacies', labelRu: 'Аптеки', labelDe: 'Apotheken', icon: Pill, path: '/services?category=medical', color: 'bg-cyan-500/10 text-cyan-600' },
    ],
  },
  {
    group: 'Transport & Stay',
    groupAr: 'المواصلات والإقامة',
    groupRu: 'Транспорт и проживание',
    groupDe: 'Transport & Unterkunft',
    color: 'text-blue-500',
    items: [
      { label: 'Locali Ride', labelRu: 'Locali Ride', labelDe: 'Locali Ride', icon: Car, path: '/locali-ride', color: 'bg-accent/10 text-accent' },
      { label: 'Private Drivers', labelRu: 'Частные водители', labelDe: 'Privatfahrer', labelFr: 'Chauffeurs privés', icon: ShieldCheck, path: '/verified-drivers', color: 'bg-success/10 text-success' },
      { label: 'Long Stay', labelRu: 'Долгосрочное', labelDe: 'Langzeitaufenthalt', icon: Home, path: '/long-stay', color: 'bg-indigo-500/10 text-indigo-500' },
      { label: 'SIM Cards', labelRu: 'SIM-карты', labelDe: 'SIM-Karten', icon: Wifi, path: '/sim-cards', color: 'bg-teal-500/10 text-teal-500' },
      { label: 'Hotels', labelRu: 'Отели', labelDe: 'Hotels', icon: Hotel, path: '/services?category=long_stay', color: 'bg-slate-500/10 text-slate-500' },
      { label: 'Visa & Entry', labelRu: 'Виза и въезд', labelDe: 'Visum & Einreise', icon: CheckSquare, path: '/visa-entry', color: 'bg-purple-500/10 text-purple-500' },
      { label: 'Before You Land', labelRu: 'Перед прилётом', labelDe: 'Vor der Landung', icon: CheckSquare, path: '/before-you-land', color: 'bg-sky-500/10 text-sky-500' },
    ],
  },
  {
    group: 'Food, Fun & Activities',
    groupAr: 'الأكل والترفيه',
    groupRu: 'Еда, развлечения и активности',
    groupDe: 'Essen, Spaß & Aktivitäten',
    color: 'text-amber-500',
    items: [
      { label: 'Restaurants', labelRu: 'Рестораны', labelDe: 'Restaurants', icon: Utensils, path: '/services?category=restaurant', color: 'bg-orange-500/10 text-orange-500' },
      { label: 'Activities', labelRu: 'Активности', labelDe: 'Aktivitäten', icon: Waves, path: '/services?category=activities', color: 'bg-cyan-500/10 text-cyan-500' },
      { label: 'Kids & Family', labelRu: 'Дети и семья', labelDe: 'Familie', icon: Baby, path: '/services?category=kids_family', color: 'bg-yellow-500/10 text-yellow-600' },
      { label: 'Nightlife', labelRu: 'Ночная жизнь', labelDe: 'Nachtleben', icon: Music, path: '/nightlife', color: 'bg-purple-500/10 text-purple-500' },
      { label: 'Boat Trips', labelRu: 'Морские прогулки', labelDe: 'Bootstouren', labelFr: 'Excursions en bateau', labelAr: 'رحلات بحرية', icon: Anchor, path: '/boat-trips', color: 'bg-blue-500/10 text-blue-600' },
      { label: 'Horse Riding', labelRu: 'Верховая езда', labelDe: 'Reiten', labelFr: 'Équitation', labelAr: 'ركوب الخيل', icon: Waves, path: '/horse-riding', color: 'bg-amber-500/10 text-amber-700' },
      { label: 'Temple Trips', labelRu: 'Храмы и туры', labelDe: 'Tempel & Touren', labelFr: 'Temples & Tours', labelAr: 'رحلات المعابد', icon: Anchor, path: '/temple-trips', color: 'bg-orange-500/10 text-orange-700' },
      { label: 'Shopping', labelRu: 'Шоппинг', labelDe: 'Shopping', icon: ShoppingBag, path: '/services?category=other', color: 'bg-pink-500/10 text-pink-500' },
      { label: 'Local Contacts', labelRu: 'Местные гиды', labelDe: 'Lokale Kontakte', icon: Users, path: '/featured-locals', color: 'bg-amber-500/10 text-amber-600' },
    ],
  },
  {
    group: 'Live Info & Updates',
    groupAr: 'معلومات مباشرة',
    groupRu: 'Актуальная информация',
    groupDe: 'Live-Infos',
    color: 'text-success',
    items: [
      { label: 'Live Situation', labelRu: 'Живая ситуация', labelDe: 'Live-Lage', icon: Radio, path: '/live-situation', color: 'bg-success/10 text-success' },
      { label: 'Arabic Phrases', labelRu: 'Арабские фразы', labelDe: 'Arabische Phrasen', icon: MessageSquare, path: '/phrases', color: 'bg-teal-500/10 text-teal-500' },
      { label: 'Tourist Stories', labelRu: 'Истории туристов', labelDe: 'Reiseberichte', icon: Star, path: '/tourist-stories', color: 'bg-amber-500/10 text-amber-500' },
      { label: 'Remote Work', labelRu: 'Удалённая работа', labelDe: 'Remote-Arbeit', icon: Wifi, path: '/remote-work', color: 'bg-indigo-500/10 text-indigo-500' },
      { label: 'Egypt vs Dubai', labelRu: 'Египет vs Дубай', labelDe: 'Ägypten vs Dubai', icon: TrendingUp, path: '/egypt-vs-dubai', color: 'bg-sky-500/10 text-sky-500' },
      { label: 'Trip Decision', labelRu: 'Выбор поездки', labelDe: 'Reiseentscheidung', labelFr: 'Décision voyage', icon: CheckSquare, path: '/trip-decision', color: 'bg-violet-500/10 text-violet-500' },
      { label: 'Smart Guide', labelRu: 'Умный гид', labelDe: 'Smart Guide', labelFr: 'Guide intelligent', icon: Bot, path: '/smart-guide', color: 'bg-violet-500/10 text-violet-600' },
      { label: 'Ask a Local', labelRu: 'Спросить местного', labelDe: 'Einen Einwohner fragen', labelFr: 'Demander à un local', icon: MessageSquare, path: '/ask-a-local', color: 'bg-teal-500/10 text-teal-600' },
      { label: 'Arab Tourists', labelRu: 'Арабским туристам', labelDe: 'Arabische Touristen', labelFr: 'Touristes arabes', icon: Users, path: '/arab-tourists', color: 'bg-green-500/10 text-green-600' },
    ],
  },
  {
    group: 'New Features',
    groupAr: 'ميزات جديدة',
    groupRu: 'Новые функции',
    groupDe: 'Neue Features',
    groupFr: 'Nouvelles fonctions',
    color: 'text-violet-500',
    items: [
      { label: 'Safety Guide', labelRu: 'Безопасность', labelDe: 'Sicherheit', labelFr: 'Sécurité', icon: ShieldCheck, path: '/safety-guide', color: 'bg-success/10 text-success' },
      { label: 'Beaches', labelRu: 'Пляжи', labelDe: 'Strände', labelFr: 'Plages', icon: Waves, path: '/beaches', color: 'bg-blue-500/10 text-blue-500' },
      { label: 'Airport Items', labelRu: 'Таможня', labelDe: 'Zoll & Gepäck', labelFr: 'Douane', icon: Package, path: '/airport-items', color: 'bg-amber-500/10 text-amber-500' },
      { label: 'Book a Tour', labelRu: 'Туры', labelDe: 'Tours buchen', labelFr: 'Réserver', icon: Calendar, path: '/book', color: 'bg-green-500/10 text-green-600' },
      { label: 'Bazaars', labelRu: 'Базары', labelDe: 'Basare', labelFr: 'Bazars', icon: ShoppingBag, path: '/bazaars', color: 'bg-orange-500/10 text-orange-600' },
      { label: 'Guides', labelRu: 'Гиды', labelDe: 'Reiseführer', labelFr: 'Guides', icon: Users, path: '/guides', color: 'bg-blue-500/10 text-blue-600' },
      { label: 'About', labelRu: 'О нас', labelDe: 'Über uns', labelFr: 'À propos', icon: CheckSquare, path: '/about', color: 'bg-gray-500/10 text-gray-500' },
      { label: 'Tour Operators', labelRu: 'Туроператоры', labelDe: 'Reiseveranstalter', labelFr: 'Voyagistes', icon: Building2, path: '/tour-operators', color: 'bg-indigo-500/10 text-indigo-600' },
      { label: 'By Nationality', labelRu: 'По национальности', labelDe: 'Nach Nationalität', labelFr: 'Par nationalité', icon: Users, path: '/nationality-guide', color: 'bg-rose-500/10 text-rose-500' },
      { label: 'Tourist Villages', labelRu: 'Курорты', labelDe: 'Ferienorte', labelFr: 'Villages touristiques', icon: Waves, path: '/tourist-villages', color: 'bg-cyan-500/10 text-cyan-600' },
      { label: 'Analytics', labelRu: 'Аналитика', labelDe: 'Analytik', labelFr: 'Analytique', icon: TrendingUp, path: '/analytics', color: 'bg-slate-500/10 text-slate-500' },
      { label: 'Terms', labelRu: 'Условия', labelDe: 'AGB', labelFr: 'CGU', icon: CheckSquare, path: '/terms', color: 'bg-gray-500/10 text-gray-500' },
    ],
  },
];

function getLabel(item, lang) {
  if (lang === 'ru') return item.labelRu || item.label;
  if (lang === 'de') return item.labelDe || item.label;
  if (lang === 'fr') return item.labelFr || item.label;
  if (lang === 'it') return item.labelIt || item.label;
  if (lang === 'es') return item.labelEs || item.label;
  if (lang === 'zh') return item.labelZh || item.label;
  return item.label;
}

function getGroupLabel(section, lang) {
  if (lang === 'ru') return section.groupRu || section.group;
  if (lang === 'de') return section.groupDe || section.group;
  if (lang === 'fr') return section.groupFr || section.group;
  if (lang === 'it') return section.groupIt || section.group;
  if (lang === 'es') return section.groupEs || section.group;
  if (lang === 'zh') return section.groupZh || section.group;
  return section.group;
}

export default function HomeSections({ lang }) {
  return (
    <div className="space-y-8">
      {SECTIONS.map((section) => (
        <div key={section.group}>
          <h2 className={`text-xs font-extrabold uppercase tracking-widest mb-3 ${section.color}`}>
            {getGroupLabel(section, lang)}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  className="flex flex-col items-center gap-2.5 group"
                >
                  <div
                    className={`relative flex items-center justify-center transition-all duration-200 group-hover:scale-125 group-active:scale-90 ${item.isAI ? 'ring-2 ring-violet-400/60 rounded-3xl' : ''}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7" strokeWidth={2.2} />
                    </div>
                    {item.isAI && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center text-[8px] text-white font-black">✦</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-center text-foreground leading-tight max-w-[60px]">
                    {getLabel(item, lang)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}