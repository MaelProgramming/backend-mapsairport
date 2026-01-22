import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_SECRET);

// 🔑 Remplacer les \n par de vrais sauts de ligne
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
export { db };
