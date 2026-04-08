import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Send, User, AlertCircle } from 'lucide-react';
import { useSEO } from '../lib/seo';

const LOCALS = [
  {
    id: 'gb',
    flag: '🇬🇧',
    name: 'Sarah M.',
    nationality: 'British',
    lang_match: 'en',
    city: 'Hurghada',
    years: 9,
    languages: ['English', 'Arabic (basic)'],
    topics: ['Diving & water sports', 'Where NOT to eat', 'Living costs', 'Scam prevention', 'Family travel'],
    intro: 'Moved to Hurghada for love, stayed for the Red Sea. I know every dive site and every tourist trap.',
    verified: true,
  },
  {
    id: 'ru',
    flag: '🇷🇺',
    name: 'Dmitri K.',
    nationality: 'Russian',
    lang_match: 'ru',
    city: 'Hurghada',
    years: 12,
    languages: ['Russian', 'English', 'Arabic'],
    topics: ['Russian tourist tips', 'SIM cards', 'Long-stay housing', 'Healthcare', 'Schools'],
    intro: 'Came in 2012, never left. I know the expat Russian community and all the real prices.',
    verified: true,
  },
  {
    id: 'fr',
    flag: '🇫🇷',
    name: 'Amélie D.',
    nationality: 'French',
    lang_match: 'fr',
    city: 'Luxor',
    years: 7,
    languages: ['French', 'Arabic', 'English'],
    topics: ['Archaeological sites', 'French-friendly restaurants', 'Women traveling solo', 'Hidden gems'],
    intro: 'Egyptologist by training, Luxor resident by choice. I know every tomb and every honest taxi driver.',
    verified: true,
  },
  {
    id: 'de',
    flag: '🇩🇪',
    name: 'Klaus B.',
    nationality: 'German',
    lang_match: 'de',
    city: 'El Gouna',
    years: 6,
    languages: ['German', 'English', 'Arabic (intermediate)'],
    topics: ['El Gouna living', 'Kitesurfing', 'German medical care', 'Property & long stay', 'Cycling'],
    intro: 'Retired to El Gouna 6 years ago. I know every hotel, every kite school, and every good doctor.',
    verified: true,
  },
  {
    id: 'it',
    flag: '🇮🇹',
    name: 'Marco F.',
    nationality: 'Italian',
    lang_match: 'it',
    city: 'Sharm El Sheikh',
    years: 11,
    languages: ['Italian', 'English', 'Arabic'],
    topics: ['Diving (PADI instructor)', 'Italian restaurants', 'Desert safaris', 'Sinai hiking', 'Nightlife'],
    intro: 'Dive instructor since 2013. I know every reef in Sharm and every real price in Naama Bay.',
    verified: true,
  },
  {
    id: 'es',
    flag: '🇪🇸',
    name: 'Carmen R.',
    nationality: 'Spanish',
    lang_match: 'es',
    city: 'Aswan',
    years: 5,
    languages: ['Spanish', 'French', 'English', 'Arabic'],
    topics: ['Nubian culture', 'Nile cruises', 'Local food', 'Women\'s solo travel', 'Photography'],
    intro: 'Cultural anthropologist who fell in love with Nubian Aswan. I know things no guidebook mentions.',
    verified: true,
  },
  {
    id: 'cn',
    flag: '🇨🇳',
    name: 'Wei L.',
    nationality: 'Chinese',
    lang_match: 'zh',
    city: 'Cairo / Hurghada',
    years: 8,
    languages: ['Chinese (Mandarin)', 'English', 'Arabic'],
    topics: ['Chinese tourist tips', 'Safe group travel', 'Medical in Egypt', 'WeChat Pay / Alipay', 'Halal food'],
    intro: 'Business owner based between Cairo and Hurghada. I guide Chinese tourists through everything.',
    verified: true,
  },
];

const NATIONALITIES = [
  { flag: '🇬🇧', label: 'British / English', match: 'gb' },
  { flag: '🇷🇺', label: 'Russian', match: 'ru' },
  { flag: '🇩🇪', label: 'German', match: 'de' },
  { flag: '🇫🇷', label: 'French', match: 'fr' },
  { flag: '🇮🇹', label: 'Italian', match: 'it' },
  { flag: '🇪🇸', label: 'Spanish / Latin American', match: 'es' },
  { flag: '🇨🇳', label: 'Chinese', match: 'cn' },
  { flag: '🇵🇱', label: 'Polish', match: 'gb' },
  { flag: '🇺🇦', label: 'Ukrainian', match: 'ru' },
  { flag: '🇸🇦', label: 'Arabic-speaking', match: 'gb' },
  { flag: '🌍', label: 'Other / English speaker', match: 'gb' },
];

