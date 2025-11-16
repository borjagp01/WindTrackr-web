import { useEffect, useState } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Hook to automatically authenticate users anonymously with Firebase.
 * This is required because Firebase Security Rules require auth != null.
 *
 * Usage: Call this hook in App.tsx or a top-level component.
 */
export function useFirebaseAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        console.log('🔐 Firebase: User authenticated', user.uid);
        setIsAuthenticated(true);
        setIsAuthenticating(false);
      } else {
        // No user, sign in anonymously
        console.log('🔐 Firebase: Signing in anonymously...');
        try {
          await signInAnonymously(auth);
          // onAuthStateChanged will be called again with the new user
        } catch (err) {
          console.error('❌ Firebase: Failed to authenticate', err);
          setError(err instanceof Error ? err : new Error('Authentication failed'));
          setIsAuthenticating(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, isAuthenticating, error };
}
