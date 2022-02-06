const launches = require("./launches.mongo");

async function getNewFlightNumber() {
  const launchesArray = await launches.find();

  let newFlightNumber = 0;

  for (let item of launchesArray) {
    if (item.flightNumber > newFlightNumber) {
      newFlightNumber = item.flightNumber;
    }
  }

  return Number(newFlightNumber) + 1;
}

async function existsLaunchWithFlightNumber(flightNumber) {
  return await launches.findOne({ flightNumber }, { _id: 0, __v: 0 });
}

async function getAllLaunches() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

function getLaunchesWithFlightNumber(flightNumber) {
  return launches.findOne({ flightNumber: flightNumber });
}

async function addNewLaunches(launch) {
  const launchDate = (launch.launchDate = new Date(launch.launchDate));
  const flightNumber = await getNewFlightNumber();

  try {
    const newLaunch = Object.assign(launch, {
      flightNumber,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
      launchDate,
    });

    const completeLaunch = await launches.updateOne(
      { flightNumber },
      newLaunch,
      { upsert: true }
    );

    return completeLaunch;
  } catch (e) {
    console.log(e.message);
  }
}

async function abortLaunchByFlightNumber(flightNumber) {
  const aborted = await launches.findOneAndUpdate(
    { flightNumber },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.ok;
}

module.exports = {
  getAllLaunches,
  addNewLaunches,
  abortLaunchByFlightNumber,
  existsLaunchWithFlightNumber,
  getLaunchesWithFlightNumber,
};
