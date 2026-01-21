import fs from "fs"
import path from "path"

const __dirname = new URL(".", import.meta.url).pathname
const dataPath = path.join(__dirname, "../data/airports.json")
const airports = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

export default airports