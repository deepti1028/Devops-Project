import request from "supertest";
import { app } from "../src/app.js";
import axios from "axios";

describe("Healthcheck API", () => {
  it("should return a 200 status and 'Server is running' message", async () => {
    const response = await request(app).get("/api/healthcheck");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Server is running");
  });

  it("should return correct response when calling via axios", async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/healthcheck");
      expect(response.status).toBe(200);
      expect(response.data).toBe("Server is running");
    } catch (error) {
      throw new Error(`API call failed: ${error.message}`);
    }
  });
});
