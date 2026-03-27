import { useOutletContext } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

const SAFETY_TIPS = [
  {
    title: 'Dress Code',
    icon: Info,
    items: [
      'Cover shoulders and knees in non-resort areas',
      'Swimwear is fine at hotel pools and beach resorts',
      'In Luxor and Aswan temples, modest dress is expected',
      'Bring a scarf for mosque visits',
    ],
  },
  {
    title: 'Transport Safety',
    icon: CheckCircle2,
    items: [
      'Always use Uber/Careem — never random taxis alone',
      'Share your live location with someone you trust',
      'Sit in the back seat, never in front',
      'Avoid walking alone after dark in quiet areas',
    ],
  },
  {
    title: 'Common Harassment Patterns',
    icon: AlertTriangle,
    items: [
      'Persistent shop owners inviting you "just to look"',
      'Unsolicited "guides" who follow you around tourist sites',
      'Requests for selfies that become uncomfortable',
      'Catcalling in busy markets — best to ignore and keep moving',
    ],
  },
  {
    title: 'What Works',
    icon: CheckCircle2,
    items: [
      'Firm "La shukran" (No thank you) and keep walking',
      'Wearing a ring (even fake) — "My husband is waiting"',
      'Staying in groups when visiting markets',
      'Choosing restaurants with female staff/customers',
      'Using hotel concierge for reliable recommendations',
    ],
  },
];

const REAL_EXPERIENCES = [
  {
    text: '"Sharm El Sheikh felt very safe. The resort areas are well-monitored and I had zero issues walking around at night near the main strip."',
    author: 'Sarah, UK',
    city: 'Sharm El Sheikh',
  },
  {
    text: '"In Luxor, I was approached by many vendors near the temples but a firm no worked every time. Having a local guide made a huge difference."',
    author: 'Anna, Germany',
    city: 'Luxor',
  },
  {
    text: '"Hurghada was mixed — the resort was perfect but in the old town I got followed a couple of times. I switched to only going out with my group."',
    author: 'Maria, Russia',
    city: 'Hurghada',
  },
];

export default function WomenSafety() {
  const { lang } = useOutletContext();

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Women Safety</h1>
          <p className="text-sm text-muted-foreground">Honest tips from real female travelers</p>
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-4 mb-8">
        {SAFETY_TIPS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-accent" />
                <h2 className="font-bold">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-1 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Real Experiences */}
      <h2 className="text-lg font-extrabold mb-3">Real Experiences</h2>
      <div className="space-y-3 mb-8">
        {REAL_EXPERIENCES.map((exp, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5">
            <p className="text-sm italic text-muted-foreground leading-relaxed">{exp.text}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-bold">— {exp.author}</span>
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{exp.city}</span>
            </div>
          </div>
        ))}
      </div>

      <SafeNextStep
        title="Emergency Contacts"
        description="Tourist Police: 126 — Ambulance: 123"
        to="/emergency"
      />
    </div>
  );
}