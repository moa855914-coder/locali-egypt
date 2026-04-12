import { Link, useLocation } from 'react-router-dom';
import { Home, ShieldCheck, Star, Calendar, Bot } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home', labelRu: 'Главная', labelDe: 'Start', labelAr: 'الرئيسية' },
  { path: '/safety-guide', icon: ShieldCheck, label: 'Safety', labelRu: 'Безопасность', labelDe: 'Sicher', labelAr: 'الأمان' },
  { path: '/book', icon: Calendar, label: 'Book', labelRu: 'Бронь', labelDe: 'Buchen', labelAr: 'احجز', isPrimary: true },
  { path: '/temple-trips', icon: Star, label: 'Explore', labelRu: 'Активности', labelDe: 'Erleben', labelAr: 'استكشف' },
  { path: '/ai-assistant', icon: Bot, label: 'AI Help', labelRu: 'AI', labelDe: 'AI', labelAr: 'مساعد AI', isAI: true },
];

function getLabel(item, lang) {
  if (lang === 'ru') return item.labelRu || item.label;
  if (lang === 'de') return item.labelDe || item.label;
  if (lang === 'ar') return item.labelAr || item.label;
  return item.label;
}

export default function BottomNav({ lang }) {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-3 mb-3 bg-primary/97 backdrop-blur-xl rounded-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.18)] border border-white/10">
        <div className="flex items-center justify-around px-1 py-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            if (item.isPrimary) {
              return (
                <Link key={item.path} to={item.path}
                  className="flex flex-col items-center gap-0.5 -mt-5">
                  <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.2),0_6px_16px_rgba(251,146,60,0.5)]">
                    <Icon className="w-6 h-6 text-accent-foreground" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-primary-foreground/80">
                    {getLabel(item, lang)}
                  </span>
                </Link>
              );
            }

            if (item.isAI) {
              return (
                <Link key={item.path} to={item.path}
                  className="flex flex-col items-center gap-1 py-1 px-2">
                  <div className={`p-2 rounded-xl transition-all duration-200 relative ${isActive ? 'bg-violet-500/30' : 'hover:bg-white/10'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-violet-300' : 'text-primary-foreground/60'}`} strokeWidth={2} />
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-violet-500 rounded-full flex items-center justify-center text-[6px] text-white font-black">✦</span>
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-violet-300' : 'text-primary-foreground/60'}`}>
                    {getLabel(item, lang)}
                  </span>
                </Link>
              );
            }

            return (
              <Link key={item.path} to={item.path}
                className="flex flex-col items-center gap-1 py-1 px-2">
                <div className={`p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-white/25 shadow-inner' : 'hover:bg-white/10'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-primary-foreground/60'}`} strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-accent' : 'text-primary-foreground/60'}`}>
                  {getLabel(item, lang)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}