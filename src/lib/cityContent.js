export const CITY_META = {
  'sharm-el-sheikh': {
    name: 'Sharm El Sheikh',
    region: 'Red Sea',
    lat: 27.9158,
    lng: 34.3300,
    tagline: 'Red Sea diving capital — know before you go',
    intro: 'Sharm El Sheikh is Egypt\'s premier Red Sea resort town. A beautiful destination — but tourists overpay and get scammed daily. This guide gives you the real picture.',
  },
  hurghada: {
    name: 'Hurghada',
    region: 'Red Sea',
    lat: 27.2574,
    lng: 33.8129,
    tagline: 'Egypt\'s most visited resort — navigate it smart',
    intro: 'Hurghada draws millions of tourists each year. The beaches are stunning, the scams are rampant. Use this guide to pay fair prices and avoid the traps.',
  },
  luxor: {
    name: 'Luxor',
    region: 'Upper Egypt',
    lat: 25.6872,
    lng: 32.6396,
    tagline: 'The world\'s greatest open-air museum — on your terms',
    intro: 'Luxor contains more ancient history per square kilometer than anywhere on earth. It also has some of Egypt\'s most aggressive tourist touts. Know the difference.',
  },
  aswan: {
    name: 'Aswan',
    region: 'Upper Egypt',
    lat: 24.0889,
    lng: 32.8998,
    tagline: 'Nubian soul, Nile magic — no nonsense',
    intro: 'Aswan is Egypt\'s most relaxed city. The Nile is at its most beautiful here. Felucca captains will try to overcharge you — but now you know.',
  },
};

export const CITY_PRICES = {
  'sharm-el-sheikh': [
    { item: 'Airport taxi to Naama Bay', local: 80, fair: 150, scam: 500, note: 'Agree upfront. Use Uber/Careem if available.' },
    { item: 'Diving (2 dives, equipment)', local: 700, fair: 1100, scam: 2500, note: 'Book with PADI-certified centers only.' },
    { item: 'Snorkeling day trip', local: 300, fair: 500, scam: 1200, note: 'Includes boat, equipment, and lunch at fair price.' },
    { item: 'Quad biking (1 hour)', local: 400, fair: 700, scam: 1800, note: 'Desert safaris are heavily inflated for tourists.' },
    { item: 'Restaurant meal (mid-range)', local: 120, fair: 200, scam: 600, note: 'Tourist strip prices are naturally 2–3x higher.' },
    { item: 'Water (1.5L bottle)', local: 5, fair: 10, scam: 30, note: 'Buy from supermarkets, not beach vendors.' },
    { item: 'SIM card (15GB data)', local: 130, fair: 160, scam: 400, note: 'Official Vodafone store in the mall. Not airport kiosks.' },
  ],
  hurghada: [
    { item: 'Airport transfer to hotel', local: 80, fair: 150, scam: 500, note: 'Pre-book through hotel or use official taxi stand.' },
    { item: 'Glass-bottom boat trip', local: 200, fair: 350, scam: 900, note: 'Book at the marina, not through hotel reception.' },
    { item: 'Desert safari (4 hours)', local: 400, fair: 750, scam: 1800, note: 'Includes quad, camel, and BBQ at fair price.' },
    { item: 'Parasailing (1 session)', local: 250, fair: 400, scam: 1000, note: 'Fixed price usually posted at the activity stand.' },
    { item: 'Restaurant meal (local)', local: 80, fair: 140, scam: 400, note: 'El Dahar old town has genuine local pricing.' },
    { item: 'Shisha at a café', local: 30, fair: 50, scam: 150, note: 'Tourist strip cafés often charge 3–4x local price.' },
    { item: 'SIM card (Vodafone)', local: 130, fair: 160, scam: 400, note: 'Only buy from official stores. Airport is 2–3x markup.' },
  ],
  luxor: [
    { item: 'Taxi (airport to West Bank)', local: 60, fair: 120, scam: 400, note: 'Negotiate before getting in. Fixed fare is standard.' },
    { item: 'Hot air balloon (1 hour)', local: 1200, fair: 1800, scam: 4000, note: 'Book through certified operators. Price includes pickup.' },
    { item: 'Private Egyptologist guide (full day)', local: 800, fair: 1200, scam: 3000, note: 'Government-licensed guides carry an official badge.' },
    { item: 'Karnak Temple ticket', local: 300, fair: 300, scam: 300, note: 'Fixed government price. There is no "special rate".' },
    { item: 'Valley of Kings ticket', local: 360, fair: 360, scam: 360, note: 'Fixed price. Includes 3 tombs. Extra for Tutankhamun.' },
    { item: 'Calèche (horse carriage, 1 hour)', local: 80, fair: 150, scam: 500, note: 'Agree on price BEFORE getting in. Round trip.' },
    { item: 'Felucca (2 hours on Nile)', local: 100, fair: 200, scam: 600, note: 'Negotiate per hour, not per person.' },
  ],
  aswan: [
    { item: 'Felucca (per hour)', local: 80, fair: 150, scam: 500, note: 'Standard rate for the entire boat, not per person.' },
    { item: 'Abu Simbel day trip (shared bus)', local: 400, fair: 600, scam: 1500, note: 'Book through reputable operators. 3-hour drive each way.' },
    { item: 'Nubian Village boat trip', local: 100, fair: 200, scam: 600, note: 'Includes return ferry. Do not pay per person.' },
    { item: 'Philae Temple ticket', local: 180, fair: 180, scam: 180, note: 'Fixed government price. Boat to the island is separate ~40 EGP.' },
    { item: 'Taxi (airport to city center)', local: 50, fair: 100, scam: 350, note: 'Short distance. Do not pay more than 120 EGP.' },
    { item: 'Restaurant meal (local)', local: 60, fair: 120, scam: 350, note: 'Aswan is cheaper than Luxor and Cairo.' },
    { item: 'Nubian souvenir (hand-made)', local: 50, fair: 100, scam: 300, note: 'Bargaining is expected but stay respectful.' },
  ],
};

