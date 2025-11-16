import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/app/firebase';

interface FirebaseStatus {
  connected: boolean;
  dataSource: string;
  stationsCount?: number;
  error?: string;
  userId?: string;
  isAuthenticated: boolean;
}

/**
 * Debug component to show Firebase connection status.
 * Only visible in development mode.
 *
 * Shows:
 * - Current data source (mock vs firebase)
 * - Firebase connection status
 * - Number of stations found in Firebase
 * - Any connection errors
 */
export function FirebaseDebugPanel() {
  const [status, setStatus] = useState<FirebaseStatus>({
    connected: false,
    dataSource: import.meta.env.VITE_DATA_SOURCE || 'mock',
    isAuthenticated: false
  });

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setStatus(prev => ({
        ...prev,
        isAuthenticated: !!user,
        userId: user?.uid
      }));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function checkFirebase() {
      if (status.dataSource !== 'firebase') {
        return;
      }

      try {
        const stationsRef = ref(db, 'weather_stations');
        const snapshot = await get(stationsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const count = Array.isArray(data)
            ? data.length
            : Object.keys(data).length;

          setStatus(prev => ({
            ...prev,
            connected: true,
            stationsCount: count,
            error: undefined
          }));
        } else {
          setStatus(prev => ({
            ...prev,
            connected: true,
            stationsCount: 0,
            error: 'No data found in Firebase'
          }));
        }
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    }

    checkFirebase();
  }, [status.dataSource, status.isAuthenticated]);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">🔧 Firebase Debug Panel</div>

      <div className="space-y-1">
        <div>
          <span className="text-gray-400">Data Source:</span>{' '}
          <span className="font-mono">{status.dataSource}</span>
        </div>

        {status.dataSource === 'firebase' && (
          <>
            <div>
              <span className="text-gray-400">Auth:</span>{' '}
              <span className={status.isAuthenticated ? 'text-green-400' : 'text-red-400'}>
                {status.isAuthenticated ? '● Authenticated' : '● Not authenticated'}
              </span>
            </div>

            {status.userId && (
              <div>
                <span className="text-gray-400">User ID:</span>{' '}
                <span className="font-mono text-[10px]">{status.userId.substring(0, 8)}...</span>
              </div>
            )}

            <div>
              <span className="text-gray-400">DB Status:</span>{' '}
              <span className={status.connected ? 'text-green-400' : 'text-red-400'}>
                {status.connected ? '● Connected' : '● Disconnected'}
              </span>
            </div>

            {status.stationsCount !== undefined && (
              <div>
                <span className="text-gray-400">Stations:</span>{' '}
                <span className="font-mono">{status.stationsCount}</span>
              </div>
            )}

            {status.error && (
              <div className="mt-2 p-2 bg-red-900/50 rounded text-red-200">
                <div className="font-bold">Error:</div>
                <div className="break-words">{status.error}</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
        Refresh page to update status
      </div>
    </div>
  );
}
