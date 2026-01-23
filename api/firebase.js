import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = Buffer
      .from(process.env.FIREBASE_KEY_BASE64, "base64")
      .toString("utf8");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Variables Firebase manquantes");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log("✅ Firebase Admin initialisé");
  } catch (err) {
    console.error("❌ Firebase Admin init error:", err.message);
  }
}

db = admin.firestore();

export { db };
