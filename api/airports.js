import express from "express";
import { db } from "./firebase.js";

const router = express.Router();

// GET /airports → tous les aéroports
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("airports").get();
    
    // Si la collection est vide, on renvoie un tableau vide plutôt qu'une erreur
    const airports = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    
    res.json(airports);
  } catch (err) {
    console.error("Erreur Firestore (Full List):", err.message);
    res.status(500).json({ error: "Impossible de récupérer les aéroports", details: err.message });
  }
});

// GET /airports/:id → un aéroport spécifique
router.get("/:id", async (req, res) => {
  try {
    // 1. Nettoyage de l'ID : conversion en string, retrait des espaces et du slash final éventuel
    const rawId = req.params.id;
    const cleanId = String(req.params.id).trim();


    console.log(`Tentative de lecture du document ID: "${cleanId}"`);
    const doc = await db.collection("airports").doc(cleanId).get()

    // 3. Vérification de l'existence
    if (!doc.exists) {
      console.warn(`Document "${cleanId}" introuvable dans la collection "airports"`);
      return res.status(404).json({ 
        error: "Airport not found", 
        requestedId: cleanId 
      });
    }

    // 4. Succès
    res.json({ id: doc.id, ...doc.data() });

  } catch (err) {
    // Ce log apparaîtra dans l'onglet "Logs" de Vercel
    console.error("Erreur Firestore (Single Doc):", err);
    
    res.status(500).json({ 
      error: "Impossible de récupérer l'aéroport", 
      message: err.message 
    });
  }
});

export default router;