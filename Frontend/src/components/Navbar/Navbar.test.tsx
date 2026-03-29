import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "../../components/Navbar/Navbar";
import { AuthProvider } from "../../features/auth/context/AuthContext";
import * as apiModule from "../../services/api";

vi.mock("../../services/api", () => ({
  ...vi.importActual("../../services/api"),
  setAuthToken: vi.fn(),
}));

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "mock-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ _id: "1", email: "test@test.com", gradingSystem: "font" }),
    );
    vi.clearAllMocks();
  });

  it("should have functional links to all main pages", () => {
    const { container } = render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>,
    );

    const homeLink = container.querySelector('a[href="/"]');
    const mapLink = container.querySelector('a[href="/map"]');
    const historyLink = container.querySelector('a[href="/history"]');
    const addLink = container.querySelector('a[href="/add"]');

    expect(homeLink).not.toBeNull();
    expect(mapLink).not.toBeNull();
    expect(historyLink).not.toBeNull();
    expect(addLink).not.toBeNull();
  }, 10000);

  it("should clear auth data when log out is clicked", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /log out/i }));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(vi.mocked(apiModule.setAuthToken)).toHaveBeenCalledWith(null);
  });
});
