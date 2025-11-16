/**
 * Script to check Firebase authentication status and token
 */

import { auth, authenticate } from './firebase-node';

async function checkAuth() {
  console.log('🔍 Checking Firebase Authentication...\n');

  try {
    // Authenticate
    await authenticate();
    console.log('');

    // Get current user
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No user authenticated');
      return;
    }

    console.log('👤 User Information:');
    console.log(`   UID: ${user.uid}`);
    console.log(`   Anonymous: ${user.isAnonymous}`);
    console.log(`   Provider: ${user.providerData.length > 0 ? user.providerData[0].providerId : 'anonymous'}`);

    // Get ID token
    const token = await user.getIdToken();
    console.log('\n🔑 ID Token (first 50 chars):');
    console.log(`   ${token.substring(0, 50)}...`);

    // Decode token claims
    const tokenResult = await user.getIdTokenResult();
    console.log('\n📋 Token Claims:');
    console.log(`   Issued at: ${new Date(tokenResult.issuedAtTime).toISOString()}`);
    console.log(`   Expires at: ${new Date(tokenResult.expirationTime).toISOString()}`);
    console.log(`   Auth time: ${new Date(tokenResult.authTime).toISOString()}`);

    console.log('\n✅ Authentication check complete');

  } catch (error) {
    console.error('❌ Error checking auth:', error);
  }
}

checkAuth()
  .then(() => {
    console.log('\n👋 Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
