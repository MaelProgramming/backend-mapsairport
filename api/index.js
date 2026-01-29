export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  // =======================
  // Airport: Gruand
  // =======================
  const airportGruand = {
    id: "gruand-airport",
    name: "Aéroport de Gruand",
    latitude: 48.8566,
    longitude: 2.3522,

    floors: [
      {
        level: 0,
        name: "Rez-de-chaussée",
        areas: [
          {
            id: "hall1",
            name: "Hall principal",
            type: "hall",
            shape: [
              { x: 50, y: 50 },
              { x: 300, y: 50 },
              { x: 300, y: 200 },
              { x: 50, y: 200 },
              { x: 50, y: 50 },
            ],
          },
          {
            id: "shop1",
            name: "Boutique duty-free",
            type: "shop",
            shape: [
              { x: 320, y: 60 },
              { x: 400, y: 60 },
              { x: 400, y: 150 },
              { x: 320, y: 150 },
              { x: 320, y: 60 },
            ],
          },
        ],
        markers: [
          {
            id: "gate-a1",
            name: "Porte A1",
            type: "gate",
            position: { x: 100, y: 100 },
          },
          {
            id: "toilet-0",
            name: "Toilettes",
            type: "facility",
            position: { x: 250, y: 150 },
          },
        ],
      },

      {
        level: 1,
        name: "Étage 1",
        areas: [
          {
            id: "vip-lounge",
            name: "Salon VIP",
            type: "hall",
            shape: [
              { x: 50, y: 50 },
              { x: 300, y: 50 },
              { x: 300, y: 200 },
              { x: 50, y: 200 },
              { x: 50, y: 50 },
            ],
          },
        ],
        markers: [
          {
            id: "gate-b1",
            name: "Porte B1",
            type: "gate",
            position: { x: 100, y: 100 },
          },
          {
            id: "cafe-1f",
            name: "Café",
            type: "shop",
            position: { x: 200, y: 150 },
          },
        ],
      },
    ],
  };

  // =======================
  // Airport: Dangas
  // =======================
  const airportDangas = {
    id: "dangas-airport",
    name: "Aéroport de Dangas",
    latitude: 49.9,
    longitude: 3.7522,

    floors: [
      {
        level: 0,
        name: "Rez-de-chaussée",
        areas: [
          {
            id: "hall-main",
            name: "Hall principal",
            type: "hall",
            shape: [
              { x: 30, y: 40 },
              { x: 300, y: 40 },
              { x: 300, y: 200 },
              { x: 30, y: 200 },
              { x: 30, y: 40 },
            ],
          },
          {
            id: "duty-free",
            name: "Boutique duty-free",
            type: "shop",
            shape: [
              { x: 320, y: 60 },
              { x: 420, y: 60 },
              { x: 420, y: 150 },
              { x: 320, y: 150 },
              { x: 320, y: 60 },
            ],
          },
        ],
        markers: [
          {
            id: "gate-a1",
            name: "Porte A1",
            type: "gate",
            position: { x: 120, y: 120 },
          },
          {
            id: "toilet-rdc",
            name: "Toilettes",
            type: "facility",
            position: { x: 250, y: 160 },
          },
        ],
      },

      {
        level: 1,
        name: "Étage 1",
        areas: [
          {
            id: "vip-lounge",
            name: "Salon VIP",
            type: "hall",
            shape: [
              { x: 50, y: 50 },
              { x: 300, y: 50 },
              { x: 300, y: 200 },
              { x: 50, y: 200 },
              { x: 50, y: 50 },
            ],
          },
        ],
        markers: [
          {
            id: "gate-b1",
            name: "Porte B1",
            type: "gate",
            position: { x: 120, y: 120 },
          },
          {
            id: "cafe-1f",
            name: "Café",
            type: "shop",
            position: { x: 220, y: 160 },
          },
        ],
      },
    ],
  };

  // =======================
  // Registry
  // =======================
  const airports = {
    gruand: airportGruand,
    dangas: airportDangas,
  };

  res.status(200).json(airports);
}
