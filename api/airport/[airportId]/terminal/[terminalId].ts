import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// On garde l'init Firebase (Singleton)
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { airportId } = req.query;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const doc = await db.collection("airports").doc(airportId as string).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "Aéroport non trouvé" });
    }

    const airport = doc.data();

    // On ne renvoie PAS les "floors" complets ici pour gagner du poids.
    // On renvoie juste les IDs/Names pour que le front sache quoi fetcher ensuite.
    const terminalsSummary = airport?.floors?.map((f: any, index: number) => ({
      id: index, // On utilise l'index comme ID pour ton fetch suivant
      name: f.name,
      level: f.level
    })) || [];

    return res.status(200).json({
      id: doc.id,
      name: airport?.name,
      location: airport?.position,
      terminals: terminalsSummary
    });

  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur Melio" });
  }
}