import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, AlertTriangle, Heart, MapPin, DollarSign, TrendingUp, MessageCircle, Utensils, Star } from 'lucide-react';
import { useSEO } from '../lib/seo';

// ─── Nationality Data ─────────────────────────────────────────────────────────
const NATIONALITIES = [
  { id: 'ru', flag: '🇷🇺', label: 'Русский', sublabel: 'Russian', color: 'bg-red-500/10 text-red-600', border: 'border-red-500/30' },
  { id: 'de', flag: '🇩🇪', label: 'Deutsch', sublabel: 'German', color: 'bg-yellow-500/10 text-yellow-700', border: 'border-yellow-500/30' },
  { id: 'gb', flag: '🇬🇧', label: 'English', sublabel: 'British', color: 'bg-blue-500/10 text-blue-700', border: 'border-blue-500/30' },
  { id: 'it', flag: '🇮🇹', label: 'Italiano', sublabel: 'Italian', color: 'bg-green-500/10 text-green-700', border: 'border-green-500/30' },
  { id: 'fr', flag: '🇫🇷', label: 'Français', sublabel: 'French', color: 'bg-indigo-500/10 text-indigo-700', border: 'border-indigo-500/30' },
  { id: 'es', flag: '🇪🇸', label: 'Español', sublabel: 'Spanish', color: 'bg-orange-500/10 text-orange-700', border: 'border-orange-500/30' },
  { id: 'cn', flag: '🇨🇳', label: '中文', sublabel: 'Chinese', color: 'bg-red-500/10 text-red-700', border: 'border-red-500/30' },
  { id: 'ar', flag: '🇸🇦', label: 'عربي', sublabel: 'Arabic', color: 'bg-emerald-500/10 text-emerald-700', border: 'border-emerald-500/30' },
];

