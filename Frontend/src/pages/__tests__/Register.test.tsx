import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
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
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "User already exists" } },
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  }, 20000);

  it("should navigate to login on successful registration", async () => {
    (api.post as any).mockResolvedValueOnce({ data: { success: true } });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "climber@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "securepassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 4000 },
    );
  }, 20000);
});
