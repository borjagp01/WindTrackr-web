import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StationMap } from '@/components/StationMap';
import { useStationsRealtime } from '@/features/stations/hooks';
import { WindParticles } from '@/components/WindParticles';
import { motion } from 'framer-motion';

export function Map() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stations, loading } = useStationsRealtime(); // ✨ Real-time

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('map.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Haz click en una estación para ver más detalles
        </p>
      </div>

      <div className="mb-6">
        <StationMap
          stations={stations}
          onStationSelect={(id) => navigate(`/station/${id}`)}
          fitToActive
          height="calc(100vh - 250px)"
        />
      </div>

      {/* Stations grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {stations.map((station, index) => (
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
    </div>
  );
}
