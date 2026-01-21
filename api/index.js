import express from "express"
import cors from "cors"

import airports from "./airports.js"
import terminals from "./terminals.js"
import floors from "./floors.js"
import pois from "./pois.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/airports", airports)
app.use("/terminals", terminals)
app.use("/floors", floors)
app.use("/pois", pois)

app.get("/", (req, res) => {
  res.json({ status: "Maps Airport API online ✈️" })
})

export default app
