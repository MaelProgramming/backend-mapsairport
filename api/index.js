export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const airport = {
    id: "gruand-airport",
    name: "Aéroport de Gruand",
    latitude: 48.8566,
    longitude: 2.3522,
    floors: [
      {
        level: 0,
        name: "Rez-de-chaussée",
        areas: [
          { id: "hall1", name: "Hall principal", type: "hall", shape: [{x:50,y:50},{x:300,y:50},{x:300,y:200},{x:50,y:200}] },
          { id: "shop1", name: "Boutique duty-free", type: "shop", shape: [{x:320,y:60},{x:400,y:150},{x:320,y:150}] }
        ],
        markers: [
          { id: "gateA1", name: "Porte A1", type: "gate", position: {x:100,y:100} },
          { id: "toilet0", name: "Toilettes", type: "facility", position: {x:250,y:150} }
        ]
      },
      {
        level: 1,
        name: "Étage 1",
        areas: [
          { id: "hall2", name: "Salon VIP", type: "hall", shape: [{x:50,y:50},{x:300,y:50},{x:300,y:200},{x:50,y:200}] }
        ],
        markers: [
          { id: "gateB1", name: "Porte B1", type: "gate", position: {x:100,y:100} },
          { id: "shop2", name: "Café", type: "shop", position: {x:200,y:150} }
        ]
      }
    ]
  };

  res.status(200).json(airport);
}