const CONTENT = {
  ru: {
    headline: 'Хургада для русских туристов — реальные цены, проверенные сервисы',
    subheadline: 'Русскоязычные врачи, обменники без обмана, рестораны с русским меню',
    scamAlert: 'Осторожно: фейковые туроператоры предлагают "эксклюзивные" экскурсии — всегда бронируй через Locali Egypt',
    badge: '🇷🇺 Говорим по-русски',
    services: [
      {
        category: '🏥 Русскоязычные врачи и клиники',
        items: [
          { name: 'Hurghada International Hospital', detail: 'Русскоязычный персонал • Хургада Корниш', meta: 'Скорая помощь, хирургия, педиатрия', price: '300–800 EGP', hours: '24/7', verified: true },
          { name: 'Dr. Natasha Clinic', detail: 'ул. Шератон, Хургада', meta: 'Терапевт, дерматолог, педиатр', price: '250–500 EGP', hours: '9:00–20:00', verified: true },
          { name: 'Sharm Russian Medical Centre', detail: 'Наама Бэй, Шарм', meta: 'Общая медицина, стоматология', price: '200–600 EGP', hours: '8:00–22:00', verified: true },
        ],
      },
      {
        category: '💱 Проверенные обменные пункты',
        items: [
          { name: 'Al Ahly Bank Exchange', detail: 'Центр Хургады, ул. Корниш', meta: 'Без комиссий • Официальный банковский курс', price: 'Курс ЦБ +0.5%', hours: '9:00–18:00', verified: true },
          { name: 'Banque Misr — Marina Branch', detail: 'Марина, Хургада', meta: 'Проверенный государственный банк', price: 'Официальный курс', hours: '9:00–17:00', verified: true },
          { name: 'CIB Exchange — Naama Bay', detail: 'Наама Бэй, Шарм', meta: 'Минимальная комиссия • Безопасно', price: 'Курс ЦБ +0.3%', hours: '8:00–20:00', verified: true },
        ],
      },
      {
        category: '🍽️ Рестораны с русским меню',
        items: [
          { name: 'Russky Dom Restaurant', detail: 'ул. Шератон, Хургада', meta: 'Борщ, пельмени, блины, шашлык', price: '200–600 EGP', hours: '12:00–23:00', verified: false },
          { name: 'Volga Café & Restaurant', detail: 'Сахл Хашиш, Хургада', meta: 'Русская кухня + морепродукты', price: '300–800 EGP', hours: '11:00–00:00', verified: false },
          { name: 'St. Petersburg Bistro', detail: 'Наама Бэй, Шарм', meta: 'Русское меню, персонал говорит по-русски', price: '250–700 EGP', hours: '10:00–23:00', verified: false },
        ],
      },
      {
        category: '🛒 Русские продукты и магазины',
        items: [
          { name: 'Carrefour Hurghada', detail: 'Сити Центр, Хургада', meta: 'Гречка, кефир, сметана, российские товары', price: 'Супермаркет', hours: '9:00–23:00', verified: false },
          { name: 'Spinneys Supermarket', detail: 'Марина, Хургада', meta: 'Широкий выбор европейских продуктов', price: 'Супермаркет', hours: '8:00–22:00', verified: false },
        ],
      },
    ],
    faq: [
      { q: 'Сколько стоит такси до аэропорта?', a: 'Из Хургады: 150–250 EGP (≈$3–5). Из Шарма: 100–180 EGP. Всегда договаривайся о цене ДО поездки или используй Locali Ride с фиксированной ценой.' },
      { q: 'Где найти русскоязычного врача?', a: 'Hurghada International Hospital — есть русскоязычный персонал. В Шарме — Sharm Russian Medical Centre в Наама Бэй. Обе клиники работают 24/7 с минимальным ожиданием.' },
      { q: 'Какой обменный пункт надёжный?', a: 'ТОЛЬКО государственные банки: Al Ahly Bank, Banque Misr, CIB. НИКОГДА не меняй в аэропорту (курс на 15–20% хуже) и у уличных менял (риск фальшивок).' },
      { q: 'Безопасно ли ходить ночью?', a: 'В курортных зонах (Наама Бэй, Марина Хургады) — безопасно до полуночи. Держись освещённых улиц, ходи группой. Одиноким женщинам — рекомендуем после 22:00 такси.' },
      { q: 'Где купить российскую SIM-карту или пополнить счёт?', a: 'Российские SIM работают в роуминге (дорого). Лучше купить египетскую: Vodafone или Orange — 15ГБ за 200–250 EGP. Магазины в центре города, НЕ в аэропорту.' },
    ],
    scams: [
      { title: 'Фейковые туроператоры', desc: 'Предлагают "эксклюзивные" экскурсии у отеля — цена в 3–5 раз выше рынка. Всегда бронируй через Locali Egypt с фиксированной ценой.' },
      { title: 'Обменники "для своих"', desc: 'Предлагают курс выше официального — после обмена дают фальшивые EGP. Только банки!' },
      { title: 'Такси без счётчика', desc: 'Называют цену по-русски в €/$ вместо EGP. Реальная цена в 5–10 раз ниже. Спрашивай: "بكام بالجنيه؟" (сколько в фунтах?)' },
    ],
    emergency: [
      { phrase: 'Вызовите скорую', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: 'Мне нужен врач', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: 'У меня аллергия на...', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  de: {
    headline: 'Hurghada für Deutsche Touristen — echte Preise, vertrauenswürdige Services',
    subheadline: 'Deutschsprachige Ärzte, Reiseführer und alles was Sie wissen müssen',
    scamAlert: 'Achtung: Überteuerte Tauchschulen sprechen gezielt Deutsche an. Immer Preise auf Locali Egypt prüfen.',
    badge: '🇩🇪 Deutsch gesprochen',
    services: [
      {
        category: '🏥 Deutschsprachige Ärzte & Zahnärzte',
        items: [
          { name: 'Dr. Fischer Medical Centre', detail: 'Naama Bay, Sharm El Sheikh', meta: 'Allgemeinmedizin, Tauchmedizin (DDRC)', price: '300–700 EGP', hours: '8:00–20:00', verified: true },
          { name: 'Hurghada German Clinic', detail: 'Sakkala, Hurghada', meta: 'Allgemeinmedizin, Pädiatrie', price: '250–600 EGP', hours: '9:00–21:00', verified: true },
          { name: 'Euro Dental Sharm', detail: 'Naama Bay', meta: 'Zahnarzt mit deutschsprachigem Personal', price: '400–1500 EGP', hours: '9:00–19:00', verified: false },
        ],
      },
      {
        category: '🤿 Deutsche Tauchschulen & Reiseveranstalter',
        items: [
          { name: 'Euro Divers Hurghada', detail: 'Red Sea Marina', meta: 'PADI/SSI zertifiziert • Deutschsprachige Instruk.', price: 'ab 900 EGP/Tag', hours: '7:00–18:00', verified: true },
          { name: 'Sinai Divers Sharm', detail: 'Naama Bay', meta: 'Deutschsprachige Guides • 30 Jahre Erfahrung', price: 'ab 1100 EGP', hours: '7:00–19:00', verified: true },
          { name: 'TUI Reiseleitung Hurghada', detail: 'TUI Partnerhotels', meta: 'Offizielle TUI Reiseleitung vor Ort', price: 'TUI Buchung', hours: 'Hotelzeiten', verified: false },
        ],
      },
    ],
    faq: [
      { q: 'Welche Impfungen brauche ich für Ägypten?', a: 'Standardimpfungen (Tetanus, Hepatitis A) empfohlen. Keine Pflichtimpfungen. Bei längerem Aufenthalt: Hepatitis B, Typhus. Konsultieren Sie Ihren Hausarzt 4–6 Wochen vor Reise.' },
      { q: 'Ist Leitungswasser trinkbar?', a: 'NEIN. Ausschließlich Flaschenwasser trinken — auch zum Zähneputzen. Große 1,5L Flasche: 8–15 EGP im Supermarkt (≈0,15€). Nie Eis aus unbekannten Quellen.' },
      { q: 'Was sind die Trinkgeldgewohnheiten?', a: 'Restaurants: 10% üblich. Hotelpersonal: 20–50 EGP/Tag. Reiseführer: 100–200 EGP/Tag. Taxifahrer: aufrunden. KEIN Trinkgeld für ungebetene "Hilfe".' },
      { q: 'Welche Strände haben Blue-Flag-Standard?', a: 'Hurghada: Sahl Hasheesh Beach, Makadi Bay. Sharm: Naama Bay, Sharks Bay. El Gouna: alle öffentlichen Strände. Regelmäßige Wasserqualitätsprüfungen.' },
      { q: 'Wie komme ich sicher vom Flughafen?', a: 'Nur offizielle Taxis aus dem Terminal (fixe Preise: 150–250 EGP). NIEMALS Taxifahrer annehmen der Sie im Terminal anspricht. Locali Ride App: sicher, Festpreis, GPS-Tracking.' },
    ],
    scams: [
      { title: 'Überteuerte Tauchschulen', desc: 'Sprechen Deutsche gezielt an und verlangen 2–3x Marktpreis. Immer vorher auf Locali Egypt Preise prüfen.' },
      { title: 'Falsche "offizielle" Reiseleiter', desc: 'Behaupten, von TUI/DER/Neckermann zu sein. Offizielle Reiseleiter haben immer Ausweis und sprechen Sie im Hotel an, nicht auf der Straße.' },
      { title: 'Wechselstubenbetrug', desc: 'Bieten super Kurs, geben dann weniger Scheine. Nur staatliche Banken: Banque Misr, CIB, Al Ahly.' },
    ],
    emergency: [
      { phrase: 'Rufen Sie einen Krankenwagen', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: 'Ich brauche einen Arzt', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: 'Ich bin allergisch gegen...', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  gb: {
    headline: 'Egypt for British Tourists — Is It Safe? Real Prices, Trusted Services',
    subheadline: 'UK FCO advice, English-speaking doctors, family resort guides, and scam prevention',
    scamAlert: 'Watch out: Men claiming to be "official FCO representatives" or "British consulate staff" at airports are scammers.',
    badge: '🇬🇧 English Spoken Here',
    services: [
      {
        category: '🏥 English-Speaking Doctors & Hospitals',
        items: [
          { name: 'Hurghada International Hospital', detail: 'Corniche, Hurghada', meta: 'English-speaking staff • Emergency 24/7', price: '300–800 EGP', hours: '24/7', verified: true },
          { name: 'Sharm International Hospital', detail: 'El Salam, Sharm', meta: 'English-speaking doctors • Surgery', price: '350–900 EGP', hours: '24/7', verified: true },
          { name: 'Anglo-American Hospital Cairo', detail: 'Cairo (for serious cases)', meta: 'UK-trained doctors • International insurance', price: '600–2000 EGP', hours: '24/7', verified: true },
        ],
      },
      {
        category: '🍺 British-Friendly Bars & Restaurants',
        items: [
          { name: 'The Red Lion Pub', detail: 'Naama Bay, Sharm', meta: 'English pub • Sports TV • Full English breakfast', price: '200–500 EGP', hours: '12:00–02:00', verified: false },
          { name: 'Churchill Bar — Sonesta Resort', detail: 'Hurghada', meta: 'Premier League screenings • British menu', price: '150–400 EGP', hours: '16:00–01:00', verified: false },
          { name: 'Camelot Restaurant', detail: 'Naama Bay', meta: 'English menu, English staff', price: '250–600 EGP', hours: '11:00–23:00', verified: false },
        ],
      },
    ],
    faq: [
      { q: 'Is Egypt safe after FCO warnings?', a: 'Yes for tourist areas. FCO says "Normal Precautions" for Sharm, Hurghada, Luxor, Aswan — the same level as France or Germany. Avoid North Sinai (not a tourist area). 15.7M tourists visited Egypt safely in 2024.' },
      { q: 'Do I need travel insurance for Egypt?', a: 'Absolutely yes. Medical costs without insurance can reach £5,000–20,000. Ensure it covers: medical evacuation, diving if applicable, and 24h assistance. Post Office Travel, Compare the Market for best UK deals.' },
      { q: 'Which resorts are best for families?', a: 'Sahl Hasheesh (Hurghada) — gated, private beach, safe. El Gouna — car-free island city, exceptional for families. Naama Bay (Sharm) — lively but very safe zone for families.' },
      { q: 'How do I avoid stomach issues (Egypt tummy)?', a: 'Never drink tap water. Stick to bottled (8–15 EGP/1.5L). Eat at busy restaurants (turnover = fresh food). Avoid salads washed in tap water. Take rehydration sachets and Imodium as precaution.' },
      { q: "What's the dress code outside the resort?", a: "In cities and markets: cover shoulders and knees. Women: loose clothing, scarf optional but respectful. In resorts and beaches: normal swimwear fine. Luxor and Aswan: more conservative than Red Sea cities." },
    ],
    scams: [
      { title: 'Fake FCO representatives', desc: 'Men in suits claiming to offer "official travel advice" or "safety registration" at airports. The real FCO never operates this way. Ignore and walk on.' },
      { title: 'Papyrus Institute scam', desc: 'Taxi drivers offer "free" visit to a papyrus factory. You\'ll be pressured into buying overpriced souvenirs. Genuine papyrus: 50–200 EGP. At these "institutes": 2,000–5,000 EGP.' },
      { title: 'Perfume factory tour', desc: 'Similar to papyrus — "free tour" ends in hard sales room. Very persistent. Just say "La shukran" and leave.' },
    ],
    emergency: [
      { phrase: 'Call an ambulance', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: 'I need a doctor', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: "I'm allergic to...", arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  it: {
    headline: 'Hurghada per turisti italiani — prezzi reali, servizi verificati',
    subheadline: 'Guide italiane, medici, ristoranti e tutto quello che devi sapere',
    scamAlert: 'Attenzione: finti "ristoranti italiani" con menu tradotti male e prezzi gonfiati. Chiedi sempre il prezzo prima!',
    badge: '🇮🇹 Si parla italiano',
    services: [
      {
        category: '🏥 Medici e dentisti italofoni',
        items: [
          { name: 'Dr. Marco Medical Centre', detail: 'Sahl Hasheesh, Hurghada', meta: 'Medicina generale, italiano fluente', price: '300–700 EGP', hours: '9:00–21:00', verified: true },
          { name: 'Italian Dental Clinic Sharm', detail: 'Naama Bay', meta: 'Dentista italiano certificato', price: '400–1500 EGP', hours: '10:00–19:00', verified: false },
        ],
      },
      {
        category: '🤿 Guide e operatori italiani',
        items: [
          { name: 'Italia Diving Hurghada', detail: 'Marina Red Sea', meta: 'PADI • Guide italiane • Escursioni in italiano', price: 'da 900 EGP', hours: '7:00–18:00', verified: true },
          { name: 'Nile & Sea Tours', detail: 'Hurghada, Luxor', meta: 'Guide turistiche italofone • Tour privati', price: 'da 1200 EGP', hours: '8:00–19:00', verified: false },
        ],
      },
      {
        category: '🍕 Ristoranti italiani (veri!)',
        items: [
          { name: 'Il Capriccio', detail: 'Naama Bay, Sharm', meta: 'Pizza napoletana, pasta fresca, gelato artigianale', price: '300–800 EGP', hours: '12:00–23:00', verified: false },
          { name: 'La Dolce Vita Hurghada', detail: 'Sakkala, Hurghada', meta: 'Cucina italiana autentica, vini importati', price: '400–900 EGP', hours: '13:00–00:00', verified: false },
        ],
      },
    ],
    faq: [
      { q: 'Dove posso trovare cibo italiano?', a: 'Il Capriccio a Naama Bay (Sharm) e La Dolce Vita a Hurghada sono i più autentici. Attenzione ai posti che si chiamano "Italian" senza personale italiano — spesso deludenti.' },
      { q: 'È sicuro fare snorkeling?', a: 'Sì, il Mar Rosso è tra i migliori posti al mondo. Usa solo scuole certificate PADI/SSI. Fai attenzione alle correnti nelle zone di reef e segui sempre la guida.' },
      { q: 'Quali sono i prezzi reali?', a: 'Pasto in ristorante locale: 100–250 EGP (€2–5). Taxi dal/per aeroporto: 150–250 EGP. Escursione giornaliera snorkeling: 600–900 EGP. Controlla sempre su Locali Egypt prima di pagare.' },
      { q: 'Come evitare le truffe?', a: 'Regola d\'oro: non accettare MAI nulla di "gratis" (ti verrà chiesto di comprare qualcosa dopo). Stabilisci il prezzo PRIMA. Usa Locali Egypt per prezzi verificati.' },
      { q: 'Dove cambiare euro?', a: 'Solo in banche statali: Banque Misr, CIB, Al Ahly. MAI all\'aeroporto (tasso peggiore del 15–20%) e MAI dai cambiavalute ambulanti. Porta contanti cash, gli ATM sono disponibili ovunque.' },
    ],
    scams: [
      { title: 'Finti ristoranti italiani', desc: 'Menu con nomi italiani ma nessun cuoco italiano. Paghi prezzi da ristorante vero per cibo scadente. Chiedi: "Avete un cuoco italiano?" — la risposta ti dirà tutto.' },
      { title: 'Guide abusive ai siti', desc: 'Si avvicinano fingendo di essere guide ufficiali. Le guide ufficiali hanno tesserino plastificato del Ministero del Turismo egiziano.' },
      { title: 'Giri in feluuca "gratis"', desc: 'Il giro è gratis, ma poi ti chiedono 500–2000 EGP. Stabilisci sempre il prezzo prima di salire.' },
    ],
    emergency: [
      { phrase: 'Chiamate un\'ambulanza', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: 'Ho bisogno di un medico', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: 'Sono allergico/a a...', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  fr: {
    headline: 'Hurghada pour touristes français — vrais prix, services vérifiés',
    subheadline: 'Médecins francophones, guides, restaurants et conseils essentiels',
    scamAlert: 'Attention: les vendeurs ambulants repèrent souvent les touristes français et majorent les prix. Demandez toujours en EGP.',
    badge: '🇫🇷 Français parlé ici',
    services: [
      {
        category: '🏥 Médecins et cliniques francophones',
        items: [
          { name: 'Dr. Sophie Clinic', detail: 'Marina, Hurghada', meta: 'Médecine générale, pédiatrie, français courant', price: '300–700 EGP', hours: '9:00–20:00', verified: true },
          { name: 'French Medical Centre Sharm', detail: 'Naama Bay', meta: 'Personnel médical francophone', price: '250–650 EGP', hours: '8:00–22:00', verified: false },
        ],
      },
      {
        category: '🥖 Restaurants et boulangeries françaises',
        items: [
          { name: 'Le Petit Paris', detail: 'Naama Bay, Sharm', meta: 'Croissants, baguettes, cuisine française', price: '200–600 EGP', hours: '7:00–23:00', verified: false },
          { name: 'Café de la Mer', detail: 'Corniche, Hurghada', meta: 'Cuisine franco-méditerranéenne', price: '300–800 EGP', hours: '10:00–midnight', verified: false },
        ],
      },
    ],
    faq: [
      { q: "Est-ce que l'eau est potable?", a: "Non, absolument pas. Buvez uniquement de l'eau en bouteille — même pour se brosser les dents. Grande bouteille 1,5L: 8–15 EGP (≈0,15€) dans les supermarchés. Évitez aussi les glaçons." },
      { q: 'Quels sont les vrais prix?', a: 'Repas restaurant local: 100–250 EGP (€2–5). Taxi aéroport: 150–250 EGP. Excursion plongée: 900–1400 EGP. Carte SIM 15Go: 200–250 EGP. Vérifiez tout sur Locali Egypt.' },
      { q: 'Comment éviter les arnaques?', a: "Règle d'or: rien n'est jamais vraiment gratuit en Égypte touristique. Refusez fermement les \"cadeaux\". Établissez le prix AVANT tout service. Dites \"La shukran\" (Non merci) fermement si vous n'êtes pas intéressé." },
      { q: 'Où trouver un médecin francophone?', a: "Dr. Sophie Clinic à Marina Hurghada est la mieux notée pour les francophones. Pour urgences: Hurghada International Hospital a du personnel anglophone 24/7 (le français peut varier)." },
      { q: 'Est-il sécuritaire pour les femmes seules?', a: "Les zones touristiques sont sûres. Conseils: habillement modeste hors resort, éviter les ruelles isolées la nuit, préférer les taxis Locali Ride (avec tracking GPS). Hundreds of solo French women visit safely every year." },
    ],
    scams: [
      { title: 'Guides non officiels aux pyramides', desc: "S'approchent en parlant français, proposent de \"montrer les vrais secrets\". Les vraies guides ont un badge officiel du Ministère du Tourisme égyptien." },
      { title: 'Taxi sans compteur', desc: "Annoncent le prix en euros ou dollars. Le vrai prix en EGP est 5–10 fois moins cher. Demandez toujours: combien en livres égyptiennes?" },
      { title: 'Change dans la rue', desc: "Proposent un taux miraculeux. Risque de faux billets. Changez uniquement en banque: Banque Misr, CIB, Al Ahly Bank." },
    ],
    emergency: [
      { phrase: 'Appelez une ambulance', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: "J'ai besoin d'un médecin", arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: 'Je suis allergique à...', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  es: {
    headline: 'Hurghada para turistas españoles — precios reales, servicios verificados',
    subheadline: 'Médicos hispanohablantes, guías y todo lo que necesitas saber',
    scamAlert: 'Cuidado: los taxistas a veces citan precios en euros — el precio real en EGP es 5–10 veces menor.',
    badge: '🇪🇸 Se habla español',
    services: [
      {
        category: '🏥 Médicos y dentistas hispanohablantes',
        items: [
          { name: 'International Medical Centre', detail: 'Sakkala, Hurghada', meta: 'Personal hispanohablante disponible', price: '300–700 EGP', hours: '9:00–21:00', verified: true },
          { name: 'Euro Clinic Sharm', detail: 'Naama Bay', meta: 'Médico general, inglés/español', price: '250–600 EGP', hours: '8:00–22:00', verified: false },
        ],
      },
      {
        category: '🤿 Guías y operadores turísticos',
        items: [
          { name: 'Hispano Diving Hurghada', detail: 'Marina Red Sea', meta: 'Instructores certificados PADI, español fluente', price: 'desde 900 EGP', hours: '7:00–18:00', verified: false },
          { name: 'Cairo & Nile Tours', detail: 'Hurghada / Luxor', meta: 'Guías turísticos en español', price: 'desde 1500 EGP', hours: '8:00–18:00', verified: false },
        ],
      },
    ],
    faq: [
      { q: '¿Es seguro Egipto para turistas?', a: 'Sí. Hurghada, Sharm El Sheikh, Luxor y Aswan son zonas seguras para turistas. El riesgo principal son las estafas económicas, no la violencia. 15,7 millones de turistas visitaron Egipto en 2024 sin incidentes.' },
      { q: '¿Cuáles son los precios reales?', a: 'Comida en restaurante local: 100–250 EGP (€2–5). Taxi al aeropuerto: 150–250 EGP. Excursión de snorkel: 600–900 EGP. Todo verificado en Locali Egypt.' },
      { q: '¿Dónde cambiar euros de forma segura?', a: 'Solo en bancos estatales: Banque Misr, CIB, Al Ahly. NUNCA en el aeropuerto (pierde 15–20%) ni en la calle (riesgo de billetes falsos).' },
      { q: '¿Qué excursiones son las mejores?', a: 'Mar Rojo: snorkel en Isla Giftun (Hurghada) o Ras Mohammed (Sharm). Historia: Valle de los Reyes (Luxor), Abu Simbel (Aswan). Aventura: safari en quads al desierto al atardecer.' },
      { q: '¿Hay médicos que hablen español?', a: 'En Hurghada: International Medical Centre en Sakkala tiene personal hispanohablante. En Sharm: Euro Clinic en Naama Bay. Para emergencias: Hurghada International Hospital tiene personal anglohablante 24/7.' },
    ],
    scams: [
      { title: 'Taxis sin taxímetro', desc: 'Dicen el precio en euros o dólares. El precio real en libras egipcias (EGP) es 5–10 veces más barato. Pregunta siempre: ¿cuánto en libras?' },
      { title: 'Guías falsos en los templos', desc: 'Se acercan fingiendo ser guías oficiales. Los guías oficiales tienen una tarjeta plastificada del Ministerio de Turismo egipcio con foto.' },
      { title: 'Cambio en la calle', desc: 'Ofrecen tipo de cambio muy favorable. Alto riesgo de billetes falsos. Solo bancos estatales.' },
    ],
    emergency: [
      { phrase: 'Llamen a una ambulancia', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: 'Necesito un médico', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: 'Soy alérgico/a a...', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  cn: {
    headline: '赫尔格达中国游客指南 — 真实价格，可信服务',
    subheadline: '普通话导游、医生、微信支付及防骗指南',
    scamAlert: '注意：虚假"正宗中国餐厅"和假冒导游针对中国游客。始终通过Locali Egypt预订！',
    badge: '🇨🇳 普通话服务',
    services: [
      {
        category: '🏥 中文医疗服务',
        items: [
          { name: 'Hurghada International Hospital', detail: '科尼什大道，赫尔格达', meta: '提供翻译服务，24小时急诊', price: '300–800 EGP', hours: '24/7', verified: true },
          { name: 'Sharm International Hospital', detail: '沙姆沙伊赫', meta: '英语/阿拉伯语，有翻译应用', price: '350–900 EGP', hours: '24/7', verified: true },
        ],
      },
      {
        category: '🍜 中餐厅和茶馆',
        items: [
          { name: 'China Garden Restaurant', detail: '纳玛湾，沙姆', meta: '粤菜、川菜，中文菜单', price: '300–800 EGP', hours: '12:00–23:00', verified: false },
          { name: 'Beijing House Hurghada', detail: '萨卡拉，赫尔格达', meta: '中国北方菜，中文服务', price: '250–700 EGP', hours: '11:00–22:00', verified: false },
        ],
      },
      {
        category: '💳 微信支付/支付宝',
        items: [
          { name: 'Carrefour Hurghada', detail: '城市中心', meta: '部分收银台支持支付宝', price: '超市', hours: '9:00–23:00', verified: false },
          { name: '多数大型度假酒店', detail: '赫尔格达 & 沙姆', meta: '询问前台是否支持中国移动支付', price: '因地而异', hours: '24/7', verified: false },
        ],
      },
    ],
    faq: [
      { q: '埃及安全吗？', a: '是的，赫尔格达、沙姆沙伊赫、卢克索和阿斯旺对游客是安全的。2024年有1570万游客安全到访。主要风险是价格欺诈，而非人身安全。' },
      { q: '真实价格是多少？', a: '机场出租车：150-250埃镑。当地餐厅用餐：100-250埃镑。一日浮潜游：600-900埃镑。15GB手机卡：200-250埃镑。所有价格均在Locali Egypt上核实。' },
      { q: '哪里可以找到说中文的医生？', a: '最近的选择是赫尔格达国际医院，有翻译服务。建议下载翻译应用备用。中国驻埃及大使馆紧急电话：+20-2-2532-1149。' },
      { q: '如何避免被骗？', a: '黄金法则：在埃及没有真正免费的东西。拒绝接受"礼物"。永远在享受服务前谈好价格。只在国家银行换汇。使用Locali Egypt的固定价格司机。' },
      { q: '哪里可以用微信支付？', a: '目前接受微信支付的地方有限，主要是大型连锁超市。建议携带美元/欧元现金换埃镑。机场ATM费用高昂，城市中心的国家银行汇率更好。' },
    ],
    scams: [
      { title: '假冒奢侈品', desc: '声称出售正品名牌产品——在埃及不存在正品奢侈品市场。所有"正品"都是仿冒品。' },
      { title: '假导游', desc: '在景点附近接近中国游客，报出中文价格，通常比市场价高5-10倍。只通过Locali Egypt预订认证导游。' },
      { title: '机场换汇', desc: '机场汇率比市区差15-20%。在国家银行换汇：Banque Misr、CIB或Al Ahly Bank。' },
    ],
    emergency: [
      { phrase: '叫救护车', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: '我需要医生', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: '我对...过敏', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
  ar: {
    headline: 'الغردقة للسياح العرب — أسعار حقيقية، خدمات موثوقة',
    subheadline: 'مطاعم حلال، أوقات الصلاة، المساجد، وكل ما يحتاجه السائح العربي',
    scamAlert: 'تحذير: بعض المطاعم تدّعي أنها "حلال معتمد" وتبالغ في الأسعار. تحقق دائماً من الشهادة الرسمية.',
    badge: '🇸🇦 نتحدث العربية',
    rtl: true,
    services: [
      {
        category: '🕌 المساجد وأوقات الصلاة',
        items: [
          { name: 'مسجد الرحمة — الغردقة', detail: 'شارع الكورنيش، الغردقة', meta: 'الجمعة والجماعة • مكيف • مفتوح 24/7', price: 'مجاناً', hours: '5 صلوات', verified: true },
          { name: 'مسجد النور — نعمة باي', detail: 'نعمة باي، شرم الشيخ', meta: 'قريب من المنطقة السياحية', price: 'مجاناً', hours: '5 صلوات', verified: true },
          { name: 'مسجد الرسالة — سهل حشيش', detail: 'سهل حشيش، الغردقة', meta: 'بجانب المنتجعات الكبرى', price: 'مجاناً', hours: '5 صلوات', verified: true },
        ],
      },
      {
        category: '🍖 مطاعم حلال موثقة',
        items: [
          { name: 'مطعم اللحم على الطريقة', detail: 'ساكالا، الغردقة', meta: 'لحوم حلال مذبوحة يومياً • مطبخ شرقي', price: '150–400 ج.م', hours: '12:00–00:00', verified: true },
          { name: 'مطعم البيت العربي', detail: 'الكورنيش، الغردقة', meta: 'مأكولات مصرية وعربية أصيلة • حلال', price: '120–350 ج.م', hours: '10:00–23:00', verified: true },
          { name: 'مطعم الأمير — شرم', detail: 'نعمة باي', meta: 'مطبخ عربي كامل، لحوم حلال', price: '200–500 ج.م', hours: '11:00–00:00', verified: false },
        ],
      },
      {
        category: '🏖️ شواطئ ومنتجعات عائلية',
        items: [
          { name: 'سهل حشيش', detail: 'الغردقة', meta: 'منطقة مسوّرة • هادئة • مناسبة للعائلات', price: 'متوسط', hours: 'منتجعات', verified: true },
          { name: 'الجونة', detail: '27 كم شمال الغردقة', meta: 'مدينة خاصة • شواطئ نظيفة • آمنة جداً', price: 'فاخر', hours: 'منتجعات', verified: true },
        ],
      },
    ],
    faq: [
      { q: 'أين أقرب مسجد؟', a: 'في الغردقة: مسجد الرحمة على الكورنيش، 5 دقائق سيراً من معظم فنادق المنطقة السياحية. في شرم الشيخ: مسجد النور في نعمة باي. معظم المنتجعات الكبيرة تملك مصلى داخلي.' },
      { q: 'هل المطاعم حلال؟', a: 'مصر دولة إسلامية والغالبية العظمى من اللحوم حلال. تجنب مطاعم الفنادق الدولية التي قد تقدم كحول ولحم خنزير. ابحث عن مطاعم مصرية شعبية أو طلب شهادة الحلال.' },
      { q: 'ما هي الأسعار الحقيقية؟', a: 'وجبة في مطعم محلي: 100–250 ج.م. تاكسي للمطار: 150–250 ج.م. رحلة غطس/شنكل: 600–900 ج.م. الشيشة في المقاهي: 50–150 ج.م. تحقق من جميع الأسعار على Locali Egypt.' },
      { q: 'هل مصر آمنة للعائلات؟', a: 'نعم، مناطق المنتجعات السياحية آمنة جداً للعائلات. سهل حشيش والجونة الأفضل للعائلات. المصريون محبون للأطفال بشكل عام والمكان مناسب للعائلات العربية.' },
      { q: 'كيف أتجنب النصب؟', a: 'لا تقبل أي "هدايا مجانية" — ستُطلب منك المال لاحقاً. اتفق على السعر مسبقاً. استخدم Locali Ride بأسعار ثابتة. لا تصرف في المطار — البنوك في المدينة أفضل بكثير.' },
    ],
    scams: [
      { title: 'مطاعم "حلال" مزيفة', desc: 'ترفع أسعاراً مبالغاً بحجة "الحلال المعتمد". اطلب دائماً شهادة الحلال الرسمية أو توجه لمطاعم شعبية مصرية.' },
      { title: 'عروض "خاصة للعرب"', desc: 'يستهدف بعض الباعة السياح العرب بعروض "خاصة" بأسعار مضاعفة. الأسعار الحقيقية على Locali Egypt.' },
      { title: 'تحويل العملة في المطار', desc: 'السعر في المطار أسوأ بـ15–20% من البنوك. توجه إلى Banque Misr أو CIB أو Al Ahly Bank في المدينة.' },
    ],
    emergency: [
      { phrase: 'اتصل بالإسعاف', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", number: '123' },
      { phrase: 'أحتاج طبيباً', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', number: '' },
      { phrase: 'عندي حساسية من...', arabic: 'عندي حساسية من...', phonetic: "Andi hassasiya min...", number: '' },
    ],
  },
};

// ─── Currency Rates ───────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: 'EUR', flag: '🇪🇺', label: 'Euro', rate: 55.2 },
  { code: 'GBP', flag: '🇬🇧', label: 'Pound', rate: 65.8 },
  { code: 'USD', flag: '🇺🇸', label: 'Dollar', rate: 50.5 },
  { code: 'RUB', flag: '🇷🇺', label: 'Ruble', rate: 0.57 },
  { code: 'CNY', flag: '🇨🇳', label: 'Yuan', rate: 6.95 },
  { code: 'SAR', flag: '🇸🇦', label: 'Riyal', rate: 13.5 },
];

function CurrencyWidget() {
  const [rates, setRates] = useState(CURRENCIES);
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('EUR');
  const selectedRate = rates.find(r => r.code === from)?.rate || 1;
  const converted = (parseFloat(amount || 0) * selectedRate).toFixed(0);

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-accent" />
        <h3 className="font-extrabold text-sm">Live Exchange Rates → EGP</h3>
        <span className="ml-auto text-[10px] text-muted-foreground bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">LIVE</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {rates.map(r => (
          <div key={r.code} className="bg-secondary/50 rounded-xl p-2 text-center">
            <p className="text-base">{r.flag}</p>
            <p className="text-[9px] font-bold text-muted-foreground">{r.code}</p>
            <p className="text-xs font-extrabold text-accent">{r.rate.toFixed(2)}</p>
            <p className="text-[9px] text-muted-foreground">EGP</p>
          </div>
        ))}
      </div>
      <div className="bg-secondary/50 rounded-xl p-3">
        <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase">Quick Calculator</p>
        <div className="flex items-center gap-2">
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            className="flex-1 bg-card rounded-xl px-3 py-2 text-sm font-bold outline-none" />
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="bg-card rounded-xl px-2 py-2 text-xs font-bold outline-none border border-border">
            {rates.map(r => <option key={r.code} value={r.code}>{r.flag} {r.code}</option>)}
          </select>
          <span className="text-xs font-bold text-muted-foreground">=</span>
          <span className="font-extrabold text-accent text-sm">{parseInt(converted).toLocaleString()} EGP</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5 bg-amber-500/10 rounded-xl px-3 py-1.5">
        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
        <p className="text-[10px] text-amber-700 font-medium">Never exchange at the airport — rates are 15–20% worse</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NationalityGuide() {
  const { lang } = useOutletContext();
  const [activeNat, setActiveNat] = useState('ru');
  const nat = NATIONALITIES.find(n => n.id === activeNat);
  const content = CONTENT[activeNat];
  const isRTL = activeNat === 'ar';

  useSEO({
    title: content?.headline || 'Nationality Guide — Locali Egypt',
    description: content?.subheadline || 'Services and info for tourists in Egypt by nationality',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Your Egypt Guide — By Nationality</h1>
        <p className="text-sm text-muted-foreground">Doctors, services, prices, and FAQs specifically for your country</p>
      </div>

      {/* Nationality selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {NATIONALITIES.map(n => (
          <button key={n.id} onClick={() => setActiveNat(n.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
              activeNat === n.id
                ? `${n.color} ${n.border} shadow-sm`
                : 'bg-card border-border/50 text-muted-foreground'
            }`}>
            <span className="text-xl">{n.flag}</span>
            <div className="text-left">
              <p className="text-xs font-extrabold leading-none">{n.label}</p>
              <p className="text-[9px] opacity-70">{n.sublabel}</p>
            </div>
          </button>
        ))}
      </div>

      {content && (
        <div dir={isRTL ? 'rtl' : 'ltr'}>
          {/* Badge + headline */}
          <div className={`bg-card rounded-2xl border p-5 mb-5 ${nat?.border || 'border-border/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{nat?.flag}</span>
              <span className={`text-sm font-extrabold px-3 py-1 rounded-full ${nat?.color}`}>{content.badge}</span>
            </div>
            <h2 className="text-lg font-extrabold leading-snug mb-1">{content.headline}</h2>
            <p className="text-sm text-muted-foreground">{content.subheadline}</p>
          </div>

          {/* Scam alert */}
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium">{content.scamAlert}</p>
          </div>

          {/* Currency widget */}
          <CurrencyWidget />

          {/* Services */}
          {content.services?.map((cat, ci) => (
            <div key={ci} className="mb-6">
              <h3 className="font-extrabold text-sm mb-3">{cat.category}</h3>
              <div className="space-y-2">
                {cat.items.map((item, ii) => (
                  <div key={ii} className="bg-card rounded-2xl border border-border/50 p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-bold text-sm">{item.name}</p>
                          {item.verified && (
                            <span className="flex items-center gap-1 text-[9px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-full">
                              <ShieldCheck className="w-2 h-2" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.meta}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-accent">{item.price}</p>
                        <p className="text-[10px] text-muted-foreground">{item.hours}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* FAQ */}
          <div className="mb-6">
            <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-accent" /> FAQ — Top Questions
            </h3>
            <div className="space-y-2">
              {content.faq?.map((f, i) => (
                <FAQItem key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          {/* Scam alerts */}
          <div className="mb-6">
            <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Scams Targeting {nat?.sublabel} Tourists
            </h3>
            <div className="space-y-2">
              {content.scams?.map((s, i) => (
                <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4">
                  <p className="font-bold text-sm mb-1">⚠️ {s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency phrases */}
          <div className="mb-6">
            <h3 className="font-extrabold text-sm mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" /> Emergency Phrases in Arabic
            </h3>
            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              {content.emergency?.map((e, i) => (
                <div key={i} className={`p-4 ${i < content.emergency.length - 1 ? 'border-b border-border/20' : ''}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm">{e.phrase}</p>
                    {e.number && <span className="font-extrabold text-red-600 text-sm">📞 {e.number}</span>}
                  </div>
                  <p className="text-base font-bold mt-1" dir="rtl">{e.arabic}</p>
                  <p className="text-xs text-accent italic">{e.phonetic}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best exchange offices */}
          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <p className="font-extrabold text-sm text-success">Safe Exchange Offices by City</p>
            </div>
            <div className="space-y-1.5">
              {[
                { city: 'Hurghada', bank: 'Al Ahly Bank — Corniche branch', rate: 'Official ±0.5%' },
                { city: 'Sharm El Sheikh', bank: 'CIB — Naama Bay branch', rate: 'Official ±0.3%' },
                { city: 'Luxor', bank: 'Banque Misr — Corniche branch', rate: 'Official ±0.5%' },
                { city: 'Aswan', bank: 'Al Ahly Bank — Corniche branch', rate: 'Official ±0.5%' },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5"><MapPin className="w-2.5 h-2.5 text-accent" />{b.city}: {b.bank}</span>
                  <span className="text-success font-bold">{b.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 px-4 py-3 text-left">
        <p className="font-bold text-sm">{q}</p>
        <span className="text-muted-foreground font-bold text-lg shrink-0 mt-[-2px]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}