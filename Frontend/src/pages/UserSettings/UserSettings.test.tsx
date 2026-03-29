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
    vi.mocked(api.put).mockImplementation(async (url, data) => {
      if (url === "/user/change-password") {
        return {
          data: {
            success: true,
            message: "Password updated successfully",
          },
        };
      }

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

  it("should not render a logout button in settings", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserSettings />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button", { name: /log out/i })).toBeNull();
  });

  it("should change password from settings", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserSettings />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: "oldpassword" },
    });
    fireEvent.change(screen.getByLabelText(/^new password$/i), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/user/change-password", {
        currentPassword: "oldpassword",
        newPassword: "newpassword123",
      });
      expect(
        screen.getByText(/password changed successfully/i),
      ).toBeInTheDocument();
    });
  });
});
