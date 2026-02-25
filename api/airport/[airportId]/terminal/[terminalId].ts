import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

    const airport: any = doc.data();
    const floorIndex = parseInt(terminalId);
    const floor = airport.floors && airport.floors[floorIndex];

    if (!floor) {
      return res.status(404).json({ error: `Étage/Terminal ${terminalId} introuvable` });
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

  } catch (error: any) {
    console.error("Erreur Melio Backend:", error);
    return res.status(500).json({ error: "Erreur Firebase", details: error.message });
  }
}