import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../Home/Home";
import api from "../../services/api";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

vi.mock("../../components/BoulderMap/BoulderMap", () => ({
  default: () => <div data-testid="mock-map">Map View Active</div>,
}));

vi.mock("../../services/api", () => ({
  default: { get: vi.fn() },
  setAuthToken: vi.fn(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "mocked_token");
  });

  const mockData = {
    success: true,
    data: [
      {
        _id: "1",
        name: "Boulder A",
        grade: "6A",
        location: "Sektor A",
        coordinates: { lat: 59.3, lng: 18.0 },
      },
      {
        _id: "2",
        name: "Boulder B",
        grade: "7B",
        location: "Sektor A",
        coordinates: { lat: 59.3, lng: 18.0 },
      },
    ],
  };

  it("should group boulders with same coordinates", async () => {
    (api.get as any).mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            _id: "1",
            name: "Boulder A",
            grade: "6A",
            imagesUrl: "/img1.jpg",
            location: "Sektor A",
            coordinates: { lat: 59.3, lng: 18.0 },
          },
          {
            _id: "2",
            name: "Boulder B",
            grade: "7A",
            imagesUrl: "/img2.jpg",
            location: "Sektor A",
            coordinates: { lat: 59.3, lng: 18.0 },
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/2 boulders at this location/i),
      ).toBeInTheDocument();
    });
  });
  it("should toggle between grid and map view when buttons are clicked", async () => {
    (api.get as any).mockResolvedValue({
      data: { success: true, data: [] },
    });
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>,
    );

    const mapBtn = screen.getByRole("button", { name: /map/i });
    fireEvent.click(mapBtn);

    expect(screen.getByTestId("mock-map")).toBeInTheDocument();

    const areasBtn = screen.getByRole("button", { name: /areas/i });
    fireEvent.click(areasBtn);
    expect(screen.queryByTestId("mock-map")).not.toBeInTheDocument();
  });
});
