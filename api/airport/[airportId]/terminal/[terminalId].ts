import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';


// Interfaces
interface GeoPosition {
  lat: number;
  lng: number;
}

interface Area {
  id: string;
  name: string;
  type: 'shop' | 'gate' | 'lounge' | 'security';
  path: string; // SVG path ou coordonnées
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



// On vérifie si Firebase est déjà initialisé pour éviter de crash au warm-up
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // On gère le cas des sauts de ligne dans la clé privée
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Permet de créer directement
const db = getFirestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { airportId, terminalId } = req.query;

  if (typeof airportId !== 'string' || typeof terminalId !== 'string') {
    return res.status(400).json({ error: "IDs invalides" });
  }

  try {
    // 1. Fetch direct dans Firestore
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
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
      return res.status(401).json({ error: 'Authentification requise'})
    }
    // 2. Cache Vercel
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // 3. Réponse propre
    return res.status(200).json({
      airport: airport.name,
      location: airport.position,
      data: {
        floorName: floor.name,
        level: floor.level,
        areas: floor.areas,
        markers: floor.markers,
        viewBox: "0 0 1000 800"
      }
    });

  } catch (error: unknown) {
    console.error("Erreur Melio Backend:", error);
    const errorMessage = error instanceof Error ? error.message: String(error)
    return res.status(500).json({ error: "Erreur Firebase", details: errorMessage });
  }
}