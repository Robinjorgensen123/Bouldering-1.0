import { it, expect, describe } from "vitest";
import { User } from "../models/User.js";

describe("User Model Test", () => {
  it("should create a user with an email, and a password", async () => {
    const user = new User({ email: "test@test.com", password: "password123" });

    expect(user.email).toBe("test@test.com");
    expect(user.password).toBe("password123");
  });
});
