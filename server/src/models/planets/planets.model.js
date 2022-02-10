const fs = require("fs");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

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
      .on("data", async (planet) => {
        if (isHabitable(planet)) {
          await savePlanets(planet);
        }
      })
      .on("error", (error) => {
        console.log(error);
        rejected(error);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`Request fulfilled, ${countPlanetsFound} planets found...`);
        resolved();
      });
  });
}

async function getAllPlanets() {
  return await planets.find();
}

async function savePlanets(planet) {
  try {
    await planets.updateOne(
      {
        keplarName: planet.kepler_name,
      },
      {
        keplarName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (e) {
    console.error(e.message);
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetData,
};
