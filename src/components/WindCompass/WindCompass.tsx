import { motion } from 'framer-motion';
import { getWindDirectionCardinal, getWindDirectionName } from '@/utils';

interface WindCompassProps {
  directionDeg: number;
  speedAvgKts: number;
  gustKts: number;
  temperatureC?: number;
  humidityPct?: number;
}

export function WindCompass({
  directionDeg,
  speedAvgKts,
  gustKts,
  temperatureC,
  humidityPct,
}: WindCompassProps) {
  const windIntensity =
    speedAvgKts > 20 ? 'strong' : speedAvgKts > 10 ? 'moderate' : 'light';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Badge de intensidad */}
      {/* <div className="flex justify-center mb-4">
        <div
          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
            windIntensity === 'strong'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : windIntensity === 'moderate'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
          }`}
        >
          {windIntensity === 'strong'
            ? 'Fuerte'
            : windIntensity === 'moderate'
              ? 'Moderado'
              : 'Suave'}
        </div>
      </div> */}

      {/* Layout paralelo: Brújula + Gauge */}
      <div className="grid grid-cols-2 gap-8">
        {/* Brújula */}
        <div className="flex justify-center">
          <div className="relative w-56 h-56">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 288 288"
            >
              <defs>
                {/* Background gradient */}
                <radialGradient id="compassBg" cx="50%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#020617" stopOpacity="1" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                </radialGradient>

                {/* Ring gradient */}
                <linearGradient
                  id="ringGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="40%" stopColor="#22c55e" />
                  <stop offset="80%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>

                {/* Arrow gradient based on intensity */}
                <linearGradient
                  id="arrowGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={
                      windIntensity === 'strong'
                        ? '#f97373'
                        : windIntensity === 'moderate'
                          ? '#facc15'
                          : '#38bdf8'
                    }
                  />
                  <stop
                    offset="100%"
                    stopColor={
                      windIntensity === 'strong'
                        ? '#b91c1c'
                        : windIntensity === 'moderate'
                          ? '#eab308'
                          : '#0ea5e9'
                    }
                  />
                </linearGradient>
              </defs>

              {/* Dark glassy background */}
              <circle cx="144" cy="144" r="140" fill="url(#compassBg)" />

              {/* Outer glowing ring */}
              <circle
                cx="144"
                cy="144"
                r="130"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="3"
                opacity="0.7"
              />

              {/* Inner subtle ring */}
              <circle
                cx="144"
                cy="144"
                r="112"
                fill="rgba(15,23,42,0.8)"
                stroke="rgba(148,163,184,0.25)"
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
                        ? 'rgba(248,250,252,0.95)'
                        : isMajor
                          ? 'rgba(148,163,184,0.9)'
                          : 'rgba(148,163,184,0.4)'
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

              {/* Cardinal letters (slightly inset so they don't sit on top of ticks) */}
              <text
                x="144"
                y="52"
                textAnchor="middle"
                className="font-bold"
                fill="#cbd5f5"
                fontSize="15"
              >
                N
              </text>
              <text
                x="238"
                y="150"
                textAnchor="middle"
                className="font-medium"
                fill="#cbd5f5"
                fontSize="15"
              >
                E
              </text>
              <text
                x="144"
                y="242"
                textAnchor="middle"
                className="font-medium"
                fill="#9ca3af"
                fontSize="15"
              >
                S
              </text>
              <text
                x="50"
                y="150"
                textAnchor="middle"
                className="font-medium"
                fill="#cbd5f5"
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
                {/* Single-piece needle with integrated tip to avoid visual duplication */}
                <path
                  d="M20 4 L8 40 L14 40 L14 150 L26 150 L26 40 L32 40 Z"
                  fill="url(#arrowGradient)"
                />

                {/* Inner glow */}
                {/* <path
                d="M20 8 L13 38 L17 38 L17 147 L23 147 L23 38 L27 38 Z"
                fill="white"
                opacity="0.18"
              /> */}
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
        </div>

        {/* Speed gauge */}
        <div className="flex justify-center">
          <div className="relative w-full h-56 flex items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-sm">
              {/* Gauge track */}
              <defs>
                <linearGradient
                  id="gaugeTrack"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              <path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke="url(#gaugeTrack)"
                strokeWidth={10}
                strokeLinecap="round"
                opacity={0.25}
              />

              {/* Animated arc for average speed */}
              <motion.path
                d="M 20 110 A 80 80 0 0 1 180 110"
                fill="none"
                stroke="url(#gaugeTrack)"
                strokeWidth={11}
                strokeLinecap="round"
                strokeDasharray={251}
                // Clamp between 0 and 40 kt visually
                strokeDashoffset={251}
                animate={{
                  strokeDashoffset:
                    251 - (251 * Math.min(Math.max(speedAvgKts, 0), 40)) / 40,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />

              {/* Needle for gusts */}
              <motion.line
                x1={100}
                y1={110}
                x2={100}
                y2={32}
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                style={{ originX: 100, originY: 110 }}
                initial={{ rotate: -90 }}
                animate={{
                  rotate: -90 + (180 * Math.min(Math.max(gustKts, 0), 40)) / 40,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />

              {/* Center dot */}
              <circle cx={100} cy={110} r={5} fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Tarjetas: Dirección, Velocidad, Temperatura y Humedad */}
      <div className="grid grid-cols-2 gap-8 mt-3">
        {/* Dirección */}
        <div className="bg-white/80 dark:bg-gray-900/60 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm border border-gray-200/60 dark:border-gray-700/60">
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Dirección
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-primary-600 dark:text-primary-400">
              {getWindDirectionCardinal(directionDeg)}
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {getWindDirectionName(directionDeg)}
            </span>
          </div>
        </div>

        {/* Velocidad */}
        <div className="bg-white/80 dark:bg-gray-900/60 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm border border-amber-200/70 dark:border-amber-700/60">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-300 uppercase tracking-wide">
            Velocidad
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-300">
              {Math.round(gustKts)}
            </span>
            <span className="text-sm font-medium text-amber-500 dark:text-amber-300/90">
              kt
            </span>
          </div>
        </div>

        {/* Temperatura */}
        {temperatureC !== undefined && (
          <div className="bg-white/80 dark:bg-gray-900/60 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm border border-orange-200/70 dark:border-orange-700/60">
            <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-300 uppercase tracking-wide">
              Temperatura
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-300">
                {Math.round(temperatureC)}
              </span>
              <span className="text-sm font-medium text-orange-500 dark:text-orange-300/90">
                °C
              </span>
            </div>
          </div>
        )}

        {/* Humedad */}
        {humidityPct !== undefined && (
          <div className="bg-white/80 dark:bg-gray-900/60 rounded-xl px-4 py-3 flex flex-col items-center shadow-sm border border-blue-200/70 dark:border-blue-700/60">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
              Humedad
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-300">
                {Math.round(humidityPct)}
              </span>
              <span className="text-sm font-medium text-blue-500 dark:text-blue-300/90">
                %
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
