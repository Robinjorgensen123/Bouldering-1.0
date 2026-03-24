import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import App from "../../App";
import { AuthProvider } from "../../features/auth/context/AuthContext";

vi.mock("../../features/boulders/services/boulderApi", () => ({
  fetchBoulders: vi.fn().mockResolvedValue({
    success: true,
    data: [],
  }),
}));

it("should navigate to the full map page via URL", async () => {
  render(
    <MemoryRouter initialEntries={["/map"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
  const map = await screen.findByTestId("map-wrapper");
  expect(map).toBeInTheDocument();
});
