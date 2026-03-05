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

// Un petit interface pour pas bosser en aveugle
interface Area {
  id: string;
  label?: string;
  name?: string;
  type?: string;
  path: { lat: number; lng: number }[];
  [key: string]: any; 
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Config CORS propre
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { airportId, terminalId, floorId } = req.query;

  // Check rapide des params
  if (!airportId || !terminalId || !floorId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const floorRef = db
      .collection("airports").doc(airportId as string)
      .collection("terminals").doc(terminalId as string)
      .collection("floors").doc(floorId as string);

    const floorDoc = await floorRef.get();

    if (!floorDoc.exists) {
      return res.status(404).json({ error: "Floor non trouvé dans Firestore" });
    }

    const data = floorDoc.data();
    const rawAreas = (data?.areas as Area[]) || [];

    const cleanAreas = rawAreas.map((area, index) => {
      // On normalise le path : gère les tableaux, les objets et les coordonnées stringifiées
      const rawPath = area.path || [];
      const points = Array.isArray(rawPath) ? rawPath : Object.values(rawPath);

      const cleanPath = points
        .map((p: any) => ({
          lat: typeof p.lat === 'number' ? p.lat : parseFloat(p.lat),
          lng: typeof p.lng === 'number' ? p.lng : parseFloat(p.lng)
        }))
        .filter(p => !isNaN(p.lat) && !isNaN(p.lng));

      return {
        ...area, // On garde tout (important pour ton debug !)
        id: area.id || `area-${index}`,
        // Melio veut probablement 'name', mais ton screen montre 'label'. On met les deux.
        name: area.label || area.name || `Zone ${index}`,
        label: area.label || area.name || `Zone ${index}`,
        path: cleanPath
      };
    });

    // On renvoie tout proprement
    return res.status(200).json({
      id: floorDoc.id,
      label: data?.label || `Niveau ${data?.level ?? 0}`,
      level: data?.level ?? 0,
      areas: cleanAreas 
    });

  } catch (error: any) {
    console.error("Erreur API Melio:", error);
    return res.status(500).json({ 
      error: "Erreur serveur", 
      details: error.message 
    });
  }
}