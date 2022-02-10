const request = require("supertest");
const app = require("../../app");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../../services/mongo.db");

describe("Launches API", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });

  describe("Test POST /launches", () => {
    const missionData = {
      mission: "ZTM155",
      rocket: "ZTM Experimental IS1",
      target: "keplar-186 f",
      launchDate: "January 31,2022",
    };

    const missionDataWithInvalidDate = {
      mission: "ZTM155",
      rocket: "ZTM Experimental IS1",
      target: "keplar-186 f",
      launchDate: "January",
    };

    const missionDataWithoutDate = {
      mission: "ZTM155",
      rocket: "ZTM Experimental IS1",
      target: "keplar-186 f",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(missionData)
        .expect(201)
        .expect("Content-Type", /json/);

      const reqDate = new Date(missionData.launchDate).valueOf();
      const resDate = new Date(response.body.launchDate).valueOf();

      expect(resDate).toBe(reqDate);

      expect(response.body).toMatchObject(missionDataWithoutDate);
    });

    test("It should catch missing required properties ", async () => {
      const response = await request(app)
        .post("/launches")
        .send(missionDataWithoutDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: {
          message: "Missing Required Launch Properties",
        },
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send(missionDataWithInvalidDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: {
          message: "Invalid Date",
        },
      });
    });
  });
});
