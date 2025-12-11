import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Projects from './components/Projects';
import Footer from './components/Footer';
import Background from './components/Background';

function App() {
  return (
    <div className="min-h-screen text-white font-sans selection:bg-neon-500/30 selection:text-neon-400">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}

export default App;