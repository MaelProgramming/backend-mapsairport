import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
    const secretStr = process.env.SERVICE_ACCOUNT_SECRET;
    if (!secretStr) throw new Error("SERVICE_ACCOUNT_SECRET is undefined");

    // On parse le JSON
    const serviceAccount = JSON.parse(secretStr);

    // NETTOYAGE EXTRÊME :
    // 1. On traite les doubles backslashes
    // 2. On retire les guillemets qui entourent parfois la clé
    // 3. On s'assure que la clé commence bien par le header standard
    let privateKey = serviceAccount.private_key;
    
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, '\n');
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
      }
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: privateKey,
      }),
    });

    console.log("Firebase Admin initialisé avec succès.");
  } catch (error) {
    console.error("ERREUR CRITIQUE INITIALISATION:", error.message);
  }
}

db = admin.firestore();
export { db };