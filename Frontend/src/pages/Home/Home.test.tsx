import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../Home/Home";
import api from "../../services/api";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../features/auth/context/AuthContext";

vi.mock("../../features/map/components/BoulderMap", () => ({
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
            author: "user1",
          },
          {
            _id: "2",
            name: "Boulder B",
            grade: "7A",
            imagesUrl: "/img2.jpg",
            location: "Sektor A",
            coordinates: { lat: 59.3, lng: 18.0 },
            author: "user2",
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

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
    });

    const mapBtn = screen.getByTestId("map-btn");
    fireEvent.click(mapBtn);

    expect(screen.getByTestId("mock-map")).toBeTruthy();

    const areasBtn = screen.getByTestId("areas-btn");
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
              author: "user1",
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
      expect(screen.getByText(/^robin$/i)).toBeTruthy();
      expect(screen.getByText(/log climb/i)).toBeTruthy();
      expect(screen.getByText(/9b\s*-\s*gothenburg/i)).toBeTruthy();
      expect(screen.getByText(/solid/i)).toBeTruthy();
    });
  });
});
