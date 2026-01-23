import admin from "firebase-admin";

let db;

if (!admin.apps.length) {
  try {
  const secretStr = process.env.SERVICE_ACCOUNT_SECRET;
  if (!secretStr) throw new Error("SERVICE_ACCOUNT_SECRET is undefined");

  const serviceAccount = JSON.parse(secretStr);

  // Nettoyage ultra-précis de la clé
  const formattedKey = serviceAccount.private_key
    .replace(/\\n/g, '\n') // Remplace les doubles backslashs
    .replace(/"/g, '');    // Supprime d'éventuels guillemets résiduels

  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: formattedKey
    })
  });
  console.log("Firebase Admin connecté.");
} catch (error) {
  console.error("Erreur d'initialisation:", error.message);
}
}

db = admin.firestore();

export { db };