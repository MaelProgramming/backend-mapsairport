import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // On récupère la clé et on traite les sauts de ligne
    const privateKey = process.env.FIREBASE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Certaines variables d'environnement Firebase sont manquantes.",
      );
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
    // Remplacez votre throw actuel par celui-ci pour tester
    if (!projectId || !clientEmail || !privateKey) {
      const missing = [];
      if (!projectId) missing.push("PROJECT_ID");
      if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
      if (!privateKey) missing.push("FIREBASE_KEY");
      throw new Error(`Variables manquantes : ${missing.join(", ")}`);
    }
  }
}

db = admin.firestore();

export { db };
