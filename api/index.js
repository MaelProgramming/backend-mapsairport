import express from "express"
import cors from "cors"

import airports from "./airports.js"
import terminal from "./terminal.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/airports", airports)
app.use("/terminal", terminal)
app.get("/health", (req, res) => {
  res.json({ ok: true })
})





app.get("/", (req, res) => {
  res.json({ status: "Maps Airport API online ✈️" })
})

export default app
