import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // On récupère la clé et on traite les sauts de ligne
    const privateKey = process.env.FIREBASE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Certaines variables d'environnement Firebase sont manquantes.");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey,
      }),
    });

    console.log("Firebase Admin initialisé via variables séparées.");
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error.message);
  }
}

db = admin.firestore();

export { db };