import { it, expect, describe, beforeEach } from "vitest";
import { User } from "../models/User.js";
import request from "supertest";
import { app } from "../server.js";

describe("User Model Test", () => {
  it("should save the correct email", async () => {
    const user = new User({ email: "test@test.com", password: "password123" });
    await user.save();
    expect(user.email).toBe("test@test.com");
  });

  it("should never store passwords in plain text", async () => {
    const password = "password123";
    const user = new User({ email: "secure@test.com", password: password });
    await user.save();

    expect(user.password).not.toBe(password);
    expect(user.password!.length).toBeGreaterThan(20);
  });
});

describe("User Settings API", () => {
  let token: string;

  beforeEach(async () => {
    const user = { email: "settings-test@test.com", password: "validpassword" };
    await request(app).post("/api/auth/register").send(user);
    const response = await request(app).post("/api/auth/login").send(user);
    token = response.body.token;
  });

  it("should update user grading system preference", async () => {
    const response = await request(app)
      .put("/api/user/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({ gradingSystem: "v-scale" });

    const userInDb = await User.findOne({ email: "settings-test@test.com" });
    expect(userInDb?.gradingSystem).toBe("v-scale");
  });

  it("should fail to update settings without a token", async () => {
    const response = await request(app)
      .put("/api/user/settings")
      .send({ gradingSystem: "v-scale" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  it("should return 400 for invalid grading system", async () => {
    const response = await request(app)
      .put("/api/user/settings")
      .set("Authorization", `Bearer ${token}`)
      .send({ gradingSystem: "invalid-system" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("should change password with correct current password", async () => {
    const response = await request(app)
      .put("/api/user/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "validpassword",
        newPassword: "newValidPassword123",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const loginWithOldPassword = await request(app)
      .post("/api/auth/login")
      .send({
        email: "settings-test@test.com",
        password: "validpassword",
      });
    expect(loginWithOldPassword.status).toBe(400);

    const loginWithNewPassword = await request(app)
      .post("/api/auth/login")
      .send({
        email: "settings-test@test.com",
        password: "newValidPassword123",
      });
    expect(loginWithNewPassword.status).toBe(200);
  });

  it("should fail password change when current password is wrong", async () => {
    const response = await request(app)
      .put("/api/user/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "wrongPassword",
        newPassword: "newValidPassword123",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Current password is incorrect");
  });
});
