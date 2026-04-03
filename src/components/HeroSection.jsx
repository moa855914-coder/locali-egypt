import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../lib/constants';

export default function HeroSection({ lang, onOpenChat }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <img
        src="https://media.base44.com/images/public/69c689e2d4aa000453950c3f/0a9ecf132_generated_b9058818.png"
        alt="Egyptian market street"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
      
      <div className="relative px-4 pt-12 pb-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[0.9]">
            {t('hero_title', lang)}
            <br />
            <span className="text-accent">{t('hero_subtitle', lang)}</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-white/70 max-w-md leading-relaxed">
            {t('hero_desc', lang)}
          </p>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-lg">
            <button
              onClick={onOpenChat}
              className="w-full flex items-center gap-4 px-5 py-4 bg-card/95 backdrop-blur-sm rounded-2xl border border-accent/40 shadow-2xl hover:border-accent hover:bg-card transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{lang === 'ru' ? 'Спроси умного гида!' : lang === 'de' ? 'Frag deinen smarten Guide!' : 'Ask your smart guide! 🇪🇬'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === 'ru' ? 'Рестораны, маршруты, цены, безопасность…' : lang === 'de' ? 'Restaurants, Routen, Preise, Sicherheit…' : 'Restaurants, rides, prices, safety…'}</p>
              </div>
              <div className="flex items-center gap-1 bg-accent/10 rounded-full px-2.5 py-1">
                <Sparkles className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-bold text-accent">AI</span>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}