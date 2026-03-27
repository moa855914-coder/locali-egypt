import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calculator, Minus, Plus } from 'lucide-react';
import { t } from '../lib/constants';
import { motion } from 'framer-motion';

const ACCOMMODATION = [
  { label: 'Hostel', daily: 400 },
  { label: 'Budget Hotel', daily: 800 },
  { label: 'Mid-range Hotel', daily: 1800 },
  { label: 'Luxury Resort', daily: 5000 },
];

const ACTIVITIES_LIST = [
  { label: 'Diving (per session)', cost: 1500 },
  { label: 'Desert Safari', cost: 1200 },
  { label: 'Nile Cruise (per day)', cost: 3000 },
  { label: 'Temple Tour', cost: 800 },
  { label: 'Snorkeling Trip', cost: 600 },
  { label: 'Quad Biking', cost: 800 },
];

export default function CostCalculator() {
  const { lang } = useOutletContext();
  const [days, setDays] = useState(5);
  const [accommodation, setAccommodation] = useState(1);
  const [meals, setMeals] = useState(3);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const toggleActivity = (idx) => {
    setSelectedActivities(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const accomTotal = days * ACCOMMODATION[accommodation].daily;
  const mealTotal = days * meals * 200;
  const transportTotal = days * 300;
  const activitiesTotal = selectedActivities.reduce((sum, idx) => sum + ACTIVITIES_LIST[idx].cost, 0);
  const total = accomTotal + mealTotal + transportTotal + activitiesTotal;
  const totalUSD = Math.round(total / 50);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('cost_calculator', lang)}</h1>
          <p className="text-sm text-muted-foreground">Estimate your Egypt trip cost</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Days */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Number of Days</label>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => setDays(Math.max(1, days - 1))} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-4xl font-black w-16 text-center">{days}</span>
            <button onClick={() => setDays(days + 1)} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Accommodation</label>
          <div className="grid grid-cols-2 gap-2">
            {ACCOMMODATION.map((a, i) => (
              <button
                key={a.label}
                onClick={() => setAccommodation(i)}
                className={`p-3 rounded-xl text-left transition-all ${
                  accommodation === i
                    ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <p className="text-xs font-bold">{a.label}</p>
                <p className="text-lg font-extrabold mt-1">{a.daily} <span className="text-xs font-normal">EGP/night</span></p>
              </button>
            ))}
          </div>
        </div>

        {/* Meals per day */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Meals per Day</label>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => setMeals(Math.max(0, meals - 1))} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-4xl font-black w-16 text-center">{meals}</span>
            <button onClick={() => setMeals(meals + 1)} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">~200 EGP avg per meal</p>
        </div>

        {/* Activities */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Activities (optional)</label>
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITIES_LIST.map((act, i) => (
              <button
                key={act.label}
                onClick={() => toggleActivity(i)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedActivities.includes(i)
                    ? 'bg-accent text-accent-foreground ring-2 ring-accent'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <p className="text-xs font-bold">{act.label}</p>
                <p className="text-sm font-extrabold mt-1">{act.cost} EGP</p>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <motion.div
          className="bg-primary text-primary-foreground rounded-2xl p-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          key={total}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <p className="text-xs font-bold opacity-60 mb-1">Estimated Total ({days} days)</p>
          <p className="text-4xl font-black">{total.toLocaleString()} EGP</p>
          <p className="text-lg font-bold opacity-70">≈ ${totalUSD} USD</p>

          <div className="mt-4 space-y-2 text-xs opacity-70">
            <div className="flex justify-between">
              <span>Accommodation</span>
              <span>{accomTotal.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Food</span>
              <span>{mealTotal.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Transport</span>
              <span>{transportTotal.toLocaleString()} EGP</span>
            </div>
            {activitiesTotal > 0 && (
              <div className="flex justify-between">
                <span>Activities</span>
                <span>{activitiesTotal.toLocaleString()} EGP</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}