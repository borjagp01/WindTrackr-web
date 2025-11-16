/**
 * Script to inspect Firebase Realtime Database structure
 *
 * Run with: npm run inspect-firebase
 *
 * This will help understand the data structure uploaded by the Arduino
 * and verify that our FirebaseDataSource implementation is correct.
 */

import { ref, get } from 'firebase/database';
import { db, auth, authenticate } from './firebase-node';

async function inspectDatabase() {
  console.log('🔍 Inspecting Firebase Realtime Database structure...\n');

  try {
    // Authenticate anonymously first
    await authenticate();
    console.log('');

    // Check current user
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('✅ Current user confirmed:', currentUser.uid);
    } else {
      console.log('⚠️  No current user found after authentication');
    }
    console.log('');

    // Check weather_stations structure (as per Firebase rules)
    const weatherStationsRef = ref(db, '/weather_stations');
    const weatherStationsSnapshot = await get(weatherStationsRef);

    if (!weatherStationsSnapshot.exists()) {
      console.log('❌ No data found at /weather_stations');
      console.log('⚠️  Make sure your Arduino or seed script is writing to /weather_stations');
      return;
    }

    const weatherStationsData = weatherStationsSnapshot.val();
    console.log('📊 Weather Stations structure found');
    console.log('   Station IDs:', Object.keys(weatherStationsData));
    console.log('\n' + '='.repeat(60) + '\n');

    // Inspect each station
    const stationIds = Object.keys(weatherStationsData);
    console.log(`🏠 STATIONS (${stationIds.length} found):\n`);

    for (const stationId of stationIds) {
      const station = weatherStationsData[stationId];
      console.log(`📍 Station: ${stationId}`);

      // Show station info (V1 structure)
      if (station.info) {
        console.log(`   Name: ${station.info.name || 'N/A'}`);
        console.log(`   Location: ${station.info.latitude}, ${station.info.longitude}`);
        console.log(`   Altitude: ${station.info.altitude || 0}m`);
        console.log(`   Province: ${station.info.province || 'N/A'}`);
        console.log(`   Type: ${station.info.station_type || 'N/A'}`);
        if (station.info.version) {
          console.log(`   Version: ${station.info.version}`);
        }
      }

      // Check for readings/history
      const readingsSource = station.history || station.readings;
      if (readingsSource) {
        const readingKeys = Object.keys(readingsSource);
        const sourceType = station.history ? 'history' : 'readings';
        console.log(`   📈 ${sourceType}: ${readingKeys.length} found`);

        if (readingKeys.length > 0) {
          // Show the latest reading
          const latestKey = readingKeys.sort().reverse()[0];
          const latestReading = readingsSource[latestKey];
          console.log(`   Latest reading (${latestReading.datetime || latestKey}):`);
          console.log(`      Temperature: ${latestReading.temperature}°C (read_ok: ${latestReading.temp_hum_read_ok})`);
          console.log(`      Humidity: ${latestReading.humidity}%`);
          console.log(`      Wind: ${latestReading.wind?.speed_kmh}km/h (${latestReading.wind?.speed_knots}kts) ${latestReading.wind?.directionCardinal} (read_ok: ${latestReading.wind?.speed_read_ok})`);
        }
      } else {
        console.log('   📈 Readings: none');
      }

      // Check for current weather (deprecated structure)
      if (station.current) {
        console.log(`   �️  Current (deprecated): available`);
      }

      console.log('');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Inspection complete');

  } catch (error) {
    console.error('❌ Error inspecting database:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);

      // Provide helpful guidance for common errors
      if (error.message.includes('Permission denied')) {
        console.log('\n' + '='.repeat(60));
        console.log('🔒 PERMISSION DENIED - Firebase Security Rules');
        console.log('='.repeat(60));
        console.log('\nYour Firebase database has security rules that prevent reading.');
        console.log('\nPossible causes:');
        console.log('1. Anonymous authentication is not enabled');
        console.log('2. Database rules don\'t allow authenticated users to read');
        console.log('\nTo fix this:');
        console.log('\n1. Enable Anonymous Authentication:');
        console.log('   - Go to: https://console.firebase.google.com/');
        console.log('   - Select your project: windtrackr');
        console.log('   - Navigate to: Authentication > Sign-in method');
        console.log('   - Enable "Anonymous"');
        console.log('\n2. Update Database Rules:');
        console.log('   - Navigate to: Realtime Database > Rules');
        console.log('   - Ensure rules allow authenticated users:');
        console.log('\n   {');
        console.log('     "rules": {');
        console.log('       ".read": "auth != null",');
        console.log('       ".write": "auth != null"');
        console.log('     }');
        console.log('   }');
        console.log('='.repeat(60));
      }
    }
  }
}

// Run inspection
inspectDatabase()
  .then(() => {
    console.log('\n👋 Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
