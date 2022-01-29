const express = require("express");
const { getAllPlanets } = require("./planets.controler");

const planetRouter = express.Router();

planetRouter.get("/planets", getAllPlanets);

module.exports = planetRouter;
