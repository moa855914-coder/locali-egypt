import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function TopBar({ lang, onLangChange }) {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Locali
          </span>
          <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
            Egypt
          </span>
        </Link>
        <LanguageSwitcher lang={lang} onChange={onLangChange} />
      </div>
    </header>
  );
}