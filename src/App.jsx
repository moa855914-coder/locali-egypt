import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import CityPage from './pages/CityPage';
import Services from './pages/Services.jsx';
import ServiceDetail from './pages/ServiceDetail';
import PriceChecker from './pages/PriceChecker';
import ScamMap from './pages/ScamMap';
import Emergency from './pages/Emergency';
import CostCalculator from './pages/CostCalculator';
import BeforeYouLand from './pages/BeforeYouLand';
import Phrases from './pages/Phrases';
import WomenSafety from './pages/WomenSafety';
import Deals from './pages/Deals';
import CityPrices from './pages/city/CityPrices';
import EgyptSafeNow from './pages/EgyptSafeNow';
import EgyptVsDubai from './pages/EgyptVsDubai';
import LastMinuteEgypt from './pages/LastMinuteEgypt';
import Nightlife from './pages/Nightlife';
import RemoteWork from './pages/RemoteWork';

import CityScams from './pages/city/CityScams';
import MiddleEastSafetyMap from './pages/MiddleEastSafetyMap';
import TripDecision from './pages/TripDecision';
import VerifyApply from './pages/VerifyApply';
import SimCards from './pages/SimCards';
import VisaEntry from './pages/VisaEntry';
import CurrencyRates from './pages/CurrencyRates';
import FeaturedLocals from './pages/FeaturedLocals';

import CityRestaurants from './pages/city/CityRestaurants';
import CityThingsToDo from './pages/city/CityThingsToDo';
import CityTransport from './pages/city/CityTransport';
import CityATM from './pages/city/CityATM';
import AIAssistant from './pages/AIAssistant';
import LiveSituationPage from './pages/LiveSituationPage';
import CitySafety from './pages/city/CitySafety';
import Terms from './pages/Terms';
import BookingPage from './pages/BookingPage';
import SafetyGuide from './pages/SafetyGuide';
import AirportItems from './pages/AirportItems';
import Beaches from './pages/Beaches';
import SmartGuide from './pages/SmartGuide';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Hotels from './pages/Hotels';
import ElGouna from './pages/ElGouna';
import Bazaars from './pages/Bazaars';
import ArabTourists from './pages/ArabTourists';
import AskALocal from './pages/AskALocal';
import VerifiedGuides from './pages/VerifiedGuides';
import VerifiedDrivers from './pages/VerifiedDrivers';
import About from './pages/About';
import TourOperators from './pages/TourOperators';
import Apartments from './pages/Apartments';
import CityGuide from './pages/CityGuide';


