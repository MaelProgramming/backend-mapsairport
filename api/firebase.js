import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Décodage de la clé Base64 en string PEM
      privateKey: Buffer.from(process.env.FIREBASE_KEY_BASE64, "base64").toString("utf8"),
    }),
  });
}

const db = admin.firestore();

export default db;
