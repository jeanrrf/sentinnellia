import React, { Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Background from './components/Background';

// Lazy loading para componentes "abaixo da dobra"
const Features = React.lazy(() => import('./components/Features'));
const Projects = React.lazy(() => import('./components/Projects'));

function App() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-neon-500/30 selection:text-neon-400">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={
          <div className="w-full py-24 flex items-center justify-center text-neon-500/50 font-mono animate-pulse">
            CARREGANDO MÓDULOS...
          </div>
        }>
          <Features />
          <Projects />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;