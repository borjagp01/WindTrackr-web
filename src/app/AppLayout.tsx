import { Outlet } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { FirebaseDebugPanel } from '@/components/FirebaseDebugPanel';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main>
        <Outlet />
      </main>
      <FirebaseDebugPanel />
    </div>
  );
}
