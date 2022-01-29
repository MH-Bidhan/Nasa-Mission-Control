const http = require("http");
const { loadPlanetData } = require("./models/planets.model");

const app = require("./app");

const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetData();
  server.listen(PORT, () =>
    console.log(`Listening for requests on ${PORT}...`)
  );
}

startServer();
