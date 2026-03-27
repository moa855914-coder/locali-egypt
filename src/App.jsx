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