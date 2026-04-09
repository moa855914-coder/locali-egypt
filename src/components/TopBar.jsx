import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, DollarSign, AlertTriangle, Search, Phone, Sparkles, ShieldCheck } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { t } from '../lib/constants';
import { useAuth } from '../lib/AuthContext';

const NAV_LINKS = [
  { path: '/services', labelKey: 'services', icon: Search },
  { path: '/price-checker', labelKey: 'price_checker', icon: DollarSign },
  { path: '/scam-map', labelKey: 'scam_map', icon: AlertTriangle },
  { path: '/deals', labelKey: 'deals', icon: Sparkles },
  { path: '/emergency', labelKey: 'emergency', icon: Phone },
];

export default function TopBar({ lang, onLangChange }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-xl border-b-2 border-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.10)]">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
            <Shield className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-foreground">Locali</span>
          <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Egypt</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ path, labelKey }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                location.pathname === path
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              {t(labelKey, lang)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher lang={lang} onChange={onLangChange} />
          {isAdmin && (
            <Link
              to="/admin/verify"
              className="hidden md:flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
          <Link
            to="/emergency"
            className="hidden md:flex items-center gap-1.5 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors btn-3d"
          >
            <Phone className="w-3.5 h-3.5" />
            SOS
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ path, labelKey, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === path
                  ? 'bg-accent/10 text-accent'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t(labelKey, lang)}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin/verify"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-primary bg-primary/10"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}
          <Link
            to="/emergency"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-500/5"
          >
            <Phone className="w-4 h-4" />
            Emergency / SOS
          </Link>
        </div>
      )}
    </header>
  );
}