export const CITY_SCAMS = {
  'sharm-el-sheikh': [
    { title: 'The "Free" Snorkeling Gear Swap', severity: 'high', desc: 'Vendor offers free snorkel gear, then charges a "cleaning fee" or swaps your good gear for broken equipment after the trip.', avoid: 'Rent only from dive centers with clear pricing boards.' },
    { title: 'Taxi No Meter / Price Change On Arrival', severity: 'high', desc: 'Driver agrees on a price, then claims traffic or extra distance to demand more on arrival.', avoid: 'Screenshot the agreed price or use Uber/Careem.' },
    { title: 'Excursion Upsell on the Boat', severity: 'high', desc: 'You book a snorkeling trip for 200 EGP. On the boat, the crew adds "optional" paid stops, photos, and food — making the real cost 600+.', avoid: 'Ask for FULL itemized pricing before boarding.' },
    { title: 'Fake Perfume Shop Tours', severity: 'medium', desc: 'A friendly local offers to show you a "famous local perfume factory." This is a high-pressure sales trap.', avoid: 'Decline all unsolicited "free tours" or "factory visits."' },
    { title: 'Street Art / Papyrus Gift', severity: 'medium', desc: 'Tourist is handed a "free gift" of a small drawing or papyrus. Once accepted, the vendor demands payment aggressively.', avoid: 'Never accept items from strangers near tourist sites.' },
  ],
  hurghada: [
    { title: 'Airport Transfer Scam', severity: 'high', desc: 'Drivers outside arrivals claiming to be "official" charge 400–600 EGP for trips that should cost 150. They are NOT official.', avoid: 'Use the official taxi desk inside arrivals or pre-book hotel transfer.' },
    { title: 'Money Exchange Shortchange', severity: 'high', desc: 'Exchange bureaus in El Dahar count money quickly and deliberately give the wrong amount, banking on tourist confusion.', avoid: 'Count every note on the spot, in front of them. Never rush.' },
    { title: 'The Extra Person on the Quad', severity: 'medium', desc: 'Quote is "per quad bike." Arrival reveals it\'s "per person per quad," doubling or tripling the price.', avoid: 'Get total price for your group in writing before agreeing.' },
    { title: 'Fake Hotel Upgrades', severity: 'medium', desc: 'Street agents offer hotel upgrades or cheaper rooms. They take a deposit and either disappear or deliver a very different room.', avoid: 'Book only through official hotel websites or verified OTAs.' },
    { title: 'Restaurant "Service" Charges', severity: 'low', desc: 'Bill includes unexplained service charges, bread charges, and cover charges not on the menu.', avoid: 'Ask for the menu with prices BEFORE sitting. Check the bill itemized.' },
  ],
  luxor: [
    { title: 'The Self-Appointed Temple Guide', severity: 'high', desc: 'A man near the temple entrance offers to "help" with tickets or explain history. At the end he demands 500–1000 EGP for the unsolicited service.', avoid: 'Official guides have a government badge. Hire before entering, not at the gate.' },
    { title: 'Hot Air Balloon Safety Scam', severity: 'high', desc: 'Operators with no safety certification offer very cheap balloon rides. Several have crashed with fatalities.', avoid: 'Only book with operators certified by the Egyptian Civil Aviation Authority.' },
    { title: 'Alabaster Factory "Free Visit"', severity: 'high', desc: '"Educational visit" to an alabaster factory becomes an aggressive sales pitch with guides blocking exits until you buy.', avoid: 'Say no to all unsolicited factory or workshop visits.' },
    { title: 'Taxi Meter "Broken"', severity: 'medium', desc: 'Taxi driver claims the meter is broken and negotiates a price 3–5x the normal rate, quoting it in USD to confuse.', avoid: 'Always negotiate in EGP before getting in.' },
    { title: 'Carriage Driver Route Inflation', severity: 'medium', desc: 'Carriage takes a much longer route than needed, then charges for the distance traveled, not the destination.', avoid: 'Agree on price AND destination clearly, with a map if needed.' },
  ],
  aswan: [
    { title: 'Felucca Captain Bait & Switch', severity: 'high', desc: 'Captain quotes per-boat price, arrives at the boat to find it is "per person per hour."', avoid: 'Confirm in writing or with a clear verbal agreement with witnesses.' },
    { title: 'Nubian Souvenir Pressure', severity: 'medium', desc: 'In Nubian villages, children and adults push small items into your hands, then demand payment.', avoid: 'Only browse shops you chose to enter. Do not accept hand-delivered items.' },
    { title: 'Abu Simbel "Private Car" Upgrade', severity: 'medium', desc: 'Driver at hotel offers private car to Abu Simbel. Higher than shared bus, and often drops you off 5km from the site.', avoid: 'Book Abu Simbel transfers through established tour operators only.' },
    { title: 'Fake Police Checkpoint Toll', severity: 'medium', desc: 'In remote areas near temples, men in unofficial uniforms demand a "toll" or "entry fee" for passing through.', avoid: 'Only pay official fees at staffed, signed government booths.' },
  ],
};

