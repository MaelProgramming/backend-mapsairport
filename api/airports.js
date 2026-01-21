import express from "express"
import fs from "fs"
import path from "path"

const router = express.Router()

const __dirname = new URL(".", import.meta.url).pathname
const dataPath = path.join(__dirname, "../data/airports.json")
const airports = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

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
