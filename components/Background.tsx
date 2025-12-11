import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-dark-950">
      
      {/* Grid Técnico */}
      <div 
        className="absolute inset-0 opacity-[0.07]" 
        style={{
            backgroundImage: `
              linear-gradient(to right, #333 1px, transparent 1px),
              linear-gradient(to bottom, #333 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 100%)'
        }}
      ></div>

      {/* Hexagon Pattern Overlay (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='40' viewBox='0 0 24 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40c5.523 0 10-4.477 10-10V10c0-5.523-4.477-10-10-10s-10 4.477-10 10v20c0 5.523 4.477 10 10 10z' fill='%2322c55e' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Orbs de Luz Ambiente */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-900/10 to-transparent opacity-50"></div>
    </div>
  );
};

export default Background;