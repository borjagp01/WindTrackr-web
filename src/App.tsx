import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useFirebaseAuth } from './app/useFirebaseAuth';
import './i18n/config';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';

function App() {
  const { isAuthenticating, error } = useFirebaseAuth();

  // Error state still takes over entirely

  // Show error if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Error de autenticación
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No se pudo conectar con Firebase. Por favor, verifica:
          </p>
          <ul className="text-left text-sm text-gray-600 dark:text-gray-400 mb-6">
            <li>• Autenticación anónima habilitada en Firebase Console</li>
            <li>• Configuración correcta en .env</li>
            <li>• Conexión a internet</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Reintentar
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LayoutGroup id="root-layout">
        <RouterProvider router={router} />
        <AnimatePresence>
          {isAuthenticating && (
            <motion.div
              key="auth-loading"
              className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <motion.h1
                layoutId="app-title"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white select-none"
              >
                WindTrackr
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </>
  );
}

export default App;
