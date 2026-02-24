import { VercelRequest, VercelResponse } from '@vercel/node';


interface AirportData {
  polygons: Array<{ id: string; type: string; points: string; label: string }>;
  markers: Array<{ id: string; type: string; name: string; position: { x: number; y: number } }>
  viewBox: string;
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Récupération des IDs depuis l'URL
  const { airportId, terminalId } = req.query;
  
  // Sécurité minimale : on vérifie que c'est bien des strings
  if (typeof airportId !== 'string' || typeof terminalId !== 'string') {
    return res.status(400).json({ error: "IDs invalides" });
  }
  // Adding header to manage cache
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  // Ici, tu pourrais charger tes data statiques du T4
  // sans payer un seul centime à Firebase
  const mapData: AirportData = {
    polygons: [
      { id: "hall-a", type: "hall", points: "0,0 100,0 100,50 0,50", label: "Zone Transit" },
      { id: "duty-free-1", type: "shop", points: "20,20 40,20 40,30 20,30", label: "Dufry" }
    ],
    markers: [
      { id: "gate-j52", type: "gate", name: "Porte J52", position: { x: 450, y: 120 } },
      { id: "security-t4", type: "security", name: "Security Checkpoint", position: { x: 300, y: 250 } }
    ],
    viewBox: "0 0 2000 1500"
  }
  return res.status(200).json({
    airport: airportId,
    terminal: terminalId,
    status: "ready",
    data: mapData
  });
}