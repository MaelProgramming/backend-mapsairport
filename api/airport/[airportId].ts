import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Tes interfaces (Le contrat avec Firestore)
interface FloorData {
  level: number;
  name: string;
  areas: any[]; 
  markers: any[];
}

interface AirportData {
  name: string;
  // Ajoute ici d'autres champs si tu en as en DB (ex: city, country)
}

// Initialisation Singleton du SDK Admin
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

export default async function handler(request: VercelRequest, res: VercelResponse) {
  const { airportId } = request.query;

  // Headers CORS pour ton setup local/Realme
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Récupération du document unique (ex: mad-barajas)
    const airportDoc = await db.collection('airports').doc(airportId as string).get();

    if (!airportDoc.exists) {
      return res.status(404).json({ error: "Aéroport introuvable." });
    }

    // On récupère tout d'un coup
    const data = airportDoc.data();

    // 2. Traitement du tableau 'floors' (qui contient déjà tes maps areas/markers)
    // On ajoute des sécurités (|| []) pour éviter que le front ne crash sur un .map()
    const floors = (data?.floors || []).map((f: any) => ({
      level: f.level,
      name: f.name,
      areas: f.areas || [],
      markers: f.markers || []
    }));

    // 3. Réponse finale triée
    return res.status(200).json({
      id: airportDoc.id,
      name: data?.name,
      position: data?.position, // latitude/longitude de Barajas
      floors: floors.sort((a: any, b: any) => a.level - b.level)
    });

  } catch (error) {
    console.error("Firestore Error:", error);
    return res.status(500).json({ error: "Erreur serveur Melio." });
  }
}