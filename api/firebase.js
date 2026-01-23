import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyEnv = process.env.FIREBASE_KEY;

    if (!projectId || !clientEmail || !privateKeyEnv) {
      throw new Error("Certaines variables d'environnement Firebase sont manquantes.");
    }

    const privateKey = privateKeyEnv.includes("\\n")
      ? privateKeyEnv.replace(/\\n/g, "\n")
      : privateKeyEnv;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log("Firebase Admin initialisé correctement.");
  } catch (error) {
    console.error("Erreur d'initialisation Firebase:", error.message);
  }
}

db = admin.firestore();

export { db };
