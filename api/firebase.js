import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    // 1. On nettoie la clé de TOUT caractère parasite (guillemets, espaces, doubles backslashes)
    const rawKey = process.env.FIREBASE_KEY || "";
    const formattedKey = rawKey
      .replace(/\\n/g, '\n') // Change les \n texte en vrais sauts de ligne
      .trim()                // Enlève les espaces au début/fin
      .replace(/^"+|"+$/g, ''); // Enlève les guillemets s'ils ont été collés par erreur

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
    
    console.log("Tentative de connexion avec l'email:", process.env.FIREBASE_CLIENT_EMAIL);
  } catch (error) {
    console.error("Erreur setup admin:", error.message);
  }
}

export const db = admin.firestore();