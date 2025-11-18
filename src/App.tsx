import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { useFirebaseAuth } from './app/useFirebaseAuth';
import './i18n/config';

function App() {
  const { isAuthenticating, error } = useFirebaseAuth();

  // Show loading while authenticating
  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Conectando...</p>
        </div>
      </div>
    );
  }

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

  return <RouterProvider router={router} />;
}

export default App;
