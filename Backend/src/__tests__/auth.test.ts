import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../server.js";
import { User } from "../models/User.js";

describe("Auth API Test", () => {
  it("should register a new user and return 201", async () => {
    const newUser = {
      email: "newuser@test.com",
      password: "securepassword",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully"
    );

    const userInDb = await User.findOne({ email: newUser.email });
    expect(userInDb).not.toBeNull();
  });

  it("should return 400 if registration fails (e.g., missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({ email: "incomplete@test.com" }); // Missing password

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Error registering user");
  });

  it("should return 200 for health check", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });
});
