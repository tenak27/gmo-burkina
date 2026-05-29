import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import ClientSpace from './pages/ClientSpace';
import RetailerSpace from './pages/RetailerSpace';
import AdminSpace from './pages/AdminSpace';
import MagasinierSpace from './pages/MagasinierSpace';
import CommercialSpace from './pages/CommercialSpace';
import DriverSpace from './pages/DriverSpace';
import Careers from './pages/Careers';
import DevisValidation from './pages/DevisValidation';
import VerifyDocument from './pages/VerifyDocument';
import ResellerSpace from './pages/ResellerSpace';
import VuexyFormDemo from './pages/VuexyFormDemo';
import VendeursAdmin from './pages/VendeursAdmin';
import VendeurSpace from './pages/VendeurSpace';
// Add page imports here

// Redirects authenticated user to their correct space
function RoleRedirect() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return null;
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (user.role === "pdg" || user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "commercial") return <Navigate to="/commercial" replace />;
  if (user.role === "magasinier") return <Navigate to="/magasinier" replace />;
  if (user.role === "chauffeur") return <Navigate to="/chauffeur" replace />;
  if (user.role === "detaillant") return <Navigate to="/detaillant" replace />;
  if (user.role === "revendeur") return <Navigate to="/revendeur" replace />;
  if (user.role === "vendeur") return <Navigate to="/vendeur" replace />;
  return <Navigate to="/client" replace />;
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
        <div className="w-8 h-8 border-4 border-white/10 border-t-gmo-green rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<RoleRedirect />} />
      <Route path="/client" element={<ClientSpace />} />
      <Route path="/detaillant" element={<RetailerSpace />} />
      <Route path="/admin" element={<AdminSpace />} />
      <Route path="/magasinier" element={<MagasinierSpace />} />
      <Route path="/commercial" element={<CommercialSpace />} />
      <Route path="/chauffeur" element={<DriverSpace />} />
      <Route path="/revendeur" element={<ResellerSpace />} />
      <Route path="/carrieres" element={<Careers />} />
      <Route path="/devis-validation" element={<DevisValidation />} />
      <Route path="/verify" element={<VerifyDocument />} />
      <Route path="/vuexy-demo" element={<VuexyFormDemo />} />
      <Route path="/vendeurs" element={<VendeursAdmin />} />
      <Route path="/vendeur" element={<VendeurSpace />} />
      <Route path="*" element={<PageNotFound />} />
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