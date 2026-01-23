export default function handler(req, res) {
  // Carte indoor vide
  const airport = {
    id: "empty-airport",
    name: "Carte vide",
    latitude: 0.0,
    longitude: 0.0,
    floors: [
      {
        level: 0,
        name: "Rez-de-chaussée",
        areas: [],
        markers: []
      },
      {
        level: 1,
        name: "Étage 1",
        areas: [],
        markers: []
      }
    ]
  };

  res.status(200).json(airport);
}
