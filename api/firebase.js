import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_SECRET);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

export { db };
