// Script to generate realistic mock weather data
// Run with: node scripts/generateMockData.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Station configurations with typical wind patterns
const stationConfigs = {
  'tarifa-los-lances': {
    windSpeedAvg: 18,
    windSpeedVar: 8,
    gustFactor: 1.4,
    tempAvg: 19,
    tempVar: 5,
    humidityAvg: 70,
    pressureAvg: 1013,
  },
  'guadalmesi': {
    windSpeedAvg: 22,
    windSpeedVar: 10,
    gustFactor: 1.5,
    tempAvg: 18,
    tempVar: 6,
    humidityAvg: 65,
    pressureAvg: 1012,
  },
  'valdevaqueros': {
    windSpeedAvg: 20,
    windSpeedVar: 9,
    gustFactor: 1.45,
    tempAvg: 19,
    tempVar: 5,
    humidityAvg: 72,
    pressureAvg: 1014,
  },
  'punta-paloma': {
    windSpeedAvg: 19,
    windSpeedVar: 7,
    gustFactor: 1.35,
    tempAvg: 20,
    tempVar: 4,
    humidityAvg: 68,
    pressureAvg: 1013,
  },
  'cabo-trafalgar': {
    windSpeedAvg: 16,
    windSpeedVar: 6,
    gustFactor: 1.3,
    tempAvg: 20,
    tempVar: 5,
    humidityAvg: 75,
    pressureAvg: 1015,
  },
};

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function generateWindDirection() {
  // Tarifa typical winds: Levante (E) or Poniente (W)
  return Math.random() > 0.5 ? random(70, 110) : random(250, 290);
}

function generateReading(stationId, timestamp, config) {
  const baseSpeed = config.windSpeedAvg + random(-config.windSpeedVar, config.windSpeedVar);
  const windSpeed = Math.max(0, baseSpeed);
  const windGust = windSpeed * config.gustFactor;

  return {
    stationId,
    timestamp: timestamp.toISOString(),
    windSpeedKts: Math.round(windSpeed * 10) / 10,
    windGustKts: Math.round(windGust * 10) / 10,
    windDirectionDeg: Math.round(generateWindDirection()),
    temperatureC: Math.round((config.tempAvg + random(-config.tempVar, config.tempVar)) * 10) / 10,
    humidityPct: Math.round(config.humidityAvg + random(-10, 10)),
    pressureHPa: Math.round(config.pressureAvg + random(-5, 5)),
  };
}

function generate24hReadings(stationId, config) {
  const readings = [];
  const now = new Date();

  // Generate readings every 10 minutes for last 24 hours
  for (let i = 144; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
    readings.push(generateReading(stationId, timestamp, config));
  }

  return readings;
}

function generate7dReadings(stationId, config) {
  const readings = [];
  const now = new Date();

  // Generate readings every 30 minutes for last 7 days (downsampled)
  for (let i = 336; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
    readings.push(generateReading(stationId, timestamp, config));
  }

  return readings;
}

function generateForecast(stationId, config) {
  const hourly = [];
  const now = new Date();

  // Generate forecast for next 48 hours, every hour
  for (let i = 1; i <= 48; i++) {
    const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
    const baseSpeed = config.windSpeedAvg + random(-config.windSpeedVar / 2, config.windSpeedVar / 2);
    const windSpeed = Math.max(0, baseSpeed);

    hourly.push({
      timestamp: timestamp.toISOString(),
      windKts: Math.round(windSpeed * 10) / 10,
      gustKts: Math.round(windSpeed * config.gustFactor * 10) / 10,
      directionDeg: Math.round(generateWindDirection()),
      tempC: Math.round((config.tempAvg + random(-config.tempVar / 2, config.tempVar / 2)) * 10) / 10,
    });
  }

  return { stationId, hourly };
}

// Generate all mock data
const mockDir = path.join(__dirname, '../public/mock');
if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir, { recursive: true });
}

Object.keys(stationConfigs).forEach((stationId) => {
  const config = stationConfigs[stationId];

  // Generate 24h readings
  const readings24h = generate24hReadings(stationId, config);
  fs.writeFileSync(
    path.join(mockDir, `readings_${stationId}_24h.json`),
    JSON.stringify(readings24h, null, 2)
  );

  // Generate 7d readings
  const readings7d = generate7dReadings(stationId, config);
  fs.writeFileSync(
    path.join(mockDir, `readings_${stationId}_7d.json`),
    JSON.stringify(readings7d, null, 2)
  );

  // Generate forecast
  const forecast = generateForecast(stationId, config);
  fs.writeFileSync(
    path.join(mockDir, `forecast_${stationId}.json`),
    JSON.stringify(forecast, null, 2)
  );

  console.log(`✅ Generated mock data for ${stationId}`);
});

console.log('\n🎉 All mock data generated successfully!');
