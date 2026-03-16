import { describe, it, expect, beforeEach } from "vitest";
import mongoose from "mongoose";
import { History } from "../models/History.js";

describe("History Model", () => {
  it("should fail validation if style is missing", async () => {
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

    expect(err.errors.style).toBeDefined();
  });

  it("should fail if style is not one of the allowed values", async () => {
    const history = new History({
      user: new mongoose.Types.ObjectId(),
      boulder: new mongoose.Types.ObjectId(),
      style: "climbed-it",
    });

    let err: any;
    try {
      await history.validate();
    } catch (error: any) {
      err = error;
    }
    expect(err.errors.style).toBeDefined();
    expect(err.errors.style.kind).toBe("enum");
  });

  it("should fail if user or boulder is missing", async () => {
    const history = new History({
      style: "flash",
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
      style: "redpoint",
      attempts: 3,
    });

    const err = await history.validate();
    expect(err).toBeUndefined();
  });
});
