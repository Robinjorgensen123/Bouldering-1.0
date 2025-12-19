import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("Auth API", () => {
  it("Should have a health check route", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });
});
