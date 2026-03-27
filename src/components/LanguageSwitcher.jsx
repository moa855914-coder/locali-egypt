import { LANGUAGES } from '../lib/constants';

export default function LanguageSwitcher({ lang, onChange }) {
  return (
    <div className="flex items-center gap-0.5 bg-primary/5 rounded-full p-0.5">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
            lang === l.code
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}