import NationalityGuide from './pages/NationalityGuide';
import AdminVerification from './pages/AdminVerification';
import AdminDataPopulate from './pages/AdminDataPopulate';
import AdminContentManager from './pages/AdminContentManager';
import TouristVillages from './pages/TouristVillages';
import VerifiedContacts from './pages/VerifiedContacts';
import DataSources from './pages/DataSources';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import Methodology from './pages/Methodology';
import BoatTrips from './pages/BoatTrips';
import HorseRidingExperiences from './pages/HorseRidingExperiences';
import TempleTrips from './pages/TempleTrips';
import Restaurants from './pages/Restaurants';
import BeachClubs from './pages/BeachClubs';
import BazaarsMarkets from './pages/BazaarsMarkets';
import WaterSports from './pages/WaterSports';
import Museums from './pages/Museums';
import UnifiedSearch from './pages/UnifiedSearch';
import PlaceSearch from './pages/PlaceSearch';
import TravelTips from './pages/TravelTips';
import SuperAgent from './pages/SuperAgent';
import AdminCMS from './pages/AdminCMS';
import AddService from './pages/AddService';
import AdminBulkPopulate from './pages/AdminBulkPopulate';
import AdminElGounaFix from './pages/AdminElGounaFix';
import AdminHomeCMS from './pages/AdminHomeCMS';
import AdminLocalPersonas from './pages/AdminLocalPersonas';
import AdminPriceManager from './pages/AdminPriceManager';
import PriceInsights from './pages/PriceInsights';
import LocaliHome from './pages/LocaliHome';
import HiddenGems from './pages/HiddenGems';
import LocaliHostDashboard from './pages/LocaliHostDashboard';
import LocaliAdminPanel from './pages/LocaliAdminPanel';
import AdminPlaceImageUpdater from './pages/AdminPlaceImageUpdater';
import AdminAutoImages from './pages/AdminAutoImages';
import WellnessHealing from './pages/WellnessHealing';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/city/:cityId" element={<CityPage />} />
        <Route path="/city/:cityId/prices" element={<CityPrices />} />
        <Route path="/city/:cityId/scams" element={<CityScams />} />
        <Route path="/city/:cityId/restaurants" element={<CityRestaurants />} />
        <Route path="/city/:cityId/things-to-do" element={<CityThingsToDo />} />
        <Route path="/city/:cityId/transport" element={<CityTransport />} />
        <Route path="/city/:cityId/atm-currency" element={<CityATM />} />
        <Route path="/city/:cityId/safety" element={<CitySafety />} />
        <Route path="/services" element={<Services />} />
        <Route path="/service/:serviceId" element={<ServiceDetail />} />
        <Route path="/price-checker" element={<PriceChecker />} />
        <Route path="/scam-map" element={<ScamMap />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/cost-calculator" element={<CostCalculator />} />
        <Route path="/before-you-land" element={<BeforeYouLand />} />
        <Route path="/phrases" element={<Phrases />} />
        <Route path="/women-safety" element={<WomenSafety />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/egypt-safe-now" element={<EgyptSafeNow />} />
        <Route path="/egypt-vs-dubai" element={<EgyptVsDubai />} />
        <Route path="/last-minute-egypt" element={<LastMinuteEgypt />} />
        <Route path="/nightlife" element={<Nightlife />} />
        <Route path="/remote-work" element={<RemoteWork />} />

        <Route path="/nationality-guide" element={<NationalityGuide />} />
        <Route path="/admin/verify" element={<AdminVerification />} />
        <Route path="/admin/populate" element={<AdminDataPopulate />} />
        <Route path="/admin/content" element={<AdminContentManager />} />
        <Route path="/tourist-villages" element={<TouristVillages />} />
        <Route path="/verified-contacts" element={<VerifiedContacts />} />
        <Route path="/data-sources" element={<DataSources />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/boat-trips" element={<BoatTrips />} />
        <Route path="/horse-riding" element={<HorseRidingExperiences />} />
        <Route path="/temple-trips" element={<TempleTrips />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/beach-clubs" element={<BeachClubs />} />
        <Route path="/bazaars" element={<BazaarsMarkets />} />
        <Route path="/water-sports" element={<WaterSports />} />
        <Route path="/museums" element={<Museums />} />
        <Route path="/listings" element={<UnifiedSearch />} />
        <Route path="/place-search" element={<PlaceSearch />} />
        <Route path="/travel-tips" element={<TravelTips />} />
        <Route path="/super-agent" element={<SuperAgent />} />
        <Route path="/admin/cms" element={<AdminCMS />} />
        <Route path="/admin/bulk-populate" element={<AdminBulkPopulate />} />
        <Route path="/admin/el-gouna-fix" element={<AdminElGounaFix />} />
        <Route path="/admin/home-cms" element={<AdminHomeCMS />} />
        <Route path="/admin/personas" element={<AdminLocalPersonas />} />
        <Route path="/admin/prices" element={<AdminPriceManager />} />
        <Route path="/price-insights" element={<PriceInsights />} />
        <Route path="/airport-items" element={<AirportItems />} />
        <Route path="/el-gouna" element={<ElGouna />} />
        <Route path="/nationality-guide" element={<NationalityGuide />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
        <Route path="/my-trips" element={<MyTrips />} />
        <Route path="/middle-east-safety-map" element={<MiddleEastSafetyMap />} />
        <Route path="/trip-decision" element={<TripDecision />} />
        <Route path="/verify-apply" element={<VerifyApply />} />
        <Route path="/sim-cards" element={<SimCards />} />
        <Route path="/visa-entry" element={<VisaEntry />} />
        <Route path="/currency-rates" element={<CurrencyRates />} />
        <Route path="/featured-locals" element={<FeaturedLocals />} />

        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/live-situation" element={<LiveSituationPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/safety-guide" element={<SafetyGuide />} />
        <Route path="/airport-items" element={<AirportItems />} />
        <Route path="/beaches" element={<Beaches />} />
        <Route path="/smart-guide" element={<SmartGuide />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/el-gouna" element={<ElGouna />} />
        <Route path="/city/el-gouna" element={<ElGouna />} />
        <Route path="/bazaars" element={<Bazaars />} />
        <Route path="/arab-tourists" element={<ArabTourists />} />
        <Route path="/ask-a-local" element={<AskALocal />} />
        <Route path="/guides" element={<VerifiedGuides />} />
        <Route path="/drivers" element={<VerifiedDrivers />} />
        <Route path="/about" element={<About />} />
        <Route path="/tour-operators" element={<TourOperators />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/city-guide/:cityId" element={<CityGuide />} />
        <Route path="/locali" element={<LocaliHome />} />
        <Route path="/hidden-gems" element={<HiddenGems />} />
        <Route path="/hidden-gems-egypt" element={<HiddenGems />} />
        <Route path="/locali/dashboard" element={<LocaliHostDashboard />} />
        <Route path="/locali/admin" element={<LocaliAdminPanel />} />
        <Route path="/admin/place-images" element={<AdminPlaceImageUpdater />} />
        <Route path="/admin/auto-images" element={<AdminAutoImages />} />
        <Route path="/wellness" element={<WellnessHealing />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App