import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import AppErrorBoundary from "../AppErrorBoundary";

const ThrowingComponent = () => {
  throw new Error("Render failed");
};

describe("AppErrorBoundary", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => undefined);

  beforeEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it("should render fallback UI when a child throws", () => {
    render(
      <AppErrorBoundary>
        <ThrowingComponent />
      </AppErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("The app ran into an unexpected UI error."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reload app/i }),
    ).toBeInTheDocument();
  });
});
