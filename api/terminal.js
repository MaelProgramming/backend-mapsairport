import express from "express"
import fs from "fs"
import path from "path"

const router = express.Router()

const __dirname = new URL(".", import.meta.url).pathname
const dataPath = path.join(__dirname, "../data/terminal.json")
const terminal = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

router.get("/", (req, res) => {
  res.json(terminal)
})

router.get("/:id", (req, res) => {
  const terminal = terminal.find(t => t.id === req.params.id)
  if (!terminal) {
    return res.status(404).json({ error: "Terminal not found" })
  }
  res.json(terminal)
})

export default router
