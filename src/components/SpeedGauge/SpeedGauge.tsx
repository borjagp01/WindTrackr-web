import { GaugeComponent } from 'react-gauge-component';
interface SpeedGaugeProps {
  speedAvgKts: number;
  gustKts: number;
  maxSpeed?: number;
}

export function SpeedGauge({
  speedAvgKts,
  gustKts,
  maxSpeed = 40,
}: SpeedGaugeProps) {
  return (
    <GaugeComponent
      value={speedAvgKts}
      minValue={0}
      maxValue={maxSpeed}
      type="radial"
      labels={{
        valueLabel: { hide: true },
        tickLabels: {
          type: 'inner',
          ticks: [
            { value: 6 },
            { value: 12 },
            { value: 24 },
            { value: 32 },
            { value: 40 },
          ],
        },
      }}
      arc={{
        colorArray: ['#4affb4ff', '#FF2121'],
        subArcs: [
          { limit: 6 },
          { limit: 12 },
          { limit: 24 },
          { limit: 32 },
          { limit: 40 },
        ],
        padding: 0.02,
        width: 0.3,
      }}
      pointer={{
        elastic: true,
        animationDelay: 0,
        type: 'needle',
      }}
    />
    // <div className="relative w-56 h-56 flex items-center justify-center">
    //   <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
    //     {/* Gauge track 300° - gradiente de izquierda (verde) a derecha (rojo) */}
    //     <defs>
    //       <linearGradient
    //         id="gaugeTrack"
    //         x1="0"
    //         y1="200"
    //         x2="200"
    //         y2="200"
    //         gradientUnits="userSpaceOnUse"
    //       >
    //         <stop offset="0%" stopColor="#0ea5e9" />
    //         <stop offset="15%" stopColor="#0ee969ff" />
    //         <stop offset="25%" stopColor="#16a34a" />
    //         <stop offset="0%" stopColor="#0ea5e9" />
    //         <stop offset="25%" stopColor="#0ea5e9" />
    //         <stop offset="35%" stopColor="#16a34a" />
    //         <stop offset="50%" stopColor="#fbbf24" />
    //         <stop offset="70%" stopColor="#fbbf24" />
    //         <stop offset="85%" stopColor="#dc2626" />
    //         <stop offset="100%" stopColor="#dc2626" />
    //       </linearGradient>
    //     </defs>

    //     <path
    //       d={gaugePath}
    //       fill="none"
    //       stroke="url(#gaugeTrack)"
    //       strokeWidth={12}
    //       strokeLinecap="round"
    //       opacity={0.85}
    //     />

    //     {/* Animated arc for average speed */}
    //     <motion.path
    //       d={gaugePath}
    //       fill="none"
    //       stroke="url(#gaugeTrack)"
    //       strokeWidth={16}
    //       strokeLinecap="round"
    //       strokeDasharray={arcLength}
    //       strokeDashoffset={arcLength}
    //       animate={{
    //         strokeDashoffset:
    //           arcLength -
    //           (arcLength * Math.min(Math.max(speedAvgKts, 0), maxSpeed)) /
    //             maxSpeed,
    //       }}
    //       transition={{ duration: 0.5, ease: 'easeOut' }}
    //     />

    //     {/* Needle for gusts */}
    //     <motion.line
    //       x1={centerX}
    //       y1={centerY}
    //       x2={needleEnd.x}
    //       y2={needleEnd.y}
    //       stroke="white"
    //       strokeWidth={3}
    //       strokeLinecap="round"
    //       initial={{ rotate: 0 }}
    //       animate={{ rotate: 0 }}
    //       transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    //     />

    //     {/* Center dot */}
    //     <circle cx={centerX} cy={centerY} r={5} fill="white" />
    //   </svg>
    // </div>
  );
}
