import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_SECRET);
    
    // Correction cruciale pour la clé privée
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialisé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Firebase Admin :", error);
  }
}

db = admin.firestore();

export { db };