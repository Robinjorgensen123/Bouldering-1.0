import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../Home/Home";

(globalThis.fetch as any) = vi.fn();

describe("Home Page Grouping Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(/2 boulders at this location/i)
      ).toBeInTheDocument();
    });
  });
});
