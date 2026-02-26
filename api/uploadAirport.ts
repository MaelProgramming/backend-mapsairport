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
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Sécurité Melio [cite: 2026-02-01, 2026-02-23]
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${process.env.ADMIN_SECRET_KEY}`) return res.status(401).json({ error: "Unauthorized" });

  const { id, name, city, iata, location } = req.body;

  try {
    await db.collection("airports").doc(id).set({
      name,
      city,
      iata,
      center: location, // [lat, lng]
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return res.status(200).json({ message: `Aéroport ${name} mis à jour !` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}