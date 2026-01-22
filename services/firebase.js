import admin from 'firebase-admin'
import path from 'path'
import { fileURLToPath } from 'url'


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccount = path.join(__dirname, "../mapsairport-2025-firebase-adminsdk-fbsvc-0caf1a9bc4.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
export { db }
