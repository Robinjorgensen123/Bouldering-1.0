import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../utils/mailer.js", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

import { app } from "../server.js";
import { User } from "../models/User.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";

beforeEach(() => {
  vi.clearAllMocks();
});

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
      "User registered successfully",
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
    expect(response.body).toHaveProperty("message", '"password" is required');
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

    user.email = "new-line22@test.com";
    await user.save();
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

describe("Auth API password reset", () => {
  it("should generate a password reset link for existing user", async () => {
    const user = {
      email: "reset-link@test.com",
      password: "originalPassword123",
    };

    await request(app).post("/api/auth/register").send(user);

    const response = await request(app).post("/api/auth/forgot-password").send({
      email: user.email,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "If an account exists for this email, a reset link has been generated.",
    );
    expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      user.email,
      expect.stringContaining("/reset-password/"),
    );

    const userInDb = await User.findOne({ email: user.email });
    expect(userInDb?.passwordResetToken).toBeTruthy();
    expect(userInDb?.passwordResetExpires).toBeTruthy();
  });

  it("should reset password with valid token", async () => {
    const user = {
      email: "reset-success@test.com",
      password: "oldPassword123",
    };

    await request(app).post("/api/auth/register").send(user);

    const forgotResponse = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: user.email });

    expect(forgotResponse.status).toBe(200);

    const resetUrl = vi.mocked(sendPasswordResetEmail).mock.calls[0]?.[1];
    if (!resetUrl) {
      throw new Error("Expected password reset email to include a reset URL");
    }
    const resetToken = resetUrl.split("/").pop();
    expect(resetToken).toBeTruthy();

    const resetResponse = await request(app)
      .post(`/api/auth/reset-password/${resetToken}`)
      .send({ password: "newPassword123" });

    expect(resetResponse.status).toBe(200);
    expect(resetResponse.body.success).toBe(true);

    const oldLoginResponse = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "oldPassword123",
    });
    expect(oldLoginResponse.status).toBe(400);

    const newLoginResponse = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "newPassword123",
    });
    expect(newLoginResponse.status).toBe(200);
  });

  it("should return 400 for invalid reset token", async () => {
    const response = await request(app)
      .post("/api/auth/reset-password/invalid-token")
      .send({ password: "newPassword123" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid or expired reset token");
  });

  it("should find the user even if forgot-password email casing differs", async () => {
    await request(app).post("/api/auth/register").send({
      email: "CaseUser@Test.com",
      password: "Password123",
    });

    const response = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "caseuser@test.com" });

    expect(response.status).toBe(200);
    expect(sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      "caseuser@test.com",
      expect.stringContaining("/reset-password/"),
    );
  });
});