export const CITY_FAQS = {
  'sharm-el-sheikh': [
    { q: 'Is Sharm El Sheikh safe for tourists?', a: 'Yes, Sharm El Sheikh is generally safe for tourists. The resort areas are well-policed and security is high. Petty scams are common but violent crime against tourists is very rare.' },
    { q: 'What is the fair taxi price from Sharm airport?', a: 'The fair tourist price for a taxi from Sharm El Sheikh Airport to Naama Bay is 150–200 EGP (about $3–4 USD). Anything above 300 EGP is overcharging.' },
    { q: 'Do I need a visa for Sharm El Sheikh?', a: 'Most nationalities can get a free 15-day visa for the Sinai Peninsula only (including Sharm). For the rest of Egypt, you need a full visa on arrival ($25 USD) or eVisa.' },
    { q: 'What is the best time to visit Sharm El Sheikh?', a: 'October to April offers the most comfortable temperatures (20–28°C). Summer (June–August) is extremely hot (40°C+) but cheapest. Diving visibility is excellent year-round.' },
    { q: 'Can I drink tap water in Sharm El Sheikh?', a: 'No. Never drink tap water in Sharm. Buy sealed bottled water only — 5 EGP at a supermarket, not 30 EGP from a beach vendor.' },
  ],
  hurghada: [
    { q: 'Is Hurghada worth visiting?', a: 'Yes — Hurghada has excellent beaches, world-class diving, and affordable prices IF you know what you\'re doing. This guide exists because most tourists overpay significantly.' },
    { q: 'What is the fair price for a taxi in Hurghada?', a: 'Short trips within Hurghada (up to 10km): 50–80 EGP. Airport to hotel: 120–180 EGP. Never pay more than 300 EGP for any in-town trip.' },
    { q: 'Is Hurghada safe at night?', a: 'The Sahl Hasheesh and Marina areas are well-lit and safe at night. El Dahar old town is generally fine but exercise normal caution after midnight.' },
    { q: 'Which SIM card is best in Hurghada?', a: 'Vodafone and Orange both have good coverage. Buy a 15GB data SIM for around 130–160 EGP at an official store. Avoid airport kiosks.' },
    { q: 'Is Hurghada good for families?', a: 'Yes, extremely. Most resorts are all-inclusive with kids\' clubs, shallow pools, and calm beaches. The Red Sea here is calmer than the Sinai side.' },
  ],
  luxor: [
    { q: 'How many days do you need in Luxor?', a: 'Minimum 2 days to see the East and West Banks properly. 3–4 days is ideal to visit at a relaxed pace without rushing through 3,500-year-old history.' },
    { q: 'What is the real price for a hot air balloon in Luxor?', a: 'The fair tourist price for a certified hot air balloon in Luxor is 1,500–2,000 EGP. Anything below 1,000 EGP is either uncertified or will have hidden add-ons.' },
    { q: 'Do you need a guide at Luxor temples?', a: 'Not mandatory but strongly recommended for context. Hire a government-licensed Egyptologist (identifiable by their official badge) for 800–1,200 EGP/day.' },
    { q: 'Is it safe to cross to the West Bank in Luxor?', a: 'Yes, completely safe. Use the local ferry (5 EGP) or take a taxi. The West Bank has Valley of the Kings, Valley of the Queens, and Medinet Habu.' },
    { q: 'What is the Luxor Pass and is it worth it?', a: 'The Luxor Pass ($100 USD) covers most major sites for 5 days. If you plan to visit more than 5 sites including Valley of the Kings, it saves money.' },
  ],
  aswan: [
    { q: 'What is Aswan best known for?', a: 'Aswan is famous for Abu Simbel temples, Philae Temple, Nubian culture, and the most scenic stretch of the Nile in Egypt. It\'s Egypt\'s southernmost major city.' },
    { q: 'How do I get from Luxor to Aswan?', a: 'Train is the best option: 2–3 hours, 60–150 EGP. The overnight sleeper train is a classic experience. Flying is 1 hour but much more expensive.' },
    { q: 'Is Abu Simbel worth the trip from Aswan?', a: 'Absolutely yes. Abu Simbel is one of the most impressive ancient monuments in the world. It\'s a 3-hour drive each way — go on the early shared convoy bus.' },
    { q: 'What is a fair price for a felucca in Aswan?', a: 'A fair price for a felucca in Aswan is 80–150 EGP per hour for the whole boat (not per person). Insist on this. A 2-hour sunset ride should cost 160–300 EGP total.' },
    { q: 'Is Aswan safe for solo travelers?', a: 'Aswan is one of the safest cities in Egypt for solo travelers. It\'s smaller, less hustling than Luxor or Cairo, and locals are known for genuine hospitality.' },
  ],
};

export const CITY_LISTINGS = {
  'sharm-el-sheikh': {
    restaurants: [
      { name: 'Fares Fish Restaurant', desc: 'No-frills seafood spot beloved by locals and in-the-know tourists. Grilled fish by weight at honest prices.', area: 'Old Market', rating: 4.6, price: '€€', lat: 27.9058, lng: 34.3178, tags: ['seafood', 'local', 'no tourist tax'] },
      { name: 'El Masrien', desc: 'Authentic Egyptian street food — falafel, koshary, ful. Extremely cheap. Mostly Egyptian clientele.', area: 'Hadaba', rating: 4.4, price: '€', lat: 27.9012, lng: 34.3201, tags: ['local', 'budget', 'breakfast'] },
      { name: 'Pomodoro', desc: 'Reliable Italian pizza and pasta. Fair pricing for the area. Popular with Russian and European visitors.', area: 'Naama Bay', rating: 4.2, price: '€€', lat: 27.9162, lng: 34.3289, tags: ['italian', 'pizza', 'family'] },
    ],
    clinics: [
      { name: 'Sharm International Hospital', desc: 'Main hospital serving the area. Multilingual staff including Russian and English. 24/7 emergency.', area: 'Peace Road', rating: 4.0, price: '€€€', lat: 27.9091, lng: 34.3251, tags: ['emergency', 'english', 'russian'] },
      { name: 'Dr. Mostafa Dental Clinic', desc: 'English-speaking dentist. Modern equipment. Fair pricing by local standards. Appointment recommended.', area: 'Hadaba', rating: 4.5, price: '€€', lat: 27.9018, lng: 34.3188, tags: ['dental', 'english speaking', 'appointment'] },
    ],
    transport: [
      { name: 'White Taxi Stand (Official)', desc: 'Official white taxis with regulated fares. Look for the meter. Ask the driver to use it.', area: 'Naama Bay', rating: 3.8, price: '€', lat: 27.9155, lng: 34.3282, tags: ['taxi', 'official', 'metered'] },
      { name: 'Careem / Uber', desc: 'App-based ride-hailing with fixed fares. No negotiation. Download before arriving. Best option.', area: 'Citywide', rating: 4.7, price: '€€', lat: 27.9158, lng: 34.3300, tags: ['app', 'fixed price', 'safe'] },
    ],
    activities: [
      { name: 'Camel Dive Club', desc: 'PADI 5-star dive center. One of the oldest and most respected in Sharm. Multilingual instructors.', area: 'Naama Bay', rating: 4.8, price: '€€€', lat: 27.9171, lng: 34.3294, tags: ['diving', 'PADI', 'certified'] },
      { name: 'Ras Mohammed National Park', desc: 'Stunning coral reefs and desert landscape. Entry ticket 200 EGP. Best snorkeling in the Sinai.', area: 'South Sinai', rating: 4.9, price: '€€', lat: 27.7329, lng: 34.2421, tags: ['snorkeling', 'nature', 'official'] },
    ],
  },
  hurghada: {
    restaurants: [
      { name: 'Felfela Restaurant', desc: 'Egyptian classics done right. Grilled meats, mezze, fresh juices. Locals eat here. Tourists should too.', area: 'El Dahar', rating: 4.5, price: '€€', lat: 27.2574, lng: 33.8085, tags: ['local', 'egyptian', 'authentic'] },
      { name: 'Paprika Restaurant', desc: 'Well-run restaurant with international and Egyptian menu. Good for families. Prices are fair and transparent.', area: 'New Hurghada', rating: 4.3, price: '€€', lat: 27.2401, lng: 33.8211, tags: ['family', 'international', 'reliable'] },
    ],
    clinics: [
      { name: 'Hurghada General Hospital', desc: 'Main public hospital. Long waits but free for emergencies. Good for serious cases.', area: 'El Dahar', rating: 3.5, price: '€', lat: 27.2610, lng: 33.8070, tags: ['emergency', 'public', '24h'] },
      { name: 'Dr. Ahmed Medical Center', desc: 'Private clinic with English and Russian speaking doctors. Covers general medicine and minor emergencies.', area: 'Sahl Hasheesh Road', rating: 4.4, price: '€€', lat: 27.2512, lng: 33.8145, tags: ['private', 'multilingual', 'general medicine'] },
    ],
    transport: [
      { name: 'Careem / Uber', desc: 'Available and reliable in Hurghada. Fixed prices. No bargaining. Recommended over street taxis.', area: 'Citywide', rating: 4.6, price: '€€', lat: 27.2574, lng: 33.8129, tags: ['app', 'safe', 'fixed price'] },
      { name: 'Airport Official Taxi Desk', desc: 'Inside arrivals hall. Fixed price to major areas posted on board. Only use this, not drivers outside.', area: 'Hurghada Airport', rating: 4.0, price: '€€', lat: 27.1769, lng: 33.8036, tags: ['official', 'airport', 'fixed price'] },
    ],
    activities: [
      { name: 'Red Sea Diving Safari', desc: 'Premium liveaboard and day diving operator. Internationally certified crew. Top safety record.', area: 'Hurghada Marina', rating: 4.9, price: '€€€', lat: 27.2396, lng: 33.8317, tags: ['diving', 'liveaboard', 'premium'] },
      { name: 'Makadi Bay Snorkeling Trip', desc: 'Certified boat trip to pristine reef. Life jackets provided. Fixed departure time. No hidden fees.', area: 'Makadi Bay', rating: 4.5, price: '€€', lat: 27.1201, lng: 33.9012, tags: ['snorkeling', 'reef', 'family'] },
    ],
  },
  luxor: {
    restaurants: [
      { name: 'Sofra Restaurant', desc: 'Rooftop Egyptian restaurant in a restored old house. Genuine home cooking. Popular with educated tourists and locals.', area: 'East Bank', rating: 4.7, price: '€€', lat: 25.6995, lng: 32.6450, tags: ['local', 'rooftop', 'authentic'] },
      { name: 'Habiba\'s Kitchen', desc: 'West Bank legend. Mama Habiba cooks daily. Whatever is in the pot, order it. Always honest, always delicious.', area: 'West Bank', rating: 4.8, price: '€', lat: 25.7301, lng: 32.6041, tags: ['local', 'west bank', 'home cooking'] },
    ],
    clinics: [
      { name: 'Luxor International Hospital', desc: '24/7 emergency services. Accepts travel insurance. English-speaking staff available. Best equipped in the area.', area: 'East Bank', rating: 4.1, price: '€€€', lat: 25.6912, lng: 32.6501, tags: ['emergency', '24h', 'insurance'] },
    ],
    transport: [
      { name: 'Local Ferry (East to West Bank)', desc: 'Government-operated passenger ferry. 5 EGP per person. Runs every 30 minutes from 6am to 10pm. Best value in Luxor.', area: 'Corniche', rating: 4.5, price: '€', lat: 25.6981, lng: 32.6387, tags: ['ferry', 'official', 'cheap'] },
      { name: 'Luxor Taxi Association', desc: 'Licensed taxis with official registration. Always negotiate in EGP before departure. Typical city fare: 40–80 EGP.', area: 'Citywide', rating: 3.9, price: '€€', lat: 25.6872, lng: 32.6396, tags: ['taxi', 'negotiable', 'licensed'] },
    ],
    activities: [
      { name: 'Hod Hod Soliman Balloon', desc: 'Certified hot air balloon operator. Safety inspected. Early morning flights over the Valley of the Kings.', area: 'West Bank', rating: 4.8, price: '€€€', lat: 25.7381, lng: 32.6079, tags: ['balloon', 'certified', 'sunrise'] },
      { name: 'Karnak Temple Complex', desc: 'The largest ancient religious complex in the world. Buy tickets at the official booth. Allocate 2–3 hours minimum.', area: 'East Bank', rating: 5.0, price: '€€', lat: 25.7188, lng: 32.6573, tags: ['temple', 'official', 'must-see'] },
    ],
  },
  aswan: {
    restaurants: [
      { name: 'Nubian House Restaurant', desc: 'Authentic Nubian cuisine in a traditional house overlooking the Nile. Ful, tamiya, fish, and local stews.', area: 'Elephantine Island', rating: 4.6, price: '€€', lat: 24.0901, lng: 32.8931, tags: ['nubian', 'nile view', 'authentic'] },
      { name: 'Al Masri Restaurant', desc: 'Egyptian staples on the Corniche. Grilled chicken, rice, salads. Honest pricing. Very popular with local families.', area: 'Corniche', rating: 4.4, price: '€', lat: 24.0881, lng: 32.9001, tags: ['local', 'family', 'cheap'] },
    ],
    clinics: [
      { name: 'Aswan University Hospital', desc: '24/7 emergency. Best-equipped hospital in southern Egypt. Ask for the international patient desk.', area: 'University District', rating: 3.9, price: '€€', lat: 24.0812, lng: 32.9145, tags: ['emergency', '24h', 'public'] },
    ],
    transport: [
      { name: 'Nile Taxi (Motor Boat)', desc: 'Small motorboats that ferry passengers between the east bank, Elephantine Island, and the west bank. 5–10 EGP per trip.', area: 'Corniche', rating: 4.2, price: '€', lat: 24.0889, lng: 32.8998, tags: ['boat', 'nile', 'cheap'] },
      { name: 'Official Taxi Rank', desc: 'Outside the train station. Agree on EGP price before departing. City center trips should cost 30–60 EGP.', area: 'Train Station', rating: 3.8, price: '€€', lat: 24.0869, lng: 32.8994, tags: ['taxi', 'official', 'train station'] },
    ],
    activities: [
      { name: 'Philae Temple (Official)', desc: 'Island temple dedicated to Isis. Take the official boat from the dock (included in ticket). Spectacular sunset lighting.', area: 'Agilkia Island', rating: 4.9, price: '€€', lat: 24.0234, lng: 32.8842, tags: ['temple', 'island', 'official'] },
      { name: 'Abu Simbel Convoy (Official)', desc: 'Official shared bus convoy departs 4am from Aswan. Arrives Abu Simbel 7am. Best value way to see this wonder.', area: 'Aswan Depot', rating: 4.7, price: '€€', lat: 24.0889, lng: 32.8998, tags: ['abu simbel', 'convoy', 'official'] },
    ],
  },
};

