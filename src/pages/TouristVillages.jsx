import { useState } from 'react';
import { useSEO } from '../lib/seo';
import { MapPin, Star, Waves, Phone, ExternalLink, ShieldCheck, DollarSign, Sun, Wifi, Baby, Search } from 'lucide-react';

const VILLAGES = [
  // ─── Hurghada Region ───────────────────────────────────────────────
  {
    id: 'el-gouna',
    name: 'El Gouna',
    nameAr: 'الجونة',
    city: 'hurghada',
    region: 'البحر الأحمر',
    type: 'resort_town',
    typeLabel: 'مدينة سياحية متكاملة',
    description: 'مدينة سياحية فاخرة مستقلة تماماً تبعد 22 كم شمال الغردقة. صممها أبوالعينين ولها قنوات مائية داخلية وبحيرات ومارينا. تُعتبر الأفضل في مصر للكيت سيرف والغوص.',
    distance: '22 كم شمال الغردقة',
    address: 'طريق الغردقة – الغردقة، البحر الأحمر',
    google_maps: 'https://maps.google.com/?q=El+Gouna+Hurghada+Egypt',
    coords: { lat: 27.3867, lng: 33.6753 },
    rating: 4.9,
    price_range: 'premium',
    beach_quality: 5,
    diving: true,
    kite_surf: true,
    family_friendly: true,
    nightlife: true,
    remote_work: true,
    hotels: ['Sheraton Miramar', 'Steigenberger Golf Resort', 'Three Corners Rihana Inn', 'Movenpick Resort'],
    best_for: ['كيت سيرف', 'غوص', 'حياة ليلية', 'عمل عن بعد', 'عائلات'],
    avg_hotel_egp: '3,000–15,000',
    highlights: [
      'قنوات مائية داخلية وبحيرات خاصة',
      'مارينا فاخرة ويخوت خاصة',
      'مستشفى دولي وخدمات راقية',
      'مطار خاص (GMB)',
      'محمية طبيعية — شعاب مرجانية محمية',
    ],
    image_url: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600&q=80',
  },
  {
    id: 'sahl-hasheesh',
    name: 'سهل حشيش',
    nameAr: 'سهل حشيش',
    city: 'hurghada',
    region: 'البحر الأحمر',
    type: 'resort_village',
    typeLabel: 'قرية سياحية راقية',
    description: 'قرية سياحية فاخرة تبعد 18 كم جنوب الغردقة. تمتد على شاطئ رملي طبيعي نقي. تضم فنادق 5 نجوم وفيلات خاصة وكورنيش تجاري.',
    distance: '18 كم جنوب الغردقة',
    address: 'طريق الغردقة–الغردقة الجنوبية، البحر الأحمر',
    google_maps: 'https://maps.google.com/?q=Sahl+Hasheesh+Hurghada+Egypt',
    coords: { lat: 27.1167, lng: 33.9167 },
    rating: 4.8,
    price_range: 'luxury',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Oberoi Sahl Hasheesh', 'Rixos Premium', 'Baron Palace', 'Jaz Grand Marsa'],
    best_for: ['شهر العسل', 'راحة وهدوء', 'غوص', 'عائلات'],
    avg_hotel_egp: '4,000–18,000',
    highlights: [
      'شاطئ رملي طبيعي خاص نادر في المنطقة',
      'فيلات فاخرة مع بحيرات سباحة خاصة',
      'كورنيش تجاري داخلي',
      'أهدأ من الغردقة وأقل ازدحاماً',
    ],
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  },
  {
    id: 'makadi-bay',
    name: 'مكادي باي',
    nameAr: 'مكادي باي',
    city: 'hurghada',
    region: 'البحر الأحمر',
    type: 'resort_village',
    typeLabel: 'قرية سياحية هادئة',
    description: 'قرية سياحية هادئة وفاخرة تبعد 30 كم جنوب الغردقة. مشهورة بالهدوء التام والشعاب المرجانية الرائعة مباشرة من الشاطئ.',
    distance: '30 كم جنوب الغردقة',
    address: 'طريق الغردقة–الغردقة الجنوبية، البحر الأحمر',
    google_maps: 'https://maps.google.com/?q=Makadi+Bay+Hurghada+Egypt',
    coords: { lat: 26.9667, lng: 33.9833 },
    rating: 4.7,
    price_range: 'premium',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Hyatt Ziva Makadi Bay', 'Iberotel Palace', 'Jaz Makadina', 'Aldiana Club Makadi'],
    best_for: ['شهر العسل', 'راحة وهدوء', 'غطس من الشاطئ مباشرة', 'عائلات'],
    avg_hotel_egp: '3,500–16,000',
    highlights: [
      'شعاب مرجانية تبدأ من الشاطئ مباشرة',
      'لا ضجيج — هادئة ومعزولة',
      'رياضات مائية متكاملة',
      'مناسبة جداً للأزواج',
    ],
    image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
  },
  {
    id: 'soma-bay',
    name: 'سوما باي',
    nameAr: 'سوما باي',
    city: 'hurghada',
    region: 'البحر الأحمر',
    type: 'resort_village',
    typeLabel: 'قرية سياحية متميزة',
    description: 'شبه جزيرة سياحية مستقلة تبعد 45 كم جنوب الغردقة. تمتد على 10 كم² وتضم ملاعب جولف وسبا عالمي ورياضات مائية.',
    distance: '45 كم جنوب الغردقة',
    address: 'سوما باي، البحر الأحمر',
    google_maps: 'https://maps.google.com/?q=Soma+Bay+Hurghada+Egypt',
    coords: { lat: 26.8667, lng: 34.0333 },
    rating: 4.8,
    price_range: 'luxury',
    beach_quality: 5,
    diving: true,
    kite_surf: true,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Robinson Club', 'Breakers Soma Bay', 'Kempinski Hotel Soma Bay', 'Sheraton Soma Bay'],
    best_for: ['جولف', 'سبا وعلاج', 'كيت سيرف', 'شهر العسل'],
    avg_hotel_egp: '4,000–20,000',
    highlights: [
      'ملعب جولف دولي 18 حفرة',
      'سبا "The Cascades" الأفضل في مصر',
      'شبه جزيرة معزولة — خصوصية تامة',
      'مركز كيت سيرف رسمي',
    ],
    image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
  },

  // ─── Marsa Alam Region ─────────────────────────────────────────────
  {
    id: 'marsa-alam',
    name: 'مرسى علم',
    nameAr: 'مرسى علم',
    city: 'marsa-alam',
    region: 'البحر الأحمر الجنوبي',
    type: 'resort_town',
    typeLabel: 'مدينة سياحية صاعدة',
    description: 'وجهة سياحية صاعدة في جنوب البحر الأحمر تبعد 220 كم جنوب الغردقة. تشتهر بأفضل مواقع الغوص في مصر وأهدأ شعاب مرجانية في العالم.',
    distance: '220 كم جنوب الغردقة',
    address: 'طريق الغردقة–مرسى علم، البحر الأحمر',
    google_maps: 'https://maps.google.com/?q=Marsa+Alam+Egypt',
    coords: { lat: 25.0667, lng: 34.8833 },
    rating: 4.8,
    price_range: 'moderate',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: false,
    nightlife: false,
    remote_work: false,
    hotels: ['Shams Alam Beach Resort', 'Brayka Bay Resort', 'Lahami Bay Resort', 'Desert Rose Resort'],
    best_for: ['غوص عالمي المستوى', 'مشاهدة الأخليات', 'هدوء وطبيعة', 'سفاري سباحة'],
    avg_hotel_egp: '2,000–9,000',
    highlights: [
      'أفضل مواقع مشاهدة الأخليات (Dugong) في العالم',
      'شعاب مرجانية بكر لم تتأثر بالسياحة الكثيفة',
      'مطار دولي (RMF)',
      'رؤية تحت الماء أوضح من الغردقة وشرم',
    ],
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  },
  {
    id: 'hamata',
    name: 'حماطة',
    nameAr: 'حماطة',
    city: 'marsa-alam',
    region: 'البحر الأحمر الجنوبي',
    type: 'eco_village',
    typeLabel: 'قرية بيئية هادئة',
    description: 'قرية بيئية صغيرة في أقصى جنوب البحر الأحمر المصري. للغواصين المحترفين وعشاق الطبيعة البكر.',
    distance: '350 كم جنوب الغردقة',
    address: 'حماطة، البحر الأحمر الجنوبي',
    google_maps: 'https://maps.google.com/?q=Hamata+Egypt',
    coords: { lat: 23.95, lng: 35.65 },
    rating: 4.7,
    price_range: 'budget',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: false,
    nightlife: false,
    remote_work: false,
    hotels: ['Hamata Diving Village', 'Lahami Bay (قريب)'],
    best_for: ['غوص بكر', 'عزلة وهدوء', 'طبيعة خام'],
    avg_hotel_egp: '800–3,000',
    highlights: ['شعاب مرجانية لا يُصدق', 'تقريباً بدون سياحة كثيفة', 'جزر دهلك القريبة'],
    image_url: 'https://images.unsplash.com/photo-1682687218904-be316a0e6de3?w=600&q=80',
  },

  // ─── Sharm El Sheikh Region ────────────────────────────────────────
  {
    id: 'naama-bay',
    name: 'نعمة باي',
    nameAr: 'نعمة باي',
    city: 'sharm-el-sheikh',
    region: 'جنوب سيناء',
    type: 'resort_district',
    typeLabel: 'قلب شرم الشيخ السياحي',
    description: 'الحي السياحي الأشهر في شرم الشيخ. الكورنيش الرئيسي به أكبر تجمع للمطاعم والنوادي الليلية والمتاجر ومراكز الغوص في سيناء.',
    distance: 'مركز شرم الشيخ',
    address: 'نعمة باي، شرم الشيخ، جنوب سيناء',
    google_maps: 'https://maps.google.com/?q=Naama+Bay+Sharm+El+Sheikh+Egypt',
    coords: { lat: 27.9105, lng: 34.3295 },
    rating: 4.6,
    price_range: 'moderate',
    beach_quality: 4,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: true,
    remote_work: true,
    hotels: ['Hyatt Regency Sharm', 'Hilton Sharm Dreams', 'Le Méridien Villas', 'Ibis Styles'],
    best_for: ['حياة ليلية', 'غوص', 'تسوق', 'مطاعم متنوعة'],
    avg_hotel_egp: '2,500–12,000',
    highlights: [
      'أشهر كورنيش في شرم الشيخ',
      'عشرات مراكز الغوص المعتمدة',
      'مطاعم دولية متنوعة',
      'حياة ليلية نشطة',
    ],
    image_url: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=600&q=80',
  },
  {
    id: 'nabq',
    name: 'نبق',
    nameAr: 'نبق',
    city: 'sharm-el-sheikh',
    region: 'جنوب سيناء',
    type: 'resort_village',
    typeLabel: 'قرية سياحية هادئة',
    description: 'قرية سياحية هادئة شمال شرم الشيخ. تقع بجوار محمية نبق الطبيعية وتتميز بشواطئ خاصة وأجواء عائلية هادئة بعيداً عن صخب نعمة باي.',
    distance: '18 كم شمال شرم الشيخ',
    address: 'نبق، شرم الشيخ، جنوب سيناء',
    google_maps: 'https://maps.google.com/?q=Nabq+Bay+Sharm+El+Sheikh+Egypt',
    coords: { lat: 28.0333, lng: 34.4167 },
    rating: 4.5,
    price_range: 'moderate',
    beach_quality: 4,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Coral Sea Aqua Club', 'Maritim Jolie Ville', 'Tropitel Naama Bay', 'Blue Reef Resort'],
    best_for: ['عائلات', 'هدوء', 'مشي طبيعي', 'شنورك'],
    avg_hotel_egp: '2,000–8,000',
    highlights: [
      'بجوار محمية نبق الطبيعية',
      'شاطئ غابات المانغروف النادرة',
      'أسعار أقل من نعمة باي',
    ],
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  },
  {
    id: 'sharks-bay',
    name: 'خليج الحوت',
    nameAr: 'خليج الحوت (Sharks Bay)',
    city: 'sharm-el-sheikh',
    region: 'جنوب سيناء',
    type: 'resort_village',
    typeLabel: 'قرية غوص هادئة',
    description: 'خليج صغير هادئ بين نعمة باي والمطار. مشهور بين الغواصين بجماله الطبيعي وهدوئه التام. مناسب من يريد هدوء مع قرب من كل شيء.',
    distance: '5 كم جنوب نعمة باي',
    address: 'خليج الحوت، شرم الشيخ، جنوب سيناء',
    google_maps: 'https://maps.google.com/?q=Sharks+Bay+Sharm+El+Sheikh+Egypt',
    coords: { lat: 27.8667, lng: 34.3 },
    rating: 4.6,
    price_range: 'moderate',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: false,
    nightlife: false,
    remote_work: false,
    hotels: ['Sharks Bay Umbi Diving Village', 'Sol Sharm Hotel'],
    best_for: ['غوص', 'هدوء', 'شنورك مباشر من الشاطئ'],
    avg_hotel_egp: '1,500–6,000',
    highlights: ['شعاب مرجانية مباشرة من الشاطئ', 'هادئ وبعيد عن صخب نعمة باي', 'مناسب للغواصين المحترفين'],
    image_url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&q=80',
  },
  {
    id: 'dahab',
    name: 'دهب',
    nameAr: 'دهب',
    city: 'sharm-el-sheikh',
    region: 'جنوب سيناء',
    type: 'beach_village',
    typeLabel: 'قرية شاطئية كاجوال',
    description: 'قرية شاطئية بوهيمية فريدة تبعد 90 كم شمال شرم الشيخ. الجنة الحقيقية للغواصين وعشاق الرياح والتسلق على جبل سيناء. أجواء مريحة وأسعار في متناول الجميع.',
    distance: '90 كم شمال شرم الشيخ',
    address: 'دهب، جنوب سيناء',
    google_maps: 'https://maps.google.com/?q=Dahab+Egypt',
    coords: { lat: 28.5, lng: 34.5167 },
    rating: 4.8,
    price_range: 'budget',
    beach_quality: 5,
    diving: true,
    kite_surf: true,
    family_friendly: false,
    nightlife: true,
    remote_work: true,
    hotels: ['Nesima Resort', 'Daniela Village', 'Kempinski Soma Bay (قريب)', 'بنسيونات محلية'],
    best_for: ['غوص البلوهول الشهير', 'كيت سيرف وويند سيرف', 'ميزانية محدودة', 'رحلات بر سيناء', 'عمل عن بعد'],
    avg_hotel_egp: '400–4,000',
    highlights: [
      'The Blue Hole — أشهر موقع غوص في العالم',
      'Canyon & Islands — مواقع غوص استثنائية',
      'أسعار أوروبية تنزل 60-80% هنا',
      'كافيهات تطل على البحر',
      'باص يومي من شرم بـ 100 جنيه',
    ],
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80',
  },

  // ─── North Coast ───────────────────────────────────────────────────
  {
    id: 'marina',
    name: 'مارينا العلمين',
    nameAr: 'مارينا',
    city: 'north-coast',
    region: 'الساحل الشمالي',
    type: 'resort_village',
    typeLabel: 'قرية صيفية راقية',
    description: 'أشهر قرية سياحية على الساحل الشمالي المصري. تبعد 120 كم غرب الإسكندرية. ملجأ المصريين صيفاً بشواطئ رملية بيضاء وأجواء حيوية ليلية.',
    distance: '120 كم غرب الإسكندرية / 340 كم غرب القاهرة',
    address: 'مارينا، الساحل الشمالي، مطروح',
    google_maps: 'https://maps.google.com/?q=Marina+North+Coast+Egypt',
    coords: { lat: 30.8333, lng: 28.9667 },
    rating: 4.3,
    price_range: 'premium',
    beach_quality: 5,
    diving: false,
    kite_surf: false,
    family_friendly: true,
    nightlife: true,
    remote_work: false,
    hotels: ['Marassi Hotels', 'Hacienda Bay', 'Palm Hills North Coast'],
    best_for: ['صيف مصري', 'عائلات', 'شباب', 'حياة ليلية صيفية'],
    avg_hotel_egp: '3,000–15,000',
    highlights: [
      'أفضل شواطئ رملية في مصر',
      'مياه المتوسط الفيروزية',
      'مولات وترفيه متكامل',
      'أنشط صيفاً (يونيو–أغسطس)',
    ],
    image_url: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600&q=80',
  },
  {
    id: 'ain-sokhna',
    name: 'العين السخنة',
    nameAr: 'العين السخنة',
    city: 'suez',
    region: 'خليج السويس',
    type: 'resort_area',
    typeLabel: 'منتجع قريب من القاهرة',
    description: 'أقرب منتجع بحري للقاهرة — يبعد فقط 120 كم. تقع على خليج السويس وتحتضن عشرات القرى السياحية. وجهة عطلة نهاية الأسبوع للقاهريين.',
    distance: '120 كم جنوب شرق القاهرة',
    address: 'العين السخنة، خليج السويس، محافظة السويس',
    google_maps: 'https://maps.google.com/?q=Ain+Sokhna+Egypt',
    coords: { lat: 29.5667, lng: 32.3333 },
    rating: 4.2,
    price_range: 'moderate',
    beach_quality: 3,
    diving: false,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Stella di Mare', 'Porto Sokhna', 'Pyramids Hills', 'La Sirena'],
    best_for: ['قرب من القاهرة', 'عائلات', 'عطل قصيرة', 'استرخاء'],
    avg_hotel_egp: '1,500–8,000',
    highlights: [
      'قريب جداً من القاهرة (ساعة ونصف)',
      'عشرات القرى السياحية المتنوعة',
      'مياه خليج السويس دافئة',
      'موسم ممتد طول السنة',
    ],
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
];

const REGIONS = [
  { id: 'all', label: 'الكل' },
  { id: 'hurghada', label: '🌊 الغردقة' },
  { id: 'sharm-el-sheikh', label: '🤿 شرم الشيخ' },
  { id: 'marsa-alam', label: '🐠 مرسى علم' },
  { id: 'north-coast', label: '🏖️ الساحل الشمالي' },
  { id: 'suez', label: '🌅 السخنة' },
];

const PRICE_LABELS = { budget: 'اقتصادي', moderate: 'متوسط', premium: 'راقي', luxury: 'فاخر' };
const PRICE_COLORS = { budget: 'bg-success/10 text-success', moderate: 'bg-blue-500/10 text-blue-600', premium: 'bg-amber-500/10 text-amber-700', luxury: 'bg-purple-500/10 text-purple-700' };

const FEATURE_ICONS = [
  { key: 'diving', label: 'غوص', icon: '🤿' },
  { key: 'kite_surf', label: 'كيت سيرف', icon: '🪁' },
  { key: 'family_friendly', label: 'عائلي', icon: '👨‍👩‍👧' },
  { key: 'nightlife', label: 'حياة ليلية', icon: '🎉' },
  { key: 'remote_work', label: 'عمل عن بعد', icon: '💻' },
];

function VillageCard({ v }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white font-black text-lg leading-tight">{v.name}</h3>
              <p className="text-white/80 text-xs">{v.nameAr} · {v.region}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">{v.rating}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${PRICE_COLORS[v.price_range]}`}>
            {PRICE_LABELS[v.price_range]}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            {v.typeLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Distance + address */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold">{v.distance}</p>
            <p className="text-[10px] text-muted-foreground">{v.address}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{v.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {FEATURE_ICONS.filter(f => v[f.key]).map((f, i) => (
            <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-medium">
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted-foreground">متوسط الفندق:</span>
            <span className="text-xs font-bold text-accent">{v.avg_hotel_egp} EGP/ليلة</span>
          </div>
        </div>

        {/* Expand/Collapse */}
        <button onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-accent font-bold mb-2 hover:underline">
          {expanded ? '▲ أقل تفاصيل' : '▼ تفاصيل أكثر + فنادق'}
        </button>

        {expanded && (
          <div className="space-y-3 mt-2 border-t border-border/30 pt-3">
            {/* Highlights */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">أبرز المميزات</p>
              <ul className="space-y-1">
                {v.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="text-success mt-0.5">✓</span>{h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best for */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">الأفضل لـ</p>
              <div className="flex flex-wrap gap-1">
                {v.best_for.map((b, i) => (
                  <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">{b}</span>
                ))}
              </div>
            </div>

            {/* Hotels */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">فنادق بارزة</p>
              <div className="flex flex-wrap gap-1">
                {v.hotels.map((h, i) => (
                  <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{h}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Google Maps */}
        <a href={v.google_maps} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full bg-success/10 border border-success/20 text-success rounded-xl py-2 text-xs font-bold hover:bg-success/20 transition-all">
          <MapPin className="w-3.5 h-3.5" />
          عرض على خريطة جوجل
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function TouristVillages() {
  const [region, setRegion] = useState('all');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useSEO({
    title: 'القرى السياحية في مصر 2026 — الغردقة، شرم الشيخ، مرسى علم، الساحل الشمالي',
    description: 'دليل شامل لأفضل القرى والمنتجعات السياحية في مصر 2026. معلومات كاملة، عناوين، خرائط، فنادق وأسعار.',
  });

  const filtered = VILLAGES.filter(v => {
    const matchRegion = region === 'all' || v.city === region;
    const matchSearch = !search || v.name.includes(search) || v.nameAr.includes(search) || v.region.includes(search);
    const matchFilter =
      filter === 'all' ? true :
      filter === 'diving' ? v.diving :
      filter === 'kite' ? v.kite_surf :
      filter === 'family' ? v.family_friendly :
      filter === 'budget' ? ['budget', 'moderate'].includes(v.price_range) :
      filter === 'luxury' ? ['premium', 'luxury'].includes(v.price_range) : true;
    return matchRegion && matchSearch && matchFilter;
  });

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Sun className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">القرى السياحية في مصر</h1>
          <p className="text-sm text-muted-foreground">دليل شامل · {VILLAGES.length} وجهة · محدث أبريل 2026</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'قرى وتشعبات', value: VILLAGES.length, color: 'text-blue-500' },
          { label: 'مواقع غوص', value: VILLAGES.filter(v => v.diving).length, color: 'text-cyan-500' },
          { label: 'عائلي', value: VILLAGES.filter(v => v.family_friendly).length, color: 'text-success' },
          { label: 'كيت سيرف', value: VILLAGES.filter(v => v.kite_surf).length, color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ابحث عن قرية سياحية..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-accent/50 text-right"
          dir="rtl"
        />
      </div>

      {/* Region filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4" dir="rtl">
        {REGIONS.map(r => (
          <button key={r.id} onClick={() => setRegion(r.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${region === r.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground'}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Feature filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6" dir="rtl">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'diving', label: '🤿 غوص' },
          { id: 'kite', label: '🪁 كيت سيرف' },
          { id: 'family', label: '👨‍👩‍👧 عائلي' },
          { id: 'budget', label: '💚 اقتصادي' },
          { id: 'luxury', label: '⭐ فاخر' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === f.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4" dir="rtl">
        عرض {filtered.length} من {VILLAGES.length} وجهة
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Sun className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>لا توجد نتائج لهذا البحث</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(v => <VillageCard key={v.id} v={v} />)}
        </div>
      )}

      {/* Tip */}
      <div className="mt-8 bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
        <p className="text-sm font-bold mb-1">💡 نصيحة Locali Egypt</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          استخدم كود <strong>LOCALI</strong> عند الحجز مع أي مرشد أو شركة تور محلية للحصول على خصم 10%
        </p>
      </div>
    </div>
  );
}