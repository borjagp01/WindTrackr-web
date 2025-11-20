import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import * as readline from 'readline';

// Inicializar Firebase Admin
// Asegúrate de tener el archivo de credenciales o usar las credenciales por defecto
initializeApp({
  databaseURL: 'https://YOUR-PROJECT-ID.firebaseio.com', // Cambiar por tu URL
});

const db = getDatabase();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('🌤️  Configuración de AEMET para estaciones\n');

  try {
    // Leer estaciones existentes
    const stationsRef = db.ref('weather_stations');
    const snapshot = await stationsRef.once('value');
    const stations = snapshot.val();

    if (!stations) {
      console.log('❌ No se encontraron estaciones en la base de datos');
      rl.close();
      return;
    }

    const stationIds = Object.keys(stations);
    console.log(`📍 Encontradas ${stationIds.length} estaciones:\n`);

    stationIds.forEach((id, index) => {
      const station = stations[id];
      console.log(`${index + 1}. ${id} - ${station.name || 'Sin nombre'}`);
    });

    console.log('\n');

    // Configurar cada estación
    for (const stationId of stationIds) {
      const station = stations[stationId];
      console.log(`\n🔧 Configurando: ${station.name || stationId}`);

      const currentIneCode = station.info?.ine_code || '';
      const currentApiKey = station.info?.aemet_api_key || '';

      if (currentIneCode && currentApiKey) {
        console.log(`   ✅ Ya configurada (INE: ${currentIneCode})`);
        const update = await question('   ¿Actualizar? (s/N): ');
        if (update.toLowerCase() !== 's') {
          continue;
        }
      }

      const ineCode = await question(
        `   Código INE del municipio [${currentIneCode}]: `
      );
      const apiKey = await question(
        `   API Key de AEMET [${currentApiKey ? '***' : ''}]: `
      );

      const finalIneCode = ineCode.trim() || currentIneCode;
      const finalApiKey = apiKey.trim() || currentApiKey;

      if (!finalIneCode || !finalApiKey) {
        console.log('   ⚠️  Saltando (faltan datos)');
        continue;
      }

      // Actualizar en Firebase
      await stationsRef.child(`${stationId}/info`).update({
        ine_code: finalIneCode,
        aemet_api_key: finalApiKey,
      });

      console.log('   ✅ Configuración guardada');
    }

    console.log('\n✨ Configuración completada\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
}

main();
