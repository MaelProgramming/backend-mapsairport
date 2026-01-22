import express from "express"
import fs from "fs"
import path from "path"

const router = express.Router()

const __dirname = new URL(".", import.meta.url).pathname
const dataPath = path.join(__dirname, "../data/shops.json")
const shop = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

router.get("/", (req, res) => {
  res.json(shop)
})

router.get("/:id", (req, res) => {
  const shops = shop.find(s => s.id === req.params.id)
  if (!shops) {
    return res.status(404).json({ error: "Shop not found not found" })
  }
  res.json(shops)
})

export default router
