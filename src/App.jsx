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
import Services from './pages/Services';
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
import RideSharing from './pages/RideSharing';
import LongStay from './pages/LongStay';
import CityScams from './pages/city/CityScams';
import MiddleEastSafetyMap from './pages/MiddleEastSafetyMap';
import TripDecision from './pages/TripDecision';
import VerifyApply from './pages/VerifyApply';
import SimCards from './pages/SimCards';
import VisaEntry from './pages/VisaEntry';
import CurrencyRates from './pages/CurrencyRates';
import FeaturedLocals from './pages/FeaturedLocals';
import TouristStories from './pages/TouristStories';
import CityRestaurants from './pages/city/CityRestaurants';
import CityThingsToDo from './pages/city/CityThingsToDo';
import CityTransport from './pages/city/CityTransport';
import CityATM from './pages/city/CityATM';
import AIAssistant from './pages/AIAssistant';
import LiveSituationPage from './pages/LiveSituationPage';
import CitySafety from './pages/city/CitySafety';
import Terms from './pages/Terms';
import BookingPage from './pages/BookingPage';

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
        <Route path="/ride-sharing" element={<RideSharing />} />
        <Route path="/long-stay" element={<LongStay />} />
        <Route path="/middle-east-safety-map" element={<MiddleEastSafetyMap />} />
        <Route path="/trip-decision" element={<TripDecision />} />
        <Route path="/verify-apply" element={<VerifyApply />} />
        <Route path="/sim-cards" element={<SimCards />} />
        <Route path="/visa-entry" element={<VisaEntry />} />
        <Route path="/currency-rates" element={<CurrencyRates />} />
        <Route path="/featured-locals" element={<FeaturedLocals />} />
        <Route path="/tourist-stories" element={<TouristStories />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/live-situation" element={<LiveSituationPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/book" element={<BookingPage />} />
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