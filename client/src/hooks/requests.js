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
    const response = await fetch(`${apiEndpoint}/launches`);
    const fetchedLaunches = await response.json();
    return fetchedLaunches.sort((a, b) => {
      return b.flightNumber - a.flightNumber;
    });
  } catch (e) {
    console.log(e.message);
  }
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${apiEndpoint}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (e) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${apiEndpoint}/launches/${id}`, {
      method: "delete",
    });
  } catch (e) {
    return {
      ok: false,
    };
  }

  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
