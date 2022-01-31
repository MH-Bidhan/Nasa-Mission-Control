const fs = require("fs");
const { parse } = require("csv-parse");

const habitablePlanets = [];

const isHabitable = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};

function loadPlanetData() {
  return new Promise((resolved, rejected) => {
    fs.createReadStream("data/keplar-data.csv")
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (planet) => {
        if (isHabitable(planet)) habitablePlanets.push(planet);
      })
      .on("error", (error) => {
        console.log(error);
        rejected(error);
      })
      .on("end", () => {
        console.log(
          `Request fulfilled, ${habitablePlanets.length} planets found.`
        );
        resolved();
      });
  });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  getAllPlanets,
  loadPlanetData,
};
