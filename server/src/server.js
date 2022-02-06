const http = require("http");

const mongoose = require("mongoose");

const { loadPlanetData } = require("./models/planets.model");
const { MONGO_KEY } = require("../config");

const app = require("./app");

const PORT = process.env.PORT || 9000;

const server = http.createServer(app);

mongoose.connection
  .on("open", () => {
    console.log("Conneted TO The Database...");
  })
  .on("error", (e) => console.error(e));

async function startServer() {
  await mongoose.connect(MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanetData();
  server.listen(PORT, () =>
    console.log(`Listening for requests on ${PORT}...`)
  );
}

startServer();
