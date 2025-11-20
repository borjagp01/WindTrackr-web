import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CompassProps {
  directionDeg: number;
  windIntensity?: 'light' | 'moderate' | 'strong';
}

export function Compass({
  directionDeg,
  windIntensity = 'light',
}: CompassProps) {
  // Detecta modo oscuro de forma reactiva y SSR-safe
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`relative w-56 h-56 ${isDark ? 'dark' : ''}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
        <defs>
          {/* Background gradient: modo claro/oscuro */}
          <radialGradient id="compassBg" cx="50%" cy="35%" r="70%">
            <stop
              offset="0%"
              stopColor={isDark ? '#0f172a' : '#e0e7ef'}
              stopOpacity={isDark ? 0.9 : 1}
            />
            <stop
              offset="60%"
              stopColor={isDark ? '#020617' : '#f1f5f9'}
              stopOpacity={1}
            />
            <stop
              offset="100%"
              stopColor={isDark ? '#020617' : '#f1f5f9'}
              stopOpacity={1}
            />
          </radialGradient>

          {/* Ring gradient: modo claro/oscuro */}
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#38bdf8' : '#0ea5e9'} />
            <stop offset="40%" stopColor={isDark ? '#22c55e' : '#22d3ee'} />
            <stop offset="80%" stopColor={isDark ? '#eab308' : '#fde68a'} />
            <stop offset="100%" stopColor={isDark ? '#f97316' : '#fbbf24'} />
          </linearGradient>

          {/* Arrow gradient based on intensity */}
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={
                windIntensity === 'strong'
                  ? isDark
                    ? '#f97373'
                    : '#ef4444'
                  : windIntensity === 'moderate'
                    ? isDark
                      ? '#facc15'
                      : '#fde68a'
                    : isDark
                      ? '#38bdf8'
                      : '#0ea5e9'
              }
            />
            <stop
              offset="100%"
              stopColor={
                windIntensity === 'strong'
                  ? isDark
                    ? '#b91c1c'
                    : '#dc2626'
                  : windIntensity === 'moderate'
                    ? isDark
                      ? '#eab308'
                      : '#fbbf24'
                    : isDark
                      ? '#0ea5e9'
                      : '#38bdf8'
              }
            />
          </linearGradient>
        </defs>

        {/* Fondo principal */}
        <circle cx="144" cy="144" r="140" fill="url(#compassBg)" />

        {/* Anillo exterior */}
        <circle
          cx="144"
          cy="144"
          r="130"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="3"
          opacity="0.7"
        />

        {/* Anillo interior */}
        <circle
          cx="144"
          cy="144"
          r="112"
          fill={isDark ? 'rgba(15,23,42,0.8)' : '#f8fafc'}
          stroke={isDark ? 'rgba(148,163,184,0.25)' : '#cbd5f5'}
          strokeWidth="1.5"
        />

        {/* Tick marks every 7.5° */}
        {Array.from({ length: 48 }, (_, i) => i * 7.5).map((deg) => {
          const isCardinal = deg % 90 === 0;
          const isMajor = deg % 45 === 0 && !isCardinal;
          const radian = ((deg - 90) * Math.PI) / 180;
          const startRadius = isCardinal ? 122 : isMajor ? 120 : 122;
          const endRadius = isCardinal ? 108 : isMajor ? 108 : 114;

          const x1 = 144 + startRadius * Math.cos(radian);
          const y1 = 144 + startRadius * Math.sin(radian);
          const x2 = 144 + endRadius * Math.cos(radian);
          const y2 = 144 + endRadius * Math.sin(radian);

          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                isCardinal
                  ? isDark
                    ? 'rgba(248,250,252,0.95)'
                    : '#334155'
                  : isMajor
                    ? isDark
                      ? 'rgba(148,163,184,0.9)'
                      : '#64748b'
                    : isDark
                      ? 'rgba(148,163,184,0.4)'
                      : '#cbd5f5'
              }
              strokeWidth={isCardinal ? 3 : isMajor ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Soft inner radial highlight */}
        <circle
          cx="144"
          cy="144"
          r="80"
          fill="url(#compassBg)"
          opacity="0.85"
        />

        {/* Cardinal letters */}
        <text
          x="144"
          y="52"
          textAnchor="middle"
          className="font-bold"
          fill={isDark ? '#cbd5f5' : '#334155'}
          fontSize="15"
        >
          N
        </text>
        <text
          x="238"
          y="150"
          textAnchor="middle"
          className="font-medium"
          fill={isDark ? '#cbd5f5' : '#334155'}
          fontSize="15"
        >
          E
        </text>
        <text
          x="144"
          y="242"
          textAnchor="middle"
          className="font-medium"
          fill={isDark ? '#9ca3af' : '#64748b'}
          fontSize="15"
        >
          S
        </text>
        <text
          x="50"
          y="150"
          textAnchor="middle"
          className="font-medium"
          fill={isDark ? '#cbd5f5' : '#334155'}
          fontSize="15"
        >
          O
        </text>
      </svg>

      {/* Rotating arrow / needle */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: directionDeg }}
        transition={{
          type: 'spring',
          stiffness: 110,
          damping: 22,
          mass: 0.9,
        }}
      >
        <svg
          width="32"
          height="140"
          viewBox="0 0 40 170"
          className="drop-shadow-[0_8px_18px_rgba(15,23,42,0.8)]"
        >
          <path
            d="M20 4 L8 40 L14 40 L14 150 L26 150 L26 40 L32 40 Z"
            fill="url(#arrowGradient)"
          />
        </svg>
      </motion.div>

      {/* Center disc with pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative w-6 h-6 rounded-full ${
            windIntensity === 'strong'
              ? 'bg-red-500'
              : windIntensity === 'moderate'
                ? 'bg-amber-400'
                : 'bg-sky-400'
          } shadow-[0_0_25px_rgba(56,189,248,0.5)]`}
        >
          <div
            className={`absolute inset-0 rounded-full animate-ping ${
              windIntensity === 'strong'
                ? 'bg-red-500'
                : windIntensity === 'moderate'
                  ? 'bg-amber-400'
                  : 'bg-sky-400'
            } opacity-60`}
          />
          <div className="absolute inset-1.5 rounded-full bg-slate-950 border border-slate-500/60" />
        </div>
      </div>
    </div>
  );
}
