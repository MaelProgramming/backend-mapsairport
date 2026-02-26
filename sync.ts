import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 1. Setup des chemins pour ESM (Windows / Ryzen 5)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 2. Chargement du GeoJSON depuis ton nouveau dossier /data
const geoDataPath = join(__dirname, 'data', 't4-geo.json');

if (!fs.existsSync(geoDataPath)) {
  console.error(`❌ Erreur : Le fichier ${geoDataPath} est introuvable.`);
  process.exit(1);
}

const geoData = JSON.parse(fs.readFileSync(geoDataPath, 'utf8'));

// 3. Configuration de l'appel API Melio
const API_URL = 'https://backend-mapsairport.vercel.app/api/uploadTerminal'; 
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY; // <--- Doit être identique à ton .env.local

const syncMelio = async () => {
  console.log("🚀 Melio : Initialisation de la synchronisation T4...");

  try {
    const response = await axios.post(API_URL, {
      airportId: "mad-barajas", //
      terminalId: "t4-main",
      name: "Terminal 4",
      level: 0,
      areas: geoData.features.map((f: any) => ({
        id: "t4-zone-main",
        name: f.properties.name,
        type: "hall",
        coords: f.geometry.coordinates[0]
      }))
    }, {
      headers: { 
        'Authorization': `Bearer ${ADMIN_SECRET}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Succès Melio :", response.data.message);
  } catch (error: any) {
    console.error("❌ Échec de la synchro :");
    if (error.code === 'ECONNREFUSED') {
      console.error("Le serveur 'vercel dev' n'est pas lancé sur le port 3000.");
    } else {
      console.error(error.response?.data || error.message);
    }
  }
};

syncMelio();