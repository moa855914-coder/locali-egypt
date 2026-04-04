import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { t } from '../lib/constants';

const FOOTER_LINKS = [
  { label: 'Services', path: '/services' },
  { label: 'Price Checker', path: '/price-checker' },
  { label: 'Emergency', path: '/emergency' },
  { label: 'AI Guide', path: '/ai-assistant' },
  { label: 'Deals', path: '/deals' },
  { label: 'Scam Map', path: '/scam-map' },
  { label: 'Terms & Conditions', path: '/terms' },
];

export default function Footer({ lang = 'en' }) {
  return (
    <footer className="mt-16 border-t border-border/50 bg-card">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Logo + tagline */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-extrabold tracking-tight text-foreground">Locali Egypt</span>
        </div>
        <p className="text-xs text-muted-foreground mb-6 max-w-sm leading-relaxed">
          Your multilingual survival guide for Egypt. Real prices, scam alerts, verified services — always up to date.
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language row */}
        <div className="flex flex-wrap gap-3 mb-6">
          {['EN', 'FR', 'RU', 'DE'].map((l) => (
            <span key={l} className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {l}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-border/30 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">{t('copyright', lang)}</p>
          <Link to="/terms" className="text-[11px] text-muted-foreground hover:text-accent transition-colors underline underline-offset-2">
            {t('terms', lang)}
          </Link>
        </div>
      </div>
    </footer>
  );
}