import { useParams } from 'react-router-dom';
import { CITY_META, CITY_ATM } from '../../lib/cityContent';
import CityPageHeader from '../../components/city/CityPageHeader';
import CitySubNav from '../../components/city/CitySubNav';
import FAQSection from '../../components/city/FAQSection';
import SafeNextStep from '../../components/SafeNextStep';
import { CreditCard, CheckCircle2, XCircle, TrendingDown } from 'lucide-react';

const FAQS = {
  'sharm-el-sheikh': [
    { q: 'Can I pay by card in Sharm El Sheikh?', a: 'Most hotels and larger restaurants accept cards. Markets, taxis, small cafés, and diving equipment rentals are cash only. Always carry EGP cash.' },
    { q: 'What is the ATM withdrawal limit in Egypt?', a: 'Most ATMs in Egypt have a daily limit of 5,000–10,000 EGP per card. Some limit to 3,000 EGP per transaction. You can do multiple transactions.' },
  ],
  hurghada: [
    { q: 'Where are the best ATMs in Hurghada?', a: 'Banque Misr and CIB ATMs in the Marina and Sahl Hasheesh areas are most reliable. Avoid standalone ATMs without a bank branch nearby.' },
    { q: 'Should I exchange money at Hurghada airport?', a: 'Only if you need emergency cash. Airport rates are worse than city exchange offices. Withdraw from a bank ATM in the city for better rates.' },
  ],
  luxor: [
    { q: 'Are there ATMs on the West Bank in Luxor?', a: 'No. There are no reliable ATMs on the West Bank near the temples. Withdraw all the cash you need from the East Bank before taking the ferry.' },
    { q: 'What currency should I use in Luxor?', a: 'Always pay in Egyptian Pounds (EGP). Vendors may accept USD but the rate they use is always unfavorable to you. EGP is always better.' },
  ],
  aswan: [
    { q: 'Are there ATMs in Abu Simbel?', a: 'No. There are no ATMs at Abu Simbel. Bring all the cash you need for the day (entry tickets, food, souvenirs) when you leave Aswan.' },
    { q: 'Can I use my card in Aswan?', a: 'Hotels generally accept cards. Everything else — feluccas, markets, restaurants, temples — is cash. Bring enough EGP before leaving the Corniche area.' },
  ],
};

export default function CityATM() {
  const { cityId } = useParams();
  const meta = CITY_META[cityId];
  const atmData = CITY_ATM[cityId];
  const faqs = FAQS[cityId] || [];

  if (!meta || !atmData) return <div className="p-4">City not found</div>;

  return (
    <div>
      <CityPageHeader cityId={cityId} />
      <CitySubNav cityId={cityId} />

      <div className="px-4 py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          ATMs &amp; Currency in {meta.name}
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">{atmData.intro}</p>

        {/* Exchange Rate */}
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-5 h-5 text-accent" />
            <span className="font-bold text-sm">Current Approximate Rate</span>
          </div>
          <p className="text-2xl font-extrabold text-accent">{atmData.rate}</p>
          <p className="text-xs text-muted-foreground mt-1">Always check the live rate before traveling. Rates fluctuate.</p>
        </div>

        {/* Tips */}
        <h2 className="text-lg font-extrabold mb-4">Money Tips for {meta.name}</h2>
        <div className="space-y-2 mb-8">
          {atmData.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3 bg-card rounded-2xl border border-border/50 p-4">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>

        {/* Best ATMs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-success/5 border border-success/20 rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              Recommended ATMs
            </h2>
            <ul className="space-y-2">
              {atmData.bestATMs.map((atm, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  {atm}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
            <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              Avoid / Be Cautious
            </h2>
            <ul className="space-y-2">
              {atmData.avoidList.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FAQSection faqs={faqs} city={meta.name} />

        <div className="mt-8">
          <SafeNextStep
            title={`Real Prices in ${meta.name}`}
            description="Know exactly how much to carry in cash"
            to={`/city/${cityId}/prices`}
          />
        </div>
      </div>
    </div>
  );
}