export const CITY_TRANSPORT = {
  'sharm-el-sheikh': {
    intro: 'Getting around Sharm El Sheikh requires understanding the taxi system. There are no buses for tourists. Uber and Careem are your safest options.',
    tips: [
      { title: 'Uber / Careem — Use it', desc: 'Both apps operate in Sharm. Fixed, transparent prices. No negotiation, no drama. Download both before you land.' },
      { title: 'White Official Taxis', desc: 'Licensed taxis are white. Always ask for the meter. If "broken," negotiate before moving. Standard short hop: 50–100 EGP.' },
      { title: 'Airport Transfer', desc: 'Pre-book through your hotel, or use the official taxi desk inside arrivals. Do NOT follow anyone who approaches you.' },
      { title: 'Resort Shuttles', desc: 'Many hotels run free shuttles to Naama Bay. Check with your hotel before paying for a taxi.' },
    ],
    safety: 'Never get into an unmarked car. Always confirm price before departure. If using a taxi at night, share your location with someone.',
  },
  hurghada: {
    intro: 'Hurghada is spread out across 40km of coastline. Transport is essential and scams are common. Know the rules.',
    tips: [
      { title: 'Careem is King Here', desc: 'Careem is widely used and trusted in Hurghada. More reliable than Uber in this city. Use it for all non-resort travel.' },
      { title: 'The Microbus (Local Secret)', desc: 'Shared minibuses run along the main road for 5–10 EGP. Locals use them. Not for tourists with luggage but fine for solo travel.' },
      { title: 'Hotel Transfer vs. Street Taxi', desc: 'Hotel transfers are overpriced but safe. Street taxis outside the airport are the highest risk. Use the official airport taxi desk.' },
      { title: 'Renting a Car', desc: 'Possible but not recommended for first-timers. Egyptian traffic is chaotic. A driver-guide for the day (400–600 EGP) is a smarter option.' },
    ],
    safety: 'The airport approach road has the highest concentration of scam taxis. Always walk to the official desk inside the terminal.',
  },
  luxor: {
    intro: 'Luxor is split between the East Bank (hotels, city) and West Bank (temples, tombs). Getting between them is easy and cheap.',
    tips: [
      { title: 'The Local Ferry: 5 EGP', desc: 'The passenger ferry across the Nile is the single best-value transport in all of Egypt. 5 EGP per person. Runs until 10pm.' },
      { title: 'Calèche (Horse Carriage)', desc: 'Traditional and scenic but requires negotiation. Agree on a full round-trip price in EGP before starting. Standard: 100–200 EGP.' },
      { title: 'Taxi Negotiation Rules', desc: 'Negotiate in EGP. Refuse USD quotes — they\'re always higher. City trips: 40–80 EGP. Airport: 80–120 EGP.' },
      { title: 'Renting a Bicycle', desc: 'The West Bank is flat and perfect for cycling. Rent a bike for 80–120 EGP/day from guesthouses near the ferry landing.' },
    ],
    safety: 'Avoid unlicensed guides who approach you near ticket booths. The temple sites have official guides at controlled areas.',
  },
  aswan: {
    intro: 'Aswan is the smallest and easiest city to navigate in this guide. The Nile is your main highway — boats replace taxis for many trips.',
    tips: [
      { title: 'Motor Boats (Nile Taxi)', desc: 'Short boat trips across the Nile cost 5–15 EGP. Board from the Corniche. Agree on price for the trip, not per person.' },
      { title: 'Felucca for Longer Trips', desc: 'Traditional sailing boats for Nile cruising. Beautiful but slow. For a simple sunset trip, 1.5 hours is enough. 150–200 EGP total.' },
      { title: 'Walking the Corniche', desc: 'Aswan\'s Corniche (riverside promenade) connects most hotels, restaurants, and the ferry dock. Many sights are walkable from here.' },
      { title: 'Abu Simbel: Convoy Only', desc: 'The 4am official convoy is the only legal land route to Abu Simbel. Individual travel outside the convoy is not permitted.' },
    ],
    safety: 'Aswan is Egypt\'s most relaxed city. Still negotiate all felucca and taxi prices before departure.',
  },
};

