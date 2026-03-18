import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import api from "../../services/api";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Login from "../Login/Login";
import { AuthProvider } from "../../context/AuthContext";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../../services/api", () => ({
  default: {
    post: vi.fn(),
  },
  setAuthToken: vi.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should render all input fields and login button", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should show error message when login fails", async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(
      () => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  }, 20000);

  it("should store token and navigate to home on success", async () => {
    const fakeToken = "valid-jwt-token";
    (api.post as any).mockResolvedValueOnce({
      data: {
        success: true,
        token: fakeToken,
        user: { _id: "123", email: "user@test.com", gradingSystem: "font" },
        message: "Login successful",
      },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "correctpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(
      () => {
        expect(localStorage.getItem("token")).toBe(fakeToken);
        expect(mockNavigate).toHaveBeenCalledWith("/");
      },
      { timeout: 4000 },
    );
  }, 20000);
});
