/**
 * Script to seed Firebase Realtime Database with mock data
 *
 * Run with: npm run seed-firebase
 *
 * This will upload the mock data to Firebase to have test data
 * while the Arduino is being configured or for testing purposes.
 */

import { ref, set } from 'firebase/database';
import { db, authenticate } from './firebase-node';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert wind direction in degrees to cardinal direction
 */
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

async function seedDatabase() {
  console.log('🌱 Seeding Firebase Realtime Database with mock data...\n');

  try {
    // Authenticate anonymously first
    await authenticate();
    console.log('');

    // Load stations
    const stationsPath = path.join(__dirname, '../public/mock/stations.json');
    const stations = JSON.parse(fs.readFileSync(stationsPath, 'utf-8'));

    console.log(`📥 Uploading ${stations.length} stations to /weather_stations...\n`);

    // Process each station
    for (const station of stations) {
      const stationId = station.id;

      // Prepare station data structure
      const stationData: any = {
        metadata: {
          name: station.name,
          location: station.description,
          coordinates: {
            lat: station.location.lat,
            lon: station.location.lon
          },
          elevation: station.location.elevationM || 0,
          provider: station.provider || 'mock',
          status: station.status || 'online'
        }
      };

      // Load and add 24h readings
      const readings24hPath = path.join(__dirname, `../public/mock/readings_${stationId}_24h.json`);
      if (fs.existsSync(readings24hPath)) {
        const readings24h = JSON.parse(fs.readFileSync(readings24hPath, 'utf-8'));

        // Convert array to object with timestamp as key
        const readingsObject = readings24h.reduce((acc: any, reading: any) => {
          const key = reading.timestamp || `reading_${Date.now()}`;
          acc[key] = {
            timestamp: reading.timestamp,
            wind: {
              speed_ms: reading.windSpeedKts / 1.94384, // Convert knots to m/s
              speed_ms_max: reading.windGustKts / 1.94384,
              speed_ms_min: reading.windSpeedKts / 1.94384,
              direction_degrees: reading.windDirectionDeg,
              direction_text: getWindDirection(reading.windDirectionDeg)
            },
            temperature: {
              current_c: reading.temperatureC
            },
            humidity: {
              relative_percent: reading.humidityPct
            },
            pressure: {
              atmospheric_hpa: reading.pressureHPa
            }
          };
          return acc;
        }, {});

        stationData.readings = readingsObject;
        console.log(`  📈 Prepared ${readings24h.length} readings for ${stationId}`);
      }

      // Load and add forecast
      const forecastPath = path.join(__dirname, `../public/mock/forecast_${stationId}.json`);
      if (fs.existsSync(forecastPath)) {
        const forecast = JSON.parse(fs.readFileSync(forecastPath, 'utf-8'));
        stationData.forecast = forecast;
        console.log(`  🌤️  Prepared forecast for ${stationId}`);
      }

      // Upload entire station data
      await set(ref(db, `weather_stations/${stationId}`), stationData);
      console.log(`  ✅ Uploaded station ${stationId}\n`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database seeded successfully!');
    console.log('\nYou can now test the app with Firebase data.');
    console.log('Run: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);

      // Provide helpful guidance for common errors
      if (error.message.includes('Permission denied')) {
        console.log('\n' + '='.repeat(60));
        console.log('🔒 PERMISSION DENIED - Firebase Security Rules');
        console.log('='.repeat(60));
        console.log('\nYour Firebase database has security rules that prevent writing.');
        console.log('\nPossible causes:');
        console.log('1. Anonymous authentication is not enabled');
        console.log('2. Database rules don\'t allow authenticated users to write');
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
    process.exit(1);
  }
}

// Run seeding
seedDatabase()
  .then(() => {
    console.log('\n👋 Done');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
