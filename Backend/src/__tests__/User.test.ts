import { it, expect, describe } from "vitest";
import { User } from "../models/User.js";

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