export const CITY_ATM = {
  'sharm-el-sheikh': {
    intro: 'ATMs are widely available in Naama Bay and near hotels. Egyptian Pound (EGP) is the only currency you should use for daily transactions.',
    tips: [
      'Use ATMs inside banks or hotels — avoid standalone ATMs in dark locations.',
      'Daily withdrawal limit is typically 5,000–10,000 EGP per card.',
      'Your home bank will charge international fees (2–4%). Factor this in.',
      'Currency exchange is available everywhere but rates vary wildly. Compare first.',
      'Do NOT exchange money with street touts — always illegal, often counterfeit.',
      'USD and EUR are widely accepted in hotels but the EGP rate will be unfavorable.',
    ],
    bestATMs: ['Banque Misr (Naama Bay)', 'CIB ATM (Naama Bay Mall)', 'HSBC (Peace Road)'],
    avoidList: ['Standalone ATMs with no bank branding', 'ATMs near crowded markets (card skimming risk)'],
    rate: '1 USD ≈ 50 EGP (approximate — check live rate before traveling)',
  },
  hurghada: {
    intro: 'Hurghada has good ATM coverage in the Marina, Sahl Hasheesh, and El Dahar. The old town has fewer options.',
    tips: [
      'Banque Misr and CIB are the most reliable and tourist-friendly.',
      'ATMs at the airport have high fees — use in emergencies only.',
      'Some all-inclusive resorts accept card but charge a surcharge. Ask first.',
      'Keep 500–1,000 EGP cash on you at all times for markets and tips.',
      'Count money at the exchange desk before leaving. Errors "happen" frequently.',
      'Official bank exchange rates are always better than street money changers.',
    ],
    bestATMs: ['Banque Misr (Marina)', 'CIB (Sahl Hasheesh)', 'NBE ATM (El Dahar)'],
    avoidList: ['Airport standalone kiosks', 'Exchange windows near tourist sites'],
    rate: '1 EUR ≈ 54 EGP (approximate — check live rate before traveling)',
  },
  luxor: {
    intro: 'Luxor has reliable ATMs on the East Bank near the Corniche. The West Bank has very limited ATM access — withdraw before crossing.',
    tips: [
      'Withdraw cash before taking the ferry to the West Bank. No ATMs near the tombs.',
      'Banque Misr on the Corniche is the most reliable option.',
      'Most temples, tickets, and guides are cash only.',
      'Tipping is expected and adds up — keep small bills (5, 10, 20 EGP) available.',
      'Hotel currency exchange desks are convenient but offer worse rates.',
      'The Luxor Pass can be purchased in USD cash — have it ready.',
    ],
    bestATMs: ['Banque Misr (Corniche)', 'NBE (Luxor Temple Road)', 'CIB (East Bank)'],
    avoidList: ['West Bank has no reliable ATMs — stock up on East Bank'],
    rate: '1 GBP ≈ 63 EGP (approximate — check live rate before traveling)',
  },
  aswan: {
    intro: 'Aswan has limited but functional ATM access on the Corniche. Cash is essential here, especially for feluccas and market purchases.',
    tips: [
      'The Corniche has the best ATM cluster — use Banque Misr or NBE.',
      'The train station area also has ATMs if you\'re arriving by rail.',
      'Abu Simbel has no ATMs. Bring all cash you need for the day.',
      'Felucca captains, market vendors, and ferry operators are cash only.',
      'Nubian village trips and island restaurants rarely accept cards.',
      'Withdraw enough for your whole stay on arrival — Aswan supply can run out.',
    ],
    bestATMs: ['Banque Misr (Corniche)', 'NBE (Train Station area)', 'Egyptian Arab Land Bank (Corniche)'],
    avoidList: ['No ATMs on Elephantine Island or Abu Simbel'],
    rate: '1 USD ≈ 50 EGP (approximate — check live rate before traveling)',
  },
};

