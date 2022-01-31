const launches = new Map();

let latestFlightNumber = 1;

const launch = {
  flightNumber: 1,
  mission: "kepler Expolrant",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2020"),
  target: "keplar-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: false,
  success: true,
};

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launch) {
  return launches.has(launch);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function getLaunchesWithId(id) {
  return launches.get(id);
}

function addNewLaunches(launch) {
  const launchDate = (launch.launchDate = new Date(launch.launchDate));

  try {
    latestFlightNumber++;

    const newLaunch = Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
      launchDate,
    });

    launches.set(latestFlightNumber, newLaunch);
  } catch (e) {
    console.log(e.message);
  }
}

function abortLaunch(flightNumber) {
  launches.delete(flightNumber);
}

module.exports = {
  getAllLaunches,
  addNewLaunches,
  abortLaunch,
  existsLaunchWithId,
  getLaunchesWithId,
};
