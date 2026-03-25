import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import UserSettings from "../UserSettings/UserSettings";
import { AuthProvider } from "../../features/auth/context/AuthContext";
import api from "../../services/api";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

vi.mock("../../services/api", () => ({
  default: {
    put: vi.fn(),
  },
  setAuthToken: vi.fn(),
}));

describe("UserSettings Page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(localStorage, "setItem");
    const mockUser = {
      _id: "1",
      email: "test@test.com",
      gradingSystem: "font",
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "mock-token");
    vi.clearAllMocks();
    vi.mocked(api.put).mockImplementation(async (_url, data) => {
      const body = (data as { gradingSystem?: string } | undefined) ?? {};

      return {
        data: {
          success: true,
          data: {
            _id: "1",
            email: "test@test.com",
            gradingSystem: body.gradingSystem || "font",
          },
        },
      };
    });
  });

  it("should render the grading system options", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserSettings />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Grading System/i)).toBeInTheDocument();
    expect(screen.getByText(/Fontainebleau/i)).toBeInTheDocument();
    expect(screen.getByText(/V-Scale/i)).toBeInTheDocument();
  });

  it("should update localstorage when a scale is selected", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserSettings />
        </AuthProvider>
      </MemoryRouter>,
    );

    const vScaleButton = screen.getByLabelText(/V-Scale/i);
    fireEvent.click(vScaleButton);

    await waitFor(
      () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}") as {
          gradingSystem?: string;
        };
        expect(storedUser.gradingSystem).toBe("v-scale");
      },
      { timeout: 2000 },
    );
  });

  it("shold show the active class on the selected scale", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserSettings />
        </AuthProvider>
      </MemoryRouter>,
    );

    const fontButton = screen.getByText(/Fontainebleau/i);
    const vButton = screen.getByText(/V-Scale/i);

    expect(fontButton).toHaveClass("active");
    expect(vButton).not.toHaveClass("active");

    fireEvent.click(vButton);

    await waitFor(() => {
      expect(vButton).toHaveClass("active");
      expect(fontButton).not.toHaveClass("active");
    });
  });

  it("should clear auth data when logout is clicked", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserSettings />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /log out/i }));

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
