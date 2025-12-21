import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../server.js";
import { User } from "../models/User.js";
import { response } from "express";

describe("Auth API Register", () => {
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
describe("Auth API login", () => {
  it("should login successfully and return a token", async () => {
    const user = {
      email: "login-successfully@test.com",
      password: "validpassword",
    };

    await request(app).post("/api/auth/register").send(user);

    const response = await request(app).post("/api/auth/login").send(user);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("token");
    expect(response.body.message).toBe("Login successful");
  });

  it("should fail login with wrong password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "try@test.com",
      password: "password123",
    });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should fail login if user does not exist", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "ghost@test.com",
      password: "nooneknows",
    });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should return an error if user tries to Login with the wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      email: "loginAttempt@test.com",
      password: "correctPassword",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "loginAttempt@test.com",
      password: "incorrectPassword",
    });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid email or password");
  });
});

describe("User Settings", () => {
  it("should update user grading system preference", async () => {
    const settingsUser = {
      email: "settings-test@test.com",
      password: "validpassword",
    };
    await request(app).post("/api/auth/register").send(settingsUser);
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "settings-test@test.com",
      password: "validpassword",
    });
    const token = loginResponse.body.token;

    const response = await request(app)
      .put("/api/auth/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({ gradingSystem: "v-scale" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.gradingSystem).toBe("v-scale");

    const user = await User.findOne({ email: "settings-test@test.com" });
    expect(user?.gradingSystem).toBe("v-scale");
  });
  it("should fail to update settings without a token", async () => {
    const response = await request(app)
      .put("/api/auth/settings")
      .send({ gradingSystem: "v-scale" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
