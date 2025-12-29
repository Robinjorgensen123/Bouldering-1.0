import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, data, useNavigate } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import api from "../../services/api";
import Register from "../Register/Register";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../services/api", () => ({
  default: { post: vi.fn() },
}));

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show error if registration fails", async () => {
    const user = userEvent.setup();
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "User already exists" } },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/username/i), "newuser");
    await user.type(screen.getByLabelText(/email/i), "test@test.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });

  it("should navigate to login on successful registration", async () => {
    const user = userEvent.setup();
    (api.post as any).mockResolvedValueOnce({ data: { success: true } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/username/i), "climber");
    await user.type(screen.getByLabelText(/email/i), "climber@test.com");
    await user.type(screen.getByLabelText(/password/i), "securepassword");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