export const CITY_SAFETY = {
  'sharm-el-sheikh': {
    rating: 'Generally Safe',
    ratingLevel: 'medium-low',
    overview: 'Sharm El Sheikh is heavily secured by Egyptian authorities due to its tourism importance. Violent crime against tourists is extremely rare. The main risks are petty scams, overcharging, and minor theft.',
    tips: [
      { type: 'safe', text: 'Resort areas and Naama Bay are well-lit and patrolled.' },
      { type: 'safe', text: 'Sinai visa allows entry without full Egypt visa.' },
      { type: 'caution', text: 'Be aware of your belongings on busy beach strips.' },
      { type: 'caution', text: 'Verify any excursion operator is officially licensed.' },
      { type: 'warning', text: 'Do not travel beyond resort areas without local advice on current Sinai conditions.' },
      { type: 'warning', text: 'Swimming: Respect all red flags. Red Sea currents can be deadly.' },
    ],
  },
  hurghada: {
    rating: 'Safe for Tourists',
    ratingLevel: 'low',
    overview: 'Hurghada is one of Egypt\'s most tourist-friendly cities. The main threat is financial scams, not personal safety. Standard big-city caution applies.',
    tips: [
      { type: 'safe', text: 'Tourist areas are well-policed and cameras are everywhere.' },
      { type: 'safe', text: 'All-inclusive resorts are very secure environments.' },
      { type: 'caution', text: 'El Dahar old town: exercise normal street awareness after midnight.' },
      { type: 'caution', text: 'Jet ski and watersports: insist on a signed safety briefing.' },
      { type: 'warning', text: 'Always swim at designated beach areas with lifeguard presence.' },
    ],
  },
  luxor: {
    rating: 'Safe with Awareness',
    ratingLevel: 'medium',
    overview: 'Luxor is safe but has the highest concentration of aggressive touts and scammers of any city in this guide. Stay alert, be firm, and you will have a great trip.',
    tips: [
      { type: 'safe', text: 'Tourist police are stationed at all major sites.' },
      { type: 'safe', text: 'Hotels and guesthouses are reliable and honest on the whole.' },
      { type: 'caution', text: 'Approach to Karnak and Valley of Kings has persistent touts — a firm "no" is your weapon.' },
      { type: 'caution', text: 'Unlicensed guides are common. Only hire those with an official government badge.' },
      { type: 'warning', text: 'Night travel on the West Bank: use a hotel-arranged car.' },
      { type: 'warning', text: 'Balloon rides: ONLY book certified operators. Fatal accidents have occurred with uncertified companies.' },
    ],
  },
  aswan: {
    rating: 'Very Safe',
    ratingLevel: 'low',
    overview: 'Aswan is Egypt\'s most relaxed and safest tourist destination. The Nubian people are genuinely welcoming. Scams exist but are milder than other cities.',
    tips: [
      { type: 'safe', text: 'Aswan has very little petty crime compared to other Egyptian cities.' },
      { type: 'safe', text: 'Felucca trips on the Nile are safe and a wonderful experience.' },
      { type: 'caution', text: 'Always negotiate felucca and boat prices before boarding.' },
      { type: 'caution', text: 'Abu Simbel road: only travel on the official convoy, not privately.' },
      { type: 'warning', text: 'The desert around Aswan is extreme. Never hike without a guide and plenty of water.' },
    ],
  },
};