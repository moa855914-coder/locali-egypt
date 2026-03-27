import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageSquare, Volume2 } from 'lucide-react';

const PHRASE_CATEGORIES = [
  { id: 'essential', label: 'Essential' },
  { id: 'shopping', label: 'Shopping & Bargaining' },
  { id: 'transport', label: 'Transport' },
  { id: 'food', label: 'Food & Dining' },
  { id: 'emergency', label: 'Emergency' },
];

const PHRASES = [
  { cat: 'essential', en: 'No, thank you', arabic: 'لا شكراً', phonetic: 'La shukran' },
  { cat: 'essential', en: 'How much?', arabic: 'بكام؟', phonetic: 'Bikam?' },
  { cat: 'essential', en: 'Yes', arabic: 'أيوا', phonetic: 'Aiwa' },
  { cat: 'essential', en: 'No', arabic: 'لا', phonetic: 'La' },
  { cat: 'essential', en: 'Please', arabic: 'من فضلك', phonetic: 'Min fadlak' },
  { cat: 'essential', en: 'Thank you', arabic: 'شكراً', phonetic: 'Shukran' },
  { cat: 'essential', en: 'Excuse me', arabic: 'لو سمحت', phonetic: 'Law samaht' },
  { cat: 'essential', en: 'I don\'t understand', arabic: 'أنا مش فاهم', phonetic: 'Ana mish fahem' },
  { cat: 'essential', en: 'Where is...?', arabic: 'فين...؟', phonetic: 'Fein...?' },
  { cat: 'shopping', en: 'Too expensive', arabic: 'غالي أوي', phonetic: 'Ghali awi' },
  { cat: 'shopping', en: 'Can you lower the price?', arabic: 'ممكن أقل؟', phonetic: 'Mumkin a\'al?' },
  { cat: 'shopping', en: 'What is the final price?', arabic: 'آخر سعر؟', phonetic: 'Akher se\'r?' },
  { cat: 'shopping', en: 'I\'m just looking', arabic: 'أنا بتفرج بس', phonetic: 'Ana batfarag bas' },
  { cat: 'shopping', en: 'I don\'t want it', arabic: 'مش عايز', phonetic: 'Mish ayez' },
  { cat: 'transport', en: 'Take me to...', arabic: 'وديني...', phonetic: 'Waddeeni...' },
  { cat: 'transport', en: 'Stop here', arabic: 'وقف هنا', phonetic: 'Wa\'af hena' },
  { cat: 'transport', en: 'Use the meter', arabic: 'شغّل العداد', phonetic: 'Shaghghal el-addad' },
  { cat: 'transport', en: 'How far is it?', arabic: 'بعيد أوي؟', phonetic: 'Ba\'eed awi?' },
  { cat: 'food', en: 'The bill please', arabic: 'الحساب لو سمحت', phonetic: 'El-hesab law samaht' },
  { cat: 'food', en: 'Water', arabic: 'ميّة', phonetic: 'Maya' },
  { cat: 'food', en: 'No sugar', arabic: 'من غير سكر', phonetic: 'Min gheir sukkar' },
  { cat: 'food', en: 'Delicious', arabic: 'حلو أوي', phonetic: 'Helw awi' },
  { cat: 'emergency', en: 'Help!', arabic: 'الحقوني!', phonetic: 'El-ha\'ooni!' },
  { cat: 'emergency', en: 'I need a doctor', arabic: 'عايز دكتور', phonetic: 'Ayez doctor' },
  { cat: 'emergency', en: 'Call the police', arabic: 'اتصل بالبوليس', phonetic: 'Ettesel bel-bolees' },
  { cat: 'emergency', en: 'I\'m lost', arabic: 'أنا تهت', phonetic: 'Ana toht' },
];

export default function Phrases() {
  const { lang } = useOutletContext();
  const [selectedCat, setSelectedCat] = useState('essential');

  const filtered = PHRASES.filter(p => p.cat === selectedCat);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-teal-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Arabic Survival Kit</h1>
          <p className="text-sm text-muted-foreground">Practical phrases you'll actually use</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {PHRASE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCat === cat.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Phrases */}
      <div className="space-y-3">
        {filtered.map((phrase, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <p className="text-sm font-bold mb-2">{phrase.en}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground" dir="rtl">{phrase.arabic}</p>
                <p className="text-sm text-accent font-semibold mt-1">{phrase.phonetic}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}