function ChatWindow({ local, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'local',
      text: `Hi! I'm ${local.name}. I've lived in ${local.city} for ${local.years} years. Ask me anything about Egypt — real tips, no tourist traps. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const QUICK_QUESTIONS = [
    'What\'s the real taxi price from the airport?',
    'Which restaurants do locals actually go to?',
    'What are the biggest scams I should avoid?',
    'Is it safe to travel alone?',
    'What should I pack?',
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    // Simulate a local response (AI-backed in production)
    await new Promise(r => setTimeout(r, 1200));

    const responses = [
      `Great question! As someone who's lived in ${local.city} for ${local.years} years — here's the honest answer: the tourist price is usually 2–3x the local price. Always agree on a price before you get in any taxi or take any tour. What else can I help with?`,
      `From my experience in ${local.city}: the best local tip I can give you is to avoid anything near the main tourist entrance. Walk 200m away and prices drop immediately. Check the listings on Locali Egypt for verified options!`,
      `I get asked this a lot! The short answer: ${local.city} is very safe for tourists in the main areas. The real risk is financial scams, not violence. Stay aware, don't follow strangers into shops, and you'll be fine.`,
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    setMessages(prev => [...prev, { role: 'local', text: reply }]);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-lg">{local.flag}</div>
            <div>
              <p className="font-bold text-sm">{local.name} — {local.city}</p>
              <p className="text-[10px] text-muted-foreground">{local.years} years in Egypt · {local.languages[0]} speaker</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">✕</button>
        </div>

        {/* Disclaimer */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-start gap-2">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700">This is a platform guide only. No personal contact info is shared. All recommendations link to Locali Egypt verified listings.</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'local' && (
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-sm shrink-0">{local.flag}</div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-sm">{local.flag}</div>
              <div className="bg-secondary rounded-2xl px-3 py-2 text-sm text-muted-foreground">Typing…</div>
            </div>
          )}
        </div>

        {/* Quick questions */}
        <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto hide-scrollbar">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              className="shrink-0 text-[10px] bg-secondary border border-border px-2 py-1 rounded-full hover:bg-accent/10 hover:border-accent/30 transition-colors">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask anything about Egypt…"
            className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm outline-none"
          />
          <button onClick={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            className="w-9 h-9 bg-accent text-accent-foreground rounded-xl flex items-center justify-center disabled:opacity-40">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AskALocal() {
  const { lang } = useOutletContext();
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [activeLocal, setActiveLocal] = useState(null);

  useSEO({
    title: 'Ask a Local — Get Honest Egypt Travel Advice from Expats | Locali Egypt',
    description: 'Chat with verified expats living in Egypt. Get honest answers in your language about prices, scams, food, safety, and more. Free on Locali Egypt.',
  });

  const matchedLocal = selectedNationality
    ? LOCALS.find(l => l.id === selectedNationality.match) || LOCALS[0]
    : null;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-6 h-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Ask a Local</h1>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get honest Egypt travel advice from verified expats who live there — in your language. No sales pitch. No tourist traps. Just real answers.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { step: '1', text: 'Select your nationality' },
          { step: '2', text: 'Get matched with a local expat' },
          { step: '3', text: 'Chat inside the platform only' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-3 text-center">
            <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground text-sm font-extrabold flex items-center justify-center mx-auto mb-2">{s.step}</div>
            <p className="text-xs text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Nationality selector */}
      {!selectedNationality ? (
        <div>
          <h2 className="text-base font-extrabold mb-4">Where are you from?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NATIONALITIES.map((n, i) => (
              <button key={i} onClick={() => setSelectedNationality(n)}
                className="flex items-center gap-2 bg-card border border-border rounded-xl p-3 hover:border-accent/50 hover:bg-accent/5 transition-all text-left">
                <span className="text-xl">{n.flag}</span>
                <span className="text-xs font-semibold">{n.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold">Your matched local</h2>
            <button onClick={() => setSelectedNationality(null)} className="text-xs text-muted-foreground underline">Change nationality</button>
          </div>

          {/* Matched local card */}
          {matchedLocal && (
            <div className="bg-card border-2 border-accent/30 rounded-2xl overflow-hidden mb-6">
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl shrink-0">
                    {matchedLocal.flag}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-lg">{matchedLocal.name}</h3>
                      {matchedLocal.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{matchedLocal.nationality} · Living in {matchedLocal.city} · {matchedLocal.years} years</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {matchedLocal.languages.map((l, i) => (
                        <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{l}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic">"{matchedLocal.intro}"</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Can help with</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedLocal.topics.map((t, i) => (
                      <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">✓ {t}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-3 mb-4 text-xs text-muted-foreground">
                  <strong className="text-foreground">⚠️ Platform rules:</strong> This local can recommend services and answer questions only through this platform. No personal phone numbers, email, or external contact is shared. They do not offer private tours.
                </div>

                <button
                  onClick={() => setActiveLocal(matchedLocal)}
                  className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask {matchedLocal.name.split(' ')[0]} Now
                </button>
              </div>
            </div>
          )}

          {/* All locals */}
          <h3 className="text-sm font-extrabold mb-3 text-muted-foreground">All available locals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LOCALS.map(local => (
              <div key={local.id} className={`bg-card border rounded-2xl p-4 cursor-pointer hover:border-accent/40 transition-all ${matchedLocal?.id === local.id ? 'border-accent/40 bg-accent/5' : 'border-border/50'}`}
                onClick={() => setActiveLocal(local)}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{local.flag}</span>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-sm">{local.name}</p>
                      {local.verified && <ShieldCheck className="w-3 h-3 text-success" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{local.city} · {local.years} yrs</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {local.topics.slice(0, 3).map((t, i) => (
                    <span key={i} className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeLocal && (
        <ChatWindow local={activeLocal} onClose={() => setActiveLocal(null)} />
      )}
    </div>
  );
}