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

  it("should not re-hash password if it is not modified", async () => {
    const user = new User({
      email: "updateUser@test.com",
      password: "test1234",
    });
    await user.save();
    const originalHashedPassword = user.password;

    user.email = "newemail@test.com";
    await user.save();
    expect(user.password).toBe(originalHashedPassword);
  });

  it("should return 200 for health check", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });

  it("should return true for correct password and false for incorrect", async () => {
    const password = "mypassword";
    const user = new User({ email: "compare@test.com", password: password });
    await user.save();

    const isMatch = await user.comparePassword(password);

    const isNotMatch = await user.comparePassword("wrongpassword");
    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it("should coverage line 22 by modifying email but not password", async () => {
    const user = new User({
      email: "line22@test.com",
      password: "password123",
    });
    await user.save();
    const initialHash = user.password;

    // Ändra något ANNAT än lösenordet
    user.email = "new-line22@test.com";
    await user.save(); // Nu triggas pre-save, och isModified("password") blir false

    expect(user.password).toBe(initialHash);
  });
});
