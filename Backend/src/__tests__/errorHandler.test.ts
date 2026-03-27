import { describe, expect, it, vi } from "vitest";
import {
  globalErrorHandler,
  notFoundHandler,
} from "../middleware/errorHandler.js";

describe("errorHandler middleware", () => {
  it("should forward a 404 error for unknown routes", () => {
    const next = vi.fn();
    const req = { originalUrl: "/missing-route" } as any;

    notFoundHandler(req, {} as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    const firstCall = next.mock.calls[0];
    if (!firstCall) {
      throw new Error("Expected next to be called with an error");
    }
    const error = firstCall[0] as Error & { statusCode?: number };
    expect(error.message).toBe("Route not found: /missing-route");
    expect(error.statusCode).toBe(404);
  });

  it("should return a consistent 500 response for unexpected errors", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    globalErrorHandler(new Error("Boom"), {} as any, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Boom",
    });
  });
});
