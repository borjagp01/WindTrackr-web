import { motion } from 'framer-motion';
import { getWindDirectionCardinal, getWindDirectionName } from '@/utils';

interface WindCompassProps {
  directionDeg: number;
  speedAvgKts: number;
  gustKts: number;
}

export function WindCompass({
  directionDeg,
  speedAvgKts,
  gustKts,
}: WindCompassProps) {
  const windIntensity =
    speedAvgKts > 20 ? 'strong' : speedAvgKts > 10 ? 'moderate' : 'light';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Clean Compass Circle */}
        <div className="relative w-72 h-72 mb-6">
          {/* Background circles for depth */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288">
            <defs>
              {/* Subtle gradient for background */}
              <radialGradient id="bgGradient">
                <stop
                  offset="0%"
                  stopColor="rgb(249, 250, 251)"
                  className="dark:stop-color-gray-900"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(243, 244, 246)"
                  className="dark:stop-color-gray-800"
                />
              </radialGradient>

              {/* Arrow gradient */}
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
                      ? '#ef4444'
                      : windIntensity === 'moderate'
                        ? '#f59e0b'
                        : '#3b82f6'
                  }
                />
                <stop
                  offset="100%"
                  stopColor={
                    windIntensity === 'strong'
                      ? '#b91c1c'
                      : windIntensity === 'moderate'
                        ? '#d97706'
                        : '#1d4ed8'
                  }
                />
              </linearGradient>
            </defs>

            {/* Outer circle - background */}
            <circle
              cx="144"
              cy="144"
              r="140"
              fill="url(#bgGradient)"
              className="dark:fill-gray-800/50"
            />

            {/* Main compass ring */}
            <circle
              cx="144"
              cy="144"
              r="130"
              fill="white"
              className="dark:fill-gray-900"
              stroke="rgb(229, 231, 235)"
              strokeWidth="2"
            />

            {/* Degree markers - thin lines every 10° */}
            {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
              const isCardinal = deg % 90 === 0;
              const isMajor = deg % 30 === 0;
              const radian = ((deg - 90) * Math.PI) / 180;
              const startRadius = isCardinal ? 105 : isMajor ? 115 : 120;
              const endRadius = isCardinal ? 85 : isMajor ? 100 : 110;

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
                    isCardinal ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)'
                  }
                  className={
                    isCardinal
                      ? 'dark:stroke-primary-500'
                      : 'dark:stroke-gray-600'
                  }
                  strokeWidth={isCardinal ? 3 : isMajor ? 2 : 1}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Cardinal direction labels with better positioning */}
            <text
              x="144"
              y="35"
              textAnchor="middle"
              className="fill-primary-600 dark:fill-primary-400 font-bold text-2xl"
            >
              N
            </text>
            <text
              x="253"
              y="150"
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400 font-semibold text-lg"
            >
              E
            </text>
            <text
              x="144"
              y="260"
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400 font-semibold text-lg"
            >
              S
            </text>
            <text
              x="35"
              y="150"
              textAnchor="middle"
              className="fill-gray-500 dark:fill-gray-400 font-semibold text-lg"
            >
              O
            </text>
          </svg>

          {/* Rotating arrow - Physics-based animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: directionDeg }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              mass: 0.8,
            }}
          >
            <svg
              width="32"
              height="160"
              viewBox="0 0 32 160"
              className="drop-shadow-2xl"
            >
              {/* Arrow body with gradient */}
              <path
                d="M 16 10 L 10 30 L 13 30 L 13 150 L 19 150 L 19 30 L 22 30 Z"
                fill="url(#arrowGradient)"
                strokeWidth="1.5"
                stroke="rgba(0,0,0,0.1)"
              />

              {/* Arrow tip - sharp point */}
              <path
                d="M 16 0 L 8 25 L 16 18 L 24 25 Z"
                fill="url(#arrowGradient)"
                strokeWidth="1.5"
                stroke="rgba(0,0,0,0.1)"
              />

              {/* Shine effect on arrow */}
              <path
                d="M 15 12 L 14 28 L 15 28 L 15 145 L 16 145 L 16 28 L 17 28 L 16 12 Z"
                fill="white"
                opacity="0.3"
              />
            </svg>
          </motion.div>

          {/* Center dot with pulse effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative w-8 h-8 rounded-full ${
                windIntensity === 'strong'
                  ? 'bg-red-500'
                  : windIntensity === 'moderate'
                    ? 'bg-amber-500'
                    : 'bg-primary-500'
              } shadow-lg`}
            >
              <div
                className={`absolute inset-0 rounded-full animate-ping ${
                  windIntensity === 'strong'
                    ? 'bg-red-500'
                    : windIntensity === 'moderate'
                      ? 'bg-amber-500'
                      : 'bg-primary-500'
                } opacity-75`}
              />
              <div className="absolute inset-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        {/* Wind data - Clean minimal cards */}
        <div className="w-full space-y-3 mt-4">
          {/* Speed metrics */}
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Direction speed */}
            {/* Main direction display */}
            <motion.div
              className="bg-gradient-to-br from-primary-50 via-blue-50 to-primary-50 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-primary-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-xl p-5 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Dirección
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  {directionDeg}°
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-4xl font-black text-primary-600 dark:text-primary-400">
                  {getWindDirectionCardinal(directionDeg)}
                </div>
                <div className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  {getWindDirectionName(directionDeg)}
                </div>
              </div>
            </motion.div>

            {/* Gust speed */}
            <motion.div
              className={`border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                windIntensity === 'strong'
                  ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-300 dark:border-red-800'
                  : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">
                  Rachas
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-3xl font-black ${
                    windIntensity === 'strong'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {Math.round(gustKts)}
                </span>
                <span className="text-sm font-medium text-orange-500 dark:text-orange-400">
                  kt
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
