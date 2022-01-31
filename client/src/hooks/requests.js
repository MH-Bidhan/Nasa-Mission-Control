const apiEndpoint = "http://localhost:9000";

async function httpGetPlanets() {
  try {
    const response = await fetch(`${apiEndpoint}/planets`);
    return await response.json();
  } catch (e) {
    console.log(e.message);
  }
}

async function httpGetLaunches() {
  try {
    const response = await fetch(`${apiEndpoint}/planets`);
    console.log(response);
    const fetchedLaunches = await response.json();
    return fetchedLaunches.sort((a, b) => {
      return a.flightNumber - b.flightNumber;
    });
  } catch (e) {
    console.log(e.message);
  }
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
