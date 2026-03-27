import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import ProtectedRoute from "../ProtectedRoute";
import { AuthProvider } from "../../features/auth/context/AuthContext";
import "@testing-library/jest-dom";

const MockAddBoulder = () => <div>Add Boulder Page</div>;
const MockLogin = () => <div>Please Login First</div>;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("it should redirect to login if no token is present", () => {
    render(
      <MemoryRouter initialEntries={["/add"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <MockAddBoulder />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<MockLogin />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Add Boulder Page/)).not.toBeInTheDocument();
    expect(screen.getByText(/Please Login First/)).toBeInTheDocument();
  });

  it("should render the child component if token is in localStorage", () => {
    localStorage.setItem("token", "mocked_token");

    render(
      <MemoryRouter initialEntries={["/add"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <MockAddBoulder />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<MockLogin />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Add Boulder Page/)).toBeInTheDocument();
    expect(screen.queryByText(/Please Login First/)).not.toBeInTheDocument();
  });
});
