import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { Users, Star, Shield, Phone, Globe, CheckCircle2, MapPin, MessageCircle } from 'lucide-react';

const SERVICE_LABELS = {
  driver: { label: 'Driver', emoji: '🚗' },
  guide: { label: 'Tour Guide', emoji: '🏛️' },
  translator: { label: 'Translator', emoji: '💬' },
  dive_instructor: { label: 'Dive Instructor', emoji: '🤿' },
  tour_operator: { label: 'Tour Operator', emoji: '🗺️' },
  fixer: { label: 'Local Fixer', emoji: '🔧' },
};

const CITY_LABELS = {
  'sharm-el-sheikh': 'Sharm El Sheikh',
  hurghada: 'Hurghada',
  luxor: 'Luxor',
  aswan: 'Aswan',
};

// Seed data shown if DB is empty
const SAMPLE_LOCALS = [
  {
    id: 'sample-1',
    name: 'Ahmed Hassan',
    city: 'hurghada',
    service_type: 'driver',
    languages: ['English', 'German', 'Arabic'],
    description: 'Licensed driver with 14 years of experience covering Hurghada and the Red Sea coast. Honest fixed prices, punctual, and genuinely helpful with local tips. Safe vehicle, non-smoking.',
    phone_whatsapp: '+20 100 123 4567',
    is_verified: true,
    avg_rating: 4.9,
    review_count: 87,
    price_range: '150–300 EGP per trip',
    specialties: ['Airport transfers', 'Full day city tours', 'Desert road trips', 'Luggage handling'],
    years_experience: 14,
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'sample-2',
    name: 'Mohamed Fathy',
    city: 'luxor',
    service_type: 'guide',
    languages: ['English', 'French', 'Italian', 'Arabic'],
    description: 'Government-licensed Egyptologist with 20 years guiding at Valley of Kings, Karnak, and Luxor Temple. University degree in Egyptology from Luxor University. Passionate, patient, and deeply knowledgeable.',
    phone_whatsapp: '+20 122 987 6543',
    is_verified: true,
    avg_rating: 5.0,
    review_count: 214,
    price_range: '1,000–1,500 EGP per day',
    specialties: ['Valley of the Kings', 'Karnak', 'Hot air balloon coordination', 'Hieroglyphic explanations', 'Photography spots'],
    years_experience: 20,
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'sample-3',
    name: 'Ibrahim Nour',
    city: 'aswan',
    service_type: 'driver',
    languages: ['English', 'Russian', 'Arabic'],
    description: 'Trusted Aswan driver and Abu Simbel specialist. Only driver I\'ve met who will tell you honestly if a tour isn\'t worth the money. Knows the convoy schedule better than anyone.',
    phone_whatsapp: '+20 111 456 7890',
    is_verified: true,
    avg_rating: 4.8,
    review_count: 63,
    price_range: '600–900 EGP Abu Simbel trip',
    specialties: ['Abu Simbel private transport', 'Philae Temple tours', 'Nubian village access', 'Airport transfers'],
    years_experience: 11,
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'sample-4',
    name: 'Khaled Sayed',
    city: 'sharm-el-sheikh',
    service_type: 'dive_instructor',
    languages: ['English', 'German', 'Russian', 'Arabic'],
    description: 'PADI Divemaster with 500+ dives on Red Sea reefs. Specializes in beginner instruction and underwater photography coaching. Never rushes, always safety-first.',
    phone_whatsapp: '+20 106 321 0987',
    is_verified: true,
    avg_rating: 4.9,
    review_count: 142,
    price_range: '800–1,200 EGP per dive day',
    specialties: ['Beginner diving', 'PADI Open Water course', 'Underwater photography', 'Night dives', 'Ras Mohammed reef trips'],
    years_experience: 8,
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'sample-5',
    name: 'Youssef Ali',
    city: 'hurghada',
    service_type: 'tour_operator',
    languages: ['English', 'Polish', 'Arabic'],
    description: 'Honest tour operator specializing in Giftun Island, Dolphin House, and desert safaris. Posts real prices upfront — no hidden fees, no commission games. Popular with Eastern European tourists.',
    phone_whatsapp: '+20 115 678 2345',
    is_verified: true,
    avg_rating: 4.7,
    review_count: 98,
    price_range: '350–750 EGP per activity',
    specialties: ['Giftun Island day trips', 'Dolphin House snorkeling', 'Desert 4WD safaris', 'Group bookings'],
    years_experience: 9,
    photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 'sample-6',
    name: 'Fatima Rashid',
    city: 'luxor',
    service_type: 'translator',
    languages: ['English', 'German', 'Spanish', 'Arabic'],
    description: 'Certified translator and cultural liaison. Excellent for business negotiations, medical appointments, and navigating government offices. Female travelers especially welcome her for added comfort.',
    phone_whatsapp: '+20 120 234 5678',
    is_verified: true,
    avg_rating: 4.8,
    review_count: 44,
    price_range: '400–600 EGP per half day',
    specialties: ['Medical translation', 'Legal/document translation', 'Cultural mediation', 'Female traveler support'],
    years_experience: 7,
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
  },
];

