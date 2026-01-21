import express from "express"
import airports from "../data/airports.json" assert { type: "json" }

const router = express.Router()

router.get("/", (req, res) => {
  res.json(airports)
})

router.get("/:id", (req, res) => {
  const airport = airports.find(a => a.id === req.params.id)
  if (!airport) {
    return res.status(404).json({ error: "Airport not found" })
  }
  res.json(airport)
})

export default router
