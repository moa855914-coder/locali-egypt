import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckSquare, Check, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeNextStep from '../components/SafeNextStep';

const CHECKLIST = [
  { category: 'Before Departure', items: [
    { id: 1, text: 'Check visa requirements — most nationalities get visa on arrival ($25 USD)' },
    { id: 2, text: 'Download offline maps (Google Maps / Maps.me) for your destination city' },
    { id: 3, text: 'Notify your bank about travel to Egypt to avoid card blocks' },
    { id: 4, text: 'Get travel insurance (medical coverage is essential)' },
    { id: 5, text: 'Exchange some USD/EUR cash — you\'ll need it on arrival' },
  ]},
  { category: 'At the Airport', items: [
    { id: 6, text: 'Skip the "helpers" offering to carry your bags — they expect large tips' },
    { id: 7, text: 'Buy a SIM card at the official Vodafone/Orange kiosk (not random vendors)' },
    { id: 8, text: 'Use the ATM inside the airport — better rates than exchange counters' },
    { id: 9, text: 'Book official airport transfer or use a verified app (Uber/Careem)' },
    { id: 10, text: 'Keep passport, visa receipt, and hotel booking confirmation accessible' },
  ]},
  { category: 'First Day', items: [
    { id: 11, text: 'Learn key Arabic phrases: "La shukran" (No thank you), "Bikam?" (How much?)' },
    { id: 12, text: 'Check real prices on Locali before buying anything' },
    { id: 13, text: 'Save Tourist Police number: 126' },
    { id: 14, text: 'Agree on taxi prices BEFORE getting in' },
    { id: 15, text: 'Register your SIM card within 24 hours or it will be deactivated' },
  ]},
];

export default function BeforeYouLand() {
  const { lang } = useOutletContext();
  const [checked, setChecked] = useState(new Set());

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalItems = CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
          <CheckSquare className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Before You Land</h1>
          <p className="text-sm text-muted-foreground">Step-by-step arrival guide</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold">{checked.size}/{totalItems} completed</span>
          <span className="text-xs font-bold text-accent">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-6">
        {CHECKLIST.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-extrabold mb-3">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all min-h-[56px] ${
                    checked.has(item.id)
                      ? 'bg-success/5 border border-success/20'
                      : 'bg-card border border-border/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                    checked.has(item.id) ? 'bg-success' : 'border-2 border-border'
                  }`}>
                    <AnimatePresence>
                      {checked.has(item.id) && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`text-sm leading-relaxed ${
                    checked.has(item.id) ? 'text-muted-foreground line-through' : 'font-medium'
                  }`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <SafeNextStep
          title="Check Real Prices"
          description="Know what everything costs before you arrive"
          to="/price-checker"
        />
      </div>
    </div>
  );
}