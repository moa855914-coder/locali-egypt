import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../lib/constants';

export default function HeroSection({ lang }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/services?q=${encodeURIComponent(query)}`);
    }
  };

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

        <motion.form
          onSubmit={handleSearch}
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_placeholder', lang)}
              className="w-full pl-12 pr-4 py-4 bg-card/95 backdrop-blur-sm rounded-2xl border border-border/50 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent shadow-2xl"
            />
          </div>
        </motion.form>
      </div>
    </div>
  );
}