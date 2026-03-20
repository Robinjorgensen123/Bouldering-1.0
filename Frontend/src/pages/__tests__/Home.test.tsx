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
      expect(screen.getByText(/2 boulders at this location/i)).toBeTruthy();
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

    expect(screen.getByTestId("mock-map")).toBeTruthy();

    const areasBtn = screen.getByRole("button", { name: /areas/i });
    fireEvent.click(areasBtn);
    expect(screen.queryByTestId("mock-map")).toBeNull();
  });

  it("should open boulder details when clicking a boulder in the spot panel", async () => {
    (api.get as any)
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            {
              _id: "1",
              name: "robin",
              grade: "9B",
              description: "Powerful moves on sharp holds.",
              imagesUrl: "/robin.jpg",
              location: "GothenBurg",
              coordinates: { lat: 57.7, lng: 11.97 },
              topoData: {
                linePoints: [
                  { x: 100, y: 200 },
                  { x: 220, y: 160 },
                ],
                holds: [{ type: "start", position: { x: 100, y: 200 } }],
              },
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [
            {
              _id: "h1",
              ascentType: "redpoint",
              attempts: 2,
              comment: "Solid",
              completedAt: new Date().toISOString(),
              user: { email: "climber@example.com" },
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

    const groupCard = await screen.findByText(/spot: gothenburg/i);
    fireEvent.click(groupCard);

    const boulderInList = await screen.findByText(/robin \(9b\)/i);
    fireEvent.click(boulderInList);

    await waitFor(() => {
      expect(screen.getByText(/boulder details/i)).toBeTruthy();
      expect(screen.getByText(/powerful moves on sharp holds./i)).toBeTruthy();
      expect(screen.getByText(/solid/i)).toBeTruthy();
    });
  });
});
