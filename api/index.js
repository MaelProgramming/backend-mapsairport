import airports from "./airportsName.js";

export default function handler(req, res){
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Preflight
    if(req.method !== "OPTIONS"){
        return res.status(200).end();
    }

    // Methode unauthorised
    if(req.method !== "GET"){
        return res.status(405).json({ error: "Method Not Allowed"})
    }

    // Response OK
    return res.status(200).json(airports)
}
