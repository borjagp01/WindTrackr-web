import { Outlet } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { FirebaseDebugPanel } from '@/components/FirebaseDebugPanel';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <FirebaseDebugPanel />
    </div>
  );
}
