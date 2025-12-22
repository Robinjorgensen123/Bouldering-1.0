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
});
