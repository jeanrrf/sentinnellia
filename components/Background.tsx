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

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Configuração da Chuva Digital
    const fontSize = 14;
    const columns = Math.ceil(width / fontSize); // Número de colunas baseado na largura
    const drops: number[] = [];
    
    // Inicializa as gotas em posições aleatórias acima da tela para início mais orgânico
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; 
    }

    const chars = "01AINEXSENTINNELL___"; // Caracteres personalizados da marca

    const draw = () => {
      // Cria o efeito de rastro (fade out)
      // Um alpha muito baixo (0.05) cria rastros longos, alto (0.1) rastros curtos
      ctx.fillStyle = 'rgba(2, 2, 2, 0.08)'; 
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px "Fira Code", monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        // Seleciona caractere
        const text = chars[Math.floor(Math.random() * chars.length)];
        
        // Efeito "Glint": Alguns caracteres brilham mais (cabeça do stream)
        const isHead = Math.random() > 0.98;
        
        if (isHead) {
             ctx.fillStyle = '#ffffff'; // Ponta branca brilhante
             ctx.shadowBlur = 10;
             ctx.shadowColor = '#ffffff';
        } else if (Math.random() > 0.90) {
             ctx.fillStyle = '#4ade80'; // Neon forte esporádico
             ctx.shadowBlur = 5;
             ctx.shadowColor = '#4ade80';
        } else {
             ctx.fillStyle = '#14532d'; // Verde escuro (matrix base)
             ctx.shadowBlur = 0;
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Resetar gota ao chegar no fim ou aleatoriamente para variar densidade
        if (y > height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden">
      {/* Canvas Animado */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-25 mix-blend-screen" 
      />
      
      {/* Camada de Profundidade (Vignette) - Cria o foco central e o "infinito" nas bordas */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_95%)] pointer-events-none"></div>
      
      {/* Grid Sutil Cyberpunk no fundo */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(to right, #15803d 1px, transparent 1px),
                              linear-gradient(to bottom, #15803d 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
            transformOrigin: 'top center',
            maskImage: 'linear-gradient(to bottom, transparent, black 40%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 40%, transparent 90%)'
        }}
      ></div>

      {/* Noise Texture para aspecto "Filme/Digital" */}
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
    </div>
  );
};

export default Background;