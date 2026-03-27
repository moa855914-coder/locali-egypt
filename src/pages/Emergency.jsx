import { useOutletContext } from 'react-router-dom';
import { Phone, Hospital, Shield, Building2, AlertTriangle } from 'lucide-react';
import { t } from '../lib/constants';
import SafeNextStep from '../components/SafeNextStep';

const EMERGENCY_CONTACTS = [
  { title: 'Tourist Police', number: '126', icon: Shield, desc: 'Dedicated to tourist protection', color: 'bg-blue-500' },
  { title: 'Ambulance', number: '123', icon: Hospital, desc: 'Emergency medical services', color: 'bg-red-500' },
  { title: 'Police', number: '122', icon: Shield, desc: 'General emergency', color: 'bg-primary' },
  { title: 'Fire Department', number: '180', icon: AlertTriangle, desc: 'Fire emergencies', color: 'bg-orange-500' },
];

const EMBASSIES = [
  { country: 'UK Embassy Cairo', phone: '+20 2 2791 6000' },
  { country: 'US Embassy Cairo', phone: '+20 2 2797 3300' },
  { country: 'German Embassy Cairo', phone: '+20 2 2728 2000' },
  { country: 'Russian Embassy Cairo', phone: '+20 2 2748 9353' },
  { country: 'French Embassy Cairo', phone: '+20 2 3567 3200' },
];

export default function Emergency() {
  const { lang } = useOutletContext();

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center">
          <Phone className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('emergency', lang)}</h1>
          <p className="text-sm text-muted-foreground">Tap to call instantly</p>
        </div>
      </div>

      {/* Emergency Numbers */}
      <div className="space-y-3 mb-8">
        {EMERGENCY_CONTACTS.map((contact) => {
          const Icon = contact.icon;
          return (
            <button
              key={contact.number}
              onClick={() => handleCall(contact.number)}
              className="w-full flex items-center gap-4 bg-card rounded-2xl border border-border/50 p-4 hover:shadow-lg transition-all duration-300 active:scale-[0.98] min-h-[72px]"
            >
              <div className={`w-14 h-14 rounded-xl ${contact.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold">{contact.title}</h3>
                <p className="text-xs text-muted-foreground">{contact.desc}</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-accent">{contact.number}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Embassies */}
      <div className="mb-8">
        <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          Embassies
        </h2>
        <div className="space-y-2">
          {EMBASSIES.map((embassy) => (
            <button
              key={embassy.country}
              onClick={() => handleCall(embassy.phone)}
              className="w-full flex items-center justify-between bg-card rounded-xl border border-border/50 p-4 hover:bg-secondary/50 transition-all min-h-[56px]"
            >
              <span className="font-semibold text-sm">{embassy.country}</span>
              <span className="text-sm font-bold text-accent">{embassy.phone}</span>
            </button>
          ))}
        </div>
      </div>

      <SafeNextStep
        title="Find Nearest Hospital"
        description="Verified medical services near you"
        to="/services?category=medical"
      />
    </div>
  );
}