import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    const privateKey = Buffer
      .from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64")
      .toString("utf8");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log("✅ Firebase Admin initialisé correctement");
  } catch (err) {
    console.error("❌ Firebase Admin init error:", err.message);
  }
}

db = admin.firestore();
export { db };
