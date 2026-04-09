import { Link, useLocation } from 'react-router-dom';
import { Search, DollarSign, AlertTriangle, Phone } from 'lucide-react';
import { t } from '../lib/constants';

export default function BottomNav({ lang }) {
  const location = useLocation();

  const items = [
    { path: '/services', icon: Search, label: t('services', lang) },
    { path: '/price-checker', icon: DollarSign, label: t('price_checker', lang) },
    { path: '/scam-map', icon: AlertTriangle, label: t('scam_map', lang) },
    { path: '/emergency', icon: Phone, label: 'SOS', isSOS: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-3 mb-3 bg-primary/97 backdrop-blur-xl rounded-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.18)] border border-white/10">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            if (item.isSOS) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-0.5 -mt-5"
                >
                  <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center animate-pulse-glow" style={{boxShadow:'0 4px 0 #b91c1c, 0 6px 16px rgba(239,68,68,0.5)'}}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-primary-foreground">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-1 px-3"
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-200 ${isActive ? 'bg-white/25 shadow-inner' : 'hover:bg-white/10'}`} style={isActive ? {boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.15)'} : {}}>
                  <Icon className={`w-6 h-6 ${
                    isActive ? 'text-accent' : 'text-primary-foreground/60'
                  }`} strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-medium ${
                  isActive ? 'text-accent' : 'text-primary-foreground/60'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}