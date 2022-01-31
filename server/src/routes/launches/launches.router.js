const express = require("express");

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controler");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpAddNewLaunch);
launchesRouter.delete("/:flightNumber", httpAbortLaunch);

module.exports = launchesRouter;
