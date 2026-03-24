import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import React from "react";

const Consumer = () => {
  const { token, user } = useAuth();
  return (
    <div>
      <span data-testid="token">{token}</span>
      <span data-testid="email">{user?.email}</span>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize token + user from localStorage", async () => {
    localStorage.setItem("token", "saved-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: "1",
        email: "test@dot.com",
        gradingSystem: "font",
      }),
    );

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("saved-token");
      expect(screen.getByTestId("email")).toHaveTextContent("test@dot.com");
    });
  });

  it("should update token + user in state after calling login", async () => {
    const LoginConsumer = () => {
      const { token, user, login } = useAuth();
      return (
        <div>
          <span data-testid="token">{token}</span>
          <span data-testid="email">{user?.email}</span>
          <button
            type="button"
            onClick={() =>
              login("new-token", {
                _id: "2",
                email: "new@dot.com",
                gradingSystem: "v-scale",
              })
            }
          >
            Login
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <LoginConsumer />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("new-token");
      expect(screen.getByTestId("email")).toHaveTextContent("new@dot.com");
    });
  });

  it("should not re-read localStorage on rerender (state stays available)", async () => {
    localStorage.setItem("token", "saved-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: "1",
        email: "test@dot.com",
        gradingSystem: "font",
      }),
    );

    const getItemSpy = vi.spyOn(Storage.prototype, "getItem");

    const RerenderConsumer = () => {
      const { token, user } = useAuth();
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <span data-testid="token">{token}</span>
          <span data-testid="email">{user?.email}</span>
          <span data-testid="count">{count}</span>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Inc
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <RerenderConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("saved-token");
      expect(screen.getByTestId("email")).toHaveTextContent("test@dot.com");
    });

    const initialCallCount = getItemSpy.mock.calls.length;

    fireEvent.click(screen.getByRole("button", { name: /inc/i }));

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    expect(getItemSpy.mock.calls.length).toBe(initialCallCount);

    getItemSpy.mockRestore();
  });

  it("should clear token + user from state and localStorage on logout", async () => {
    localStorage.setItem("token", "saved-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        _id: "1",
        email: "test@dot.com",
        gradingSystem: "font",
      }),
    );

    const LogoutConsumer = () => {
      const { token, user, logout } = useAuth();
      return (
        <div>
          <span data-testid="token">{token}</span>
          <span data-testid="email">{user?.email}</span>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <LogoutConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("saved-token");
      expect(screen.getByTestId("email")).toHaveTextContent("test@dot.com");
    });

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByTestId("token")).toHaveTextContent("");
      expect(screen.getByTestId("email")).toHaveTextContent("");
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});