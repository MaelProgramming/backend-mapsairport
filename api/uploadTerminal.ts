import axios from 'axios';

// 1. Tes coordonnées GeoJSON hardcodées
const T4_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "T4 - Zone Principale",
        level: 0
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-3.593028137764179, 40.49249439743804],
            [-3.5931856517656797, 40.49249439743804],
            [-3.5931856517656797, 40.49010780973782],
            [-3.592967555455857, 40.49010780973782],
            [-3.592979671917192, 40.48959177961535],
            [-3.591343949593778, 40.489619424186685],
            [-3.591247017899576, 40.48613957636897],
            [-3.5904344695306065, 40.48613957636897],
            [-3.5904344695306065, 40.49692983951789],
            [-3.5911845141784795, 40.49683477869553],
            [-3.59137202534086, 40.49293716904077],
            [-3.592997122078856, 40.49293716904077],
            [-3.5932471369614802, 40.492034032056154],
            [-3.593028137764179, 40.49249439743804] 
          ]
        ]
      }
    }
  ]
};

// 2. Configuration de l'envoi
const API_URL = 'http://localhost:3000/api/uploadTerminal'; // Ton endpoint Vercel
const privateKey =  process.env.ADMIN_SECRET_KEY
const syncGeometry = async () => {
  console.log("🚀 Melio : Initialisation de la synchronisation T4...");

  try {
    const response = await axios.post(API_URL, {
      airportId: "mad-barajas", // ID dans Firestore [cite: 2026-02-07]
      terminalId: "t4-main",
      name: "Terminal 4",
      level: 0,
      areas: T4_GEOJSON.features.map(f => ({
        id: "t4-zone-1",
        name: f.properties.name,
        type: "hall",
        coords: f.geometry.coordinates[0] // On envoie le premier anneau du polygone
      })),
      markers: [
        { id: "starbucks-t4", label: "Starbucks", x: -3.591, y: 40.491 } // Coordonnées GPS réelles
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Succès :", response.data.message);
  } catch (error: any) {
    console.error("❌ Échec de la synchro :", error.response?.data || error.message);
  }
};

syncGeometry();