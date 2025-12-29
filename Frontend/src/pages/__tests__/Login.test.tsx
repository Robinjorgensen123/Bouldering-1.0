import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import api from "../../services/api";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Login from "../Login/Login";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render all input fields and login button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should show error message when login fails", async () => {
    const user = userEvent.setup();
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "wrong@test.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("should store token and navigate to home on success", async () => {
    const user = userEvent.setup();
    const fakeToken = "valid-jwt-token";
    (api.post as any).mockResolvedValueOnce({ data: { token: fakeToken } });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "user@test.com");
    await user.type(screen.getByLabelText(/password/i), "correctpassword");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(fakeToken);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
