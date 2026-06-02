import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Home from './pages/Home';
import Careers from './pages/Careers';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrieres" element={<Careers />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/portail/vendeur" element={<Navigate to="/" />} />
          <Route path="/portail/chauffeur" element={<Navigate to="/" />} />
          <Route path="/portail/client" element={<Navigate to="/" />} />
          <Route path="/portail/admin" element={<Navigate to="/" />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App