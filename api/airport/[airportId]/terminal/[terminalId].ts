import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialisation Firebase Admin (Singleton pattern)
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
  // 1. Configuration CORS pour ton frontend Firebase Hosting
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. On ne permet que le GET pour la lecture du plan
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Méthode non autorisée. Utilisez GET." });
  }

  // 3. Récupération des paramètres dynamiques de l'URL
  const { airportId, terminalId } = req.query;

  if (!airportId || !terminalId) {
    return res.status(400).json({ error: "Paramètres airportId ou terminalId manquants." });
  }

  try {
    // 4. Lecture dans la sous-collection "terminals"
    const terminalDoc = await db
      .collection("airports")
      .doc(airportId as string)
      .collection("terminals")
      .doc(terminalId as string)
      .get();

    if (!terminalDoc.exists) {
      return res.status(404).json({ error: `Terminal ${terminalId} introuvable pour l'aéroport ${airportId}.` });
    }

    // 5. Envoi des données (les polygones GeoJSON du T4 que tu viens d'uploader)
    return res.status(200).json(terminalDoc.data());

  } catch (error: any) {
    console.error("❌ Erreur Récupération Melio:", error);
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}