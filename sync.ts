import dotenv from 'dotenv';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config({ path: '.env.local' });

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
};

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount as any) });
}

const db = getFirestore();

// Configuration des étages supérieurs pour Melio [cite: 2026-02-23]
const upperFloors = [
  {
    id: 'f2',
    level: 2,
    label: "Terminal 4 - Zone Business",
    area: { id: "business-center", type: "terminal", label: "Centre d'affaires" }
  },
  {
    id: 'f3',
    level: 3,
    label: "Terminal 4 - Restauration & Panoramique",
    area: { id: "sky-view-bar", type: "restaurant", label: "Sky View Bar" }
  }
];

async function syncUpperLevels() {
  const airportId = 'mad-barajas';
  const terminalId = 't4-main';
  const airportRef = db.collection('airports').doc(airportId);

  for (const floor of upperFloors) {
    const floorRef = airportRef
      .collection('terminals')
      .doc(terminalId)
      .collection('floors')
      .doc(floor.id);

    const floorData = {
      level: floor.level,
      updatedAt: FieldValue.serverTimestamp(),
      areas: [
        {
          ...floor.area,
          level: floor.level,
          path: [
            { lat: 40.4912, lng: -3.5932 },
            { lat: 40.4920, lng: -3.5932 },
            { lat: 40.4920, lng: -3.5942 },
            { lat: 40.4912, lng: -3.5942 }
          ]
        }
      ]
    };

    try {
      console.log(`🚀 Syncing level ${floor.level} (${floor.id})...`);
      
      // Injection des données de l'étage [cite: 2026-02-01]
      await floorRef.set(floorData, { merge: true });
      
      // Mise à jour du sélecteur d'étage pour l'UI React [cite: 2026-02-23]
      await airportRef.update({
        floors: FieldValue.arrayUnion({ level: floor.level })
      });

    } catch (error) {
      console.error(`❌ Erreur sur ${floor.id}:`, error);
    }
  }

  console.log("✅ F2 et F3 injectés. Melio est complet.");
  process.exit();
}

syncUpperLevels();