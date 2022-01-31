const express = require("express");

const { httpGetAllLaunches } = require("./launches.controler");

const launchesRouter = express.Router();

launchesRouter.get("/launches", httpGetAllLaunches);

module.exports = launchesRouter;
