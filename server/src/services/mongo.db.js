const mongoose = require("mongoose");

const { MONGO_KEY } = require("../../config");

mongoose.connection
  .on("open", () => {
    console.log("Conneted TO The Database...");
  })
  .on("error", (e) => console.error(e));

async function connectToDatabase() {
  await mongoose.connect(MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function disconnectFromDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
};
