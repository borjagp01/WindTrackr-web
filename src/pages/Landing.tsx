import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useStationsRealtime } from '@/features/stations/hooks';
import DotGrid from '@/components/DotGrid/DotGrid';
import { WindParticles } from '@/components/WindParticles';
import windAnimation from '@/assets/wind-lottie.json';

export function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stations } = useStationsRealtime();
  const [search, setSearch] = useState('');

  const filteredStations = useMemo(() => {
    if (!search) return stations;
    const searchLower = search.toLowerCase();
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(searchLower) ||
        s.description?.toLowerCase().includes(searchLower)
    );
  }, [stations, search]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* DotGrid Background */}
      <div className="absolute inset-0 opacity-60 dark:opacity-40">
        <DotGrid
          dotSize={8}
          gap={20}
          baseColor="#94a3b8"
          activeColor="#3b82f6"
          proximity={150}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center">
            <div className="w-32 h-32">
              <Lottie animationData={windAnimation} loop={true} />
            </div>
          </div>
          <motion.div
            className="inline-block blur-div"
            style={{ ['--blur-o' as any]: 0 }}
            animate={{ ['--blur-o' as any]: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.h1
              layoutId="app-title"
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="hero-app-title relative z-10 text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            >
              WindTrackr
            </motion.h1>
            <p className="text-xl text-gray-600 relative z-10 dark:text-gray-300 mb-2">
              Datos meteorológicos en tiempo real
            </p>
            <p className="text-gray-500 relative z-10 dark:text-gray-400">
              Selecciona una estación para ver los datos
            </p>
          </motion.div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar estaciones por nombre, ubicación..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all"
            />
            <svg
              className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Station Count centrado verticalmente */}
        <div className="flex items-center justify-center mb-8">
          {/* Blur animates immediately on mount; text opacity animates with slight delay */}
          <motion.div
            className="text-center blur-div"
            style={{ ['--blur-o' as any]: 0 }}
            animate={{ ['--blur-o' as any]: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400 relative z-10"
            >
              {filteredStations.length === stations.length
                ? `${stations.length} ${stations.length === 1 ? 'estación disponible' : 'estaciones disponibles'}`
                : `${filteredStations.length} de ${stations.length} estaciones`}
            </motion.p>
          </motion.div>
        </div>

        {/* Stations Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {filteredStations.map((station, index) => (
            <motion.button
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{
                scale: 1.03,
                y: -4,
                transition: { duration: 0.15 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/station/${station.id}`)}
              className="group relative text-left p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500 rounded-2xl shadow-lg hover:shadow-2xl transition-[border-color,box-shadow] duration-200 overflow-hidden"
            >
              {/* Wind particles animation on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <WindParticles particleCount={15} color="#3b82f6" speed={2} />
              </div>

              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Content */}
              <div className="relative">
                {/* Header with status badge */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {station.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      station.status === 'online'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : station.status === 'offline'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {t(`station.status.${station.status}`)}
                  </span>
                </div>

                {/* Description */}
                {station.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {station.description}
                  </p>
                )}

                {/* Location info */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <span>
                      {station.location.lat.toFixed(4)},{' '}
                      {station.location.lon.toFixed(4)}
                    </span>
                  </div>
                </div>

                {/* Arrow icon */}
                <div className="absolute bottom-4 right-4 text-primary-500 dark:text-primary-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* No results message */}
        {/* Only show 'no results' if not loading and stations are loaded */}
        {filteredStations.length === 0 && stations && stations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              className="blur-div"
              style={{ ['--blur-o' as any]: 0 }}
              animate={{ ['--blur-o' as any]: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <p className="text-gray-500 relative z-10 dark:text-gray-400 text-lg">
                No se encontraron estaciones que coincidan con "{search}"
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Quick access to map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/map')}
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Ver mapa de estaciones
          </button>
        </motion.div>
      </div>
    </div>
  );
}
