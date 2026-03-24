import { describe, it, expect, beforeEach } from "vitest";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../server.js";
import { History } from "../models/History.js";
import { User } from "../models/User.js";

describe("History Model", () => {
  it("should fail validation if ascentType is missing", async () => {
    const history = new History({
      user: new mongoose.Types.ObjectId(),
      boulder: new mongoose.Types.ObjectId(),
      attempts: 1,
    });

    let err;

    try {
      await history.validate();
    } catch (error: any) {
      err = error;
    }

    expect(err.errors.ascentType).toBeDefined();
  });

  it("should fail if ascentType is not one of the allowed values", async () => {
    const history = new History({
      user: new mongoose.Types.ObjectId(),
      boulder: new mongoose.Types.ObjectId(),
      ascentType: "climbed-it",
    });

    let err: any;
    try {
      await history.validate();
    } catch (error: any) {
      err = error;
    }
    expect(err.errors.ascentType).toBeDefined();
    expect(err.errors.ascentType.kind).toBe("enum");
  });

  it("should fail if user or boulder is missing", async () => {
    const history = new History({
      ascentType: "flash",
    });

    let err: any;
    try {
      await history.validate();
    } catch (error: any) {
      err = error;
    }
    expect(err.errors.user).toBeDefined();
    expect(err.errors.boulder).toBeDefined();
  });

  it("should pass validation with all required fields", async () => {
    const history = new History({
      user: new mongoose.Types.ObjectId(),
      boulder: new mongoose.Types.ObjectId(),
      ascentType: "redpoint",
      attempts: 3,
    });

    const err = await history.validate();
    expect(err).toBeUndefined();
  });
});

describe("History API", () => {
  let token: string;
  let boulderId: string;

  beforeEach(async () => {
    const user = { email: "history-api@test.com", password: "password123" };
    await request(app).post("/api/auth/register").send(user);
    const login = await request(app).post("/api/auth/login").send(user);
    token = login.body.token;

    const boulderResp = await request(app)
      .post("/api/boulders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "History Test Boulder",
        grade: "6A",
        location: "Test",
        coordinates: { lat: 57.0, lng: 12.0 },
      });

    boulderId = boulderResp.body.data._id;
  });

  it("should return 400 for invalid boulder id", async () => {
    const res = await request(app)
      .get("/api/history/boulder/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it("should return history records for a valid boulder id", async () => {
    await request(app)
      .post("/api/history")
      .set("Authorization", `Bearer ${token}`)
      .send({ boulder: boulderId, ascentType: "onsight", attempts: 1 });

    const res = await request(app)
      .get(`/api/history/boulder/${boulderId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].boulder).toBe(boulderId);
  });

  it("should convert history boulder grades to V-scale for users with that preference", async () => {
    await User.findOneAndUpdate(
      { email: "history-api@test.com" },
      { gradingSystem: "v-scale" },
    );

    await request(app)
      .post("/api/history")
      .set("Authorization", `Bearer ${token}`)
      .send({ boulder: boulderId, ascentType: "onsight", attempts: 1 });

    const res = await request(app)
      .get("/api/history")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].boulder.grade).toBe("V3");
  });
});
