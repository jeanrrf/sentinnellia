import React, { type FC } from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'full' | 'icon';
}

export const LogoEmblem: FC<{ size?: number; className?: string }> = ({ size = 36, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className}`}
      aria-label="Sentinnelle IA Emblem"
    >
      <defs>
        <linearGradient id="emblem-silver-main" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        <linearGradient id="emblem-silver-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        <linearGradient id="emblem-silver-light" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        <linearGradient id="emblem-cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#00B4D8" />
        </linearGradient>

        <filter id="emblem-cyan-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#00E5FF" floodOpacity="0.8" />
        </filter>
      </defs>

      <g transform="translate(10, 8)">
        {/* Left Arm Titanium */}
        <path d="M50 4 L14 78 L31 78 L53 32 Z" fill="url(#emblem-silver-main)" />
        {/* Right Leg */}
        <path d="M50 4 L53 32 L78 72 L93 62 Z" fill="url(#emblem-silver-dark)" />
        {/* Electric Cyan Neon Beam */}
        <path d="M51 34 L67 60 L60 67 L44 41 Z" fill="url(#emblem-cyan-glow)" filter="url(#emblem-cyan-shadow)" />
        {/* Cyan Accent Corner Triangle */}
        <path d="M87 78 L97 78 L92 68 Z" fill="url(#emblem-cyan-glow)" filter="url(#emblem-cyan-shadow)" />
        {/* Inner Chevron Fold */}
        <path d="M44 42 L31 78 L49 78 L63 56 Z" fill="url(#emblem-silver-light)" />
      </g>
    </svg>
  );
};

const Logo: FC<LogoProps> = ({ className = '', size = 36, showText = true }) => {
  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center p-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-[0_0_20px_rgba(0,229,255,0.25)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] group-hover:border-cyan-400/50 transition-all duration-300">
        <LogoEmblem size={size} className="group-hover:scale-105" />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className="text-base sm:text-lg font-black tracking-widest text-white uppercase font-sans">
              SENTINNELL
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/30">
              IA
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] font-mono text-gray-400 uppercase">
            WORKSPACE · <strong className="text-cyan-400 font-semibold">SIAW</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
