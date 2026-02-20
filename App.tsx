import { GoogleOAuthProvider } from '@react-oauth/google';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Background from './components/Background';
import CookieConsent from './components/CookieConsent';
import Ecosystem from './components/Ecosystem';
import ExitIntentModal from './components/ExitIntentModal';
import FloatingCTA from './components/FloatingCTA';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Mentorship from './components/Mentorship';
import Navbar from './components/Navbar';
import PortfolioHighlight from './components/PortfolioHighlight';
import LeadDashboard from './pages/LeadDashboard';
import LeadPage from './pages/LeadPage';

// Lazy loading para componentes "abaixo da dobra"
const Projects = lazy(() => import('./components/Projects'));

function HomePage() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-neon-500/30 selection:text-neon-400">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <PortfolioHighlight />
        <Mentorship />
        <Ecosystem />
        <Suspense fallback={
          <div className="w-full py-24 flex items-center justify-center text-neon-500/50 font-mono animate-pulse">
            CARREGANDO MÓDULOS...
          </div>
        }>
          <Projects />
        </Suspense>
      </main>
      <Footer />
      {/* Global UX Overlays */}
      <FloatingCTA />
      <ExitIntentModal />
      <CookieConsent />
    </div>
  );
}

function App() {
  // ─── Google Client ID ──────────────────────────────────────────────────────
  // 1. Acesse: https://console.cloud.google.com/
  // 2. Crie um projeto → APIs & Services → Credentials
  // 3. Create Credentials → OAuth Client ID → Web Application
  // 4. Authorized JavaScript origins: http://localhost:3000, https://sentinnellia.vercel.app
  // 5. Copie o Client ID e cole abaixo
  // ───────────────────────────────────────────────────────────────────────────
  const GOOGLE_CLIENT_ID = "554684618076-vbt5eae4l3be2hbf04rlgcq9s33sqvln.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mentoria" element={<LeadPage />} />
          <Route path="/leads-dashboard" element={<LeadDashboard />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
