import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../Home/Home";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../components/BoulderMap/BoulderMap", () => ({
  default: () => <div data-testid="mock-map">Map View Active</div>,
}));

(globalThis.fetch as any) = vi.fn();

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
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
      }),
    });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/2 boulders at this location/i)
      ).toBeInTheDocument();
    });
  });
  it("should toggle between grid and map view when buttons are clicked", async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    });
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const mapBtn = screen.getByRole("button", { name: /map/i });
    fireEvent.click(mapBtn);

    expect(screen.getByTestId("mock-map")).toBeInTheDocument();

    const listBtn = screen.getByRole("button", { name: /list/i });
    fireEvent.click(listBtn);
    expect(screen.queryByTestId("mock-map")).not.toBeInTheDocument();
  });
});
