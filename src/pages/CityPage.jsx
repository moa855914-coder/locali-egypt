import { useParams, useOutletContext, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { CITIES, SERVICE_CATEGORIES, t, getCityName } from '../lib/constants';
import { MapPin, ArrowLeft, AlertTriangle, DollarSign, ShieldCheck, Star } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import SafeNextStep from '../components/SafeNextStep';

export default function CityPage() {
  const { cityId } = useParams();
  const { lang } = useOutletContext();
  const city = CITIES.find(c => c.id === cityId);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services', cityId],
    queryFn: () => base44.entities.Service.filter({ city: cityId }, '-created_date', 20),
  });

  const { data: scamReports = [] } = useQuery({
    queryKey: ['scams', cityId],
    queryFn: () => base44.entities.ScamReport.filter({ city: cityId }, '-created_date', 5),
  });

  if (!city) return <div className="p-4 text-center">City not found</div>;

  const verifiedServices = services.filter(s => s.is_verified);
  const featuredServices = services.filter(s => s.is_featured);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-56 md:h-72">
        <img src={city.image} alt={getCityName(city, lang)} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link to="/" className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{city.region}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{getCityName(city, lang)}</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-7xl mx-auto space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <ShieldCheck className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-2xl font-extrabold">{verifiedServices.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{t('verified', lang)}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <AlertTriangle className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-extrabold">{scamReports.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Scam Reports</p>
          </div>
          <div className="bg-card rounded-2xl border border-border/50 p-4 text-center">
            <Star className="w-5 h-5 text-accent fill-accent mx-auto mb-1" />
            <p className="text-2xl font-extrabold">{services.length}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{t('services', lang)}</p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-extrabold mb-3">Browse by Category</h2>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/services?city=${cityId}&category=${cat.id}`}
                className="flex-shrink-0 bg-card border border-border/50 rounded-2xl px-4 py-3 hover:border-accent/50 transition-all"
              >
                <span className="text-sm font-semibold whitespace-nowrap">
                  {lang === 'ru' ? cat.labelRu : lang === 'de' ? cat.labelDe : cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured */}
        {featuredServices.length > 0 && (
          <div>
            <h2 className="text-lg font-extrabold mb-3">Featured</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredServices.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        )}

        {/* Recent Scam Alerts */}
        {scamReports.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold">Recent Scam Alerts</h2>
              <Link to={`/scam-map?city=${cityId}`} className="text-xs font-bold text-accent">View All</Link>
            </div>
            <div className="space-y-3">
              {scamReports.slice(0, 3).map((report) => (
                <div key={report.id} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-500 uppercase">{report.category}</span>
                    {report.severity === 'high' && (
                      <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">HIGH</span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm">{report.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Services */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
          </div>
        ) : services.length > 0 ? (
          <div>
            <h2 className="text-lg font-extrabold mb-3">All Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-medium">No services listed yet for this city.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        )}

        {/* Safe Next Steps */}
        <div className="space-y-3">
          <SafeNextStep
            title={`Verified Transport in ${getCityName(city, lang)}`}
            description="Trusted drivers and shuttle services"
            to={`/services?city=${cityId}&category=transport`}
          />
          <SafeNextStep
            title="Check Fair Prices"
            description="Know what you should pay before you negotiate"
            to="/price-checker"
          />
        </div>
      </div>
    </div>
  );
}