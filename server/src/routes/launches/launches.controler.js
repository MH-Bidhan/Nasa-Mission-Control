const {
  getAllLaunches,
  addNewLaunches,
  abortLaunch,
  existsLaunchWithId,
  getLaunchesWithId,
} = require("../../models/launches.models");
const launchesRouter = require("./launches.router");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  const { mission, target, launchDate, rocket } = launch;

  if (!mission || !target || !rocket || !launchDate) {
    return res.status(400).json({
      error: {
        message: "Missing Required Launch Properties",
      },
    });
  }

  if (isNaN(new Date(launchDate))) {
    return res.status(400).json({
      error: {
        message: "Invalid Date",
      },
    });
  }

  try {
    addNewLaunches(launch);
    return res.status(201).json(launch);
  } catch (e) {
    return res.send(e.message);
  }
}

function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);

  if (!existsLaunchWithId(flightNumber)) {
    res.status(400).json({
      message: "No Launch Found With The Given ID",
    });
  }

  try {
    const launchToAbort = getLaunchesWithId(flightNumber);
    abortLaunch(flightNumber);
    res.status(200).json({
      message: "Mission Aborted",
      mission: launchToAbort,
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