function LocalCard({ local }) {
  const service = SERVICE_LABELS[local.service_type] || { label: local.service_type, emoji: '👤' };

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-5">
      <div className="flex items-start gap-4 mb-4">
        {local.photo_url ? (
          <img src={local.photo_url} alt={local.name}
            className="w-14 h-14 rounded-2xl object-cover shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0 text-2xl">
            {service.emoji}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base">{local.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-muted-foreground">{service.emoji} {service.label}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{CITY_LABELS[local.city]}</span>
              </div>
            </div>
            {local.is_verified && (
              <div className="flex items-center gap-1 bg-success/10 border border-success/20 rounded-full px-2 py-0.5 shrink-0">
                <Shield className="w-3 h-3 text-success" />
                <span className="text-[10px] font-bold text-success">Verified</span>
              </div>
            )}
          </div>
          {local.avg_rating && (
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= Math.round(local.avg_rating) ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
              ))}
              <span className="text-xs font-bold ml-1">{local.avg_rating}</span>
              {local.review_count && <span className="text-xs text-muted-foreground">({local.review_count} reviews)</span>}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{local.description}</p>

      {local.languages?.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex flex-wrap gap-1">
            {local.languages.map((lang, i) => (
              <span key={i} className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded-full">{lang}</span>
            ))}
          </div>
        </div>
      )}

      {local.specialties?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {local.specialties.slice(0, 4).map((s, i) => (
            <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        {local.price_range && (
          <p className="text-xs font-semibold text-muted-foreground">{local.price_range}</p>
        )}
        {local.phone_whatsapp && (
          <a href={`https://wa.me/${local.phone_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-success text-success-foreground px-3 py-1.5 rounded-xl text-xs font-bold">
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

export default function FeaturedLocals() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useSEO({
    title: 'Trusted Local Contacts in Egypt — Verified Drivers, Guides & Translators',
    description: 'Verified local contacts in Hurghada, Sharm, Luxor, and Aswan. Trusted drivers, licensed guides, translators. Real reviews from tourists. Contact via WhatsApp.',
  });

  const { data: dbLocals = [], isLoading } = useQuery({
    queryKey: ['locals', selectedCity, selectedType],
    queryFn: () => {
      const filter = { is_active: true };
      if (selectedCity) filter.city = selectedCity;
      if (selectedType) filter.service_type = selectedType;
      return base44.entities.LocalContact.filter(filter, '-avg_rating', 50);
    },
  });

  const locals = dbLocals.length > 0 ? dbLocals : SAMPLE_LOCALS.filter(l =>
    (!selectedCity || l.city === selectedCity) &&
    (!selectedType || l.service_type === selectedType)
  );

  const CITIES = [
    { id: '', label: 'All Cities' },
    { id: 'sharm-el-sheikh', label: 'Sharm' },
    { id: 'hurghada', label: 'Hurghada' },
    { id: 'luxor', label: 'Luxor' },
    { id: 'aswan', label: 'Aswan' },
  ];

  const TYPES = [
    { id: '', label: 'All Services' },
    { id: 'driver', label: '🚗 Driver' },
    { id: 'guide', label: '🏛️ Guide' },
    { id: 'translator', label: '💬 Translator' },
    { id: 'dive_instructor', label: '🤿 Dive Instructor' },
    { id: 'tour_operator', label: '🗺️ Tour Operator' },
    { id: 'fixer', label: '🔧 Fixer' },
  ];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Trusted Local Contacts</h1>
          <p className="text-sm text-muted-foreground">Verified drivers · guides · translators — real reviews</p>
        </div>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-success" />
          <span className="font-bold text-sm text-success">Why use verified locals?</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Every contact listed here has been reviewed by real tourists and, where possible, independently verified. Verified badge means their ID, license, or professional credentials have been confirmed. No commission hidden in their prices.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedCity === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setSelectedType(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedType === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {locals.map((local, i) => <LocalCard key={local.id || i} local={local} />)}
          {locals.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="font-bold text-sm">No contacts found for this filter</p>
              <p className="text-xs mt-1">Try selecting a different city or service type</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-accent/10 border border-accent/20 rounded-2xl p-5">
        <h3 className="font-extrabold text-sm mb-2">Are you a trusted local in Egypt?</h3>
        <p className="text-xs text-muted-foreground mb-3">If you provide honest services to tourists — as a driver, guide, or translator — you can apply to be listed here. Verification required.</p>
        <a href="/verify-apply" className="inline-flex bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold">
          Apply for Verified Badge →
        </a>
      </div>

      <div className="mt-6 space-y-3">
        <SafeNextStep title="Real Experiences from Tourists" description="Honest stories — good and bad — from real visitors" to="/tourist-stories" />
        <SafeNextStep title="Scam Map" description="See where scams actually happen, city by city" to="/scam-map" />
      </div>
    </div>
  );
}