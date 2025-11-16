/**
 * Firebase configuration for Node.js scripts
 * Uses dotenv to load environment variables instead of import.meta.env
 * Includes anonymous authentication for database access
 */

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate that required environment variables are present
const requiredVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_DATABASE_URL', 'VITE_FIREBASE_PROJECT_ID'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nMake sure you have a .env file with these variables set.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getDatabase(app);
export const auth = getAuth(app);

/**
 * Authenticate anonymously with Firebase
 * Required for database access when auth rules require auth != null
 */
export async function authenticate(): Promise<void> {
  try {
    // Wait for auth state to be ready
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('🔐 Authenticated anonymously with Firebase');
          console.log(`   User ID: ${user.uid}`);
          unsubscribe();
          resolve();
        }
      });

      // Trigger sign in
      signInAnonymously(auth).catch((error) => {
        unsubscribe();
        throw error;
      });
    });

    // Give it a moment to fully propagate
    await new Promise(resolve => setTimeout(resolve, 500));
  } catch (error) {
    console.error('❌ Failed to authenticate:', error);
    throw error;
  }
}

export default app;
