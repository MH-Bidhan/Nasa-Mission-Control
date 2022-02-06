const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  MONGO_KEY: process.env.MONGO_KEY,
};
