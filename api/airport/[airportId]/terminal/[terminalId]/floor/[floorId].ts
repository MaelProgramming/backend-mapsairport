import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { airportId, terminalId, floorId } = req.query;

  try {
    const floorDoc = await db
      .collection("airports").doc(airportId as string)
      .collection("terminals").doc(terminalId as string)
      .collection("floors").doc(floorId as string)
      .get();

    if (!floorDoc.exists) return res.status(404).json({ error: "Document introuvable" });

    const data = floorDoc.data();
    
    // On récupère 'areas' (ton objet avec l'ID et le Type)
    const areaBase = data?.areas || {};
    
    // On récupère 'path' qui est AU PREMIER NIVEAU du document (data.path)
    const rawPath = data?.path || [];
    
    // Conversion Map ou Array en Array propre
    const points = Array.isArray(rawPath) ? rawPath : Object.values(rawPath);

    const cleanPath = points.map((p: any) => ({
      lat: Number(p.lat),
      lng: Number(p.lng)
    })).filter(p => !isNaN(p.lat) && !isNaN(p.lng));

    // On fusionne les deux pour Melio
    const finalArea = {
      id: areaBase.id || "t4-main-outline",
      name: areaBase.label || data?.label || "Niveau 0 - Arrivées",
      type: areaBase.type || "terminal",
      path: cleanPath 
    };

    return res.status(200).json({
      id: floorDoc.id,
      label: data?.label || finalArea.name,
      level: data?.level ?? 0,
      areas: [finalArea]
    });

  } catch (error: any) {
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
}