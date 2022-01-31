const express = require("express");
const { httpGetAllPlanets } = require("./planets.controler");

const planetRouter = express.Router();

planetRouter.get("/", httpGetAllPlanets);

module.exports = planetRouter;
