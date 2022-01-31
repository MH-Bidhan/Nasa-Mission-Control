const launches = new Map();

const launch = {
  flightNumber: 1,
  mission: "kepler Expolrant",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2030"),
  target: "keplar-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

module.exports = {
  getAllLaunches,
};
