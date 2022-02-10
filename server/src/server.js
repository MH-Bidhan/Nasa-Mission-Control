const http = require("http");

const { loadPlanetData } = require("./models/planets/planets.model");
const { loadLaunchData } = require("./models/launches/launches.models");
const { connectToDatabase } = require("./services/mongo.db");

const app = require("./app");

const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

async function startServer() {
  await connectToDatabase();
  await loadPlanetData();
  await loadLaunchData();

  server.listen(PORT, () =>
    console.log(`Listening for requests on ${PORT}...`)
  );
}

startServer();
