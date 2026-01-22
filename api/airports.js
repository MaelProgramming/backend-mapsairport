import express from "express";
import { db } from "./firebase.js";

const router = express.Router();

// GET /shops → tous les shops
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("airports").get();
    const airports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(airports);
  } catch (err) {
    console.error("Erreur Firestore :", err);
    res.status(500).json({ error: "Impossible de récupérer les aéroports" });
  }
});

// GET /shops/:id → shop spécifique
router.get("/:id", async (req, res) => {
  try {
    const doc = await db.collection("airports").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: "Airport not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Erreur Firestore :", err);
    res.status(500).json({ error: "Impossible de récupérer l'aéroport" });
  }
});

export default router;
