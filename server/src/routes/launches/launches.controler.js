const {
  getAllLaunches,
  addNewLaunches,
  existsLaunchWithFlightNumber,
  getLaunchesWithFlightNumber,
  abortLaunchByFlightNumber,
} = require("../../models/launches/launches.models");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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
    await addNewLaunches(launch);
    return res.status(201).json(launch);
  } catch (e) {
    return res.send(e.message);
  }
}

async function httpAbortLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);

  const existsLaunch = await existsLaunchWithFlightNumber(flightNumber);

  if (!existsLaunch) {
    res.status(400).json({
      message: "No Launch Found With The Given ID",
    });
  }

  try {
    const launchToAbort = await getLaunchesWithFlightNumber(flightNumber);
    abortLaunchByFlightNumber(flightNumber);
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
