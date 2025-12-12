import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Partículas de poeira digital (Digital Dust) - Subindo suavemente
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5, // Tamanho variado
      speedY: Math.random() * 0.3 + 0.1, // Velocidade lenta
      opacity: Math.random() * 0.4 + 0.1 // Opacidade sutil
    }));

    const draw = () => {
      // Limpa o canvas mantendo transparência total
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#4ade80'; // Neon Green 400

      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Movimento ascendente (Data Flow)
        p.y -= p.speedY;
        
        // Loop infinito
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-[#050505] overflow-hidden">
      {/* 1. Camada GLOSS MORPH (CSS Puro - Garantia de visualização) */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-neon-900/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-neon-600/5 rounded-full blur-[80px] animate-float pointer-events-none" />

      {/* 2. Camada DIGITAL GRID (Perspectiva Infinita) */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #22c55e 1px, transparent 1px),
            linear-gradient(to bottom, #22c55e 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          // Mascara radial para focar no centro e sumir nas bordas (Infinite feel)
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* 3. Camada CANVAS PARTICLES (Data Dust) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 4. Camada VIGNETTE (Foco & Profundidade) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020202_100%)] pointer-events-none opacity-90" />
      
      {/* 5. Camada TEXTURA (Noise SVG Inline - Carregamento instantâneo) */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

export default Background;