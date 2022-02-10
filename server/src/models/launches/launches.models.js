const axios = require("axios");

const launches = require("./launches.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches";

async function loadLaunchData() {
  console.log("Downloading spaceX data ...");
  const response = await axios.get(SPACEX_API_URL);
  const lastLaunchData = await response.data[response.data.length - 1];

  const lastLaunch = await launches.findOne({
    flightNumber: lastLaunchData["flight_number"],
    mission: lastLaunchData["name"],
  });

  if (!lastLaunch) {
    await populateLaunchData();
    console.log(`Download complete`);
  } else {
    console.log(`Data already exists`);
  }
}

async function populateLaunchData() {
  const response = await axios.post(`${SPACEX_API_URL}/query`, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: "customers",
        },
      ],
    },
  });

  if (response.status !== 200) {
    throw new Error(`Download Incomplete`);
  }

  const launchDocs = response.data.docs;

  const launchesData = [];

  for (let launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      customers: customers,
      launchDate: launchDoc["date_local"],
      rocket: launchDoc["rocket"]["name"],
      target: "Not Sspecified",
      success: launchDoc["success"],
      upcoming: launchDoc["upcoming"],
    };

    launchesData.push(launch);

    try {
      for (let data of launchesData) {
        await launches.updateOne(
          data,
          {
            ...data,
          },
          {
            upsert: true,
          }
        );
        console.log(data.mission);
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}

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

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
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
  loadLaunchData,
  getAllLaunches,
  addNewLaunches,
  abortLaunchByFlightNumber,
  existsLaunchWithFlightNumber,
  getLaunchesWithFlightNumber,
};
