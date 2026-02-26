import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Interfaces
interface GeoPosition {
  lat: number;
  lng: number;
}

interface Area {
  id: string;
  name: string;
  type: 'shop' | 'gate' | 'lounge' | 'security';
  coords: [number, number][]; // Corrigé : un tableau de couples [lng, lat]
}

interface Marker {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Floor {
  name: string;
  level: number;
  areas: Area[];
  markers: Marker[];
}

interface Airport {
  name: string;
  position: GeoPosition;
  floors: Floor[];
}

// Initialisation Firebase
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
const auth = getAuth();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Vérification Auth DIRECTE (avant de toucher à la DB pour économiser tes quotas)
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Optionnel : décommenter pour vraiment valider le token sur ton Realme 12 5G
    // await auth.verifyIdToken(token);

    const { airportId, terminalId } = req.query;

    if (typeof airportId !== 'string' || typeof terminalId !== 'string') {
      return res.status(400).json({ error: "IDs invalides" });
    }

    // 2. Fetch Firestore
    const doc = await db.collection("airports").doc(airportId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Aéroport non trouvé" });
    }

    const airport = doc.data() as Airport;
    const floorIndex = parseInt(terminalId);
    const floor = airport.floors && airport.floors[floorIndex];

    if (!floor) {
      return res.status(404).json({ error: `Étage/Terminal ${terminalId} introuvable` });
    }

    // 3. Calcul dynamique du ViewBox (pour éviter que le T4 soit déformé)
    const allCoords = floor.areas.flatMap(a => a.coords);
    let viewBox = "0 0 1000 800"; // Fallback

    if (allCoords.length > 0) {
      const lngs = allCoords.map(c => c[0]);
      const lats = allCoords.map(c => c[1]);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      
      const w = maxLng - minLng;
      const h = maxLat - minLat;
      const pad = 0.1; // 10% de marge
      viewBox = `${minLng - w*pad} ${minLat - h*pad} ${w * (1 + 2*pad)} ${h * (1 + 2*pad)}`;
    }

    // 4. Cache Vercel & Réponse (Max 1GB/jour de download gratuit)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    return res.status(200).json({
      airport: airport.name,
      location: airport.position,
      data: {
        floorName: floor.name,
        level: floor.level,
        areas: floor.areas,
        markers: floor.markers,
        viewBox
      }
    });

  } catch (error: unknown) {
    console.error("Erreur Melio Backend:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: "Erreur Serveur", details: errorMessage });
  }
}