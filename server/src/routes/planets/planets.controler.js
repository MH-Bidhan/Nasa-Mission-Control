const allPlanets = require("../../models/planets.model");

function getAllPlanets(req, res) {
  return res.status(200).json(allPlanets.planets);
}

module.exports = {
  getAllPlanets,
};
