import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BoulderMap from "../../features/map/components/BoulderMap";
import type { IBoulder } from "../../features/boulders/types/boulder.types";
import { BrowserRouter } from "react-router-dom";

const mockBoulders: IBoulder[] = [
  {
    _id: "1",
    name: "Test Boulder",
    grade: "6A",
    location: "Sektor A",
    coordinates: { lat: 57.7, lng: 11.9 },
    imagesUrl: "",
    author: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "High Boulder",
    grade: "7A",
    location: "Sektor B",
    coordinates: { lat: 56.1234, lng: 14.5678 },
    imagesUrl: "test2.jpg",
    author: "user2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

describe("BoulderMap Component", () => {
  it("should render the map container with leaflet classes", () => {
    render(
      <BrowserRouter>
        <BoulderMap boulders={mockBoulders} />
      </BrowserRouter>,
    );

    const mapElement = document.querySelector(".leaflet-container");
    expect(mapElement).toBeTruthy();
  });

  it("should render the correct number of markers", () => {
    const { container } = render(
      <BrowserRouter>
        <BoulderMap boulders={mockBoulders} />
      </BrowserRouter>,
    );

    const markers = container.querySelectorAll(".leaflet-marker-icon");
    expect(markers.length).toBe(mockBoulders.length);
  });

  it("should group boulders with nearby coordinates into one marker", () => {
    const groupedBoulders: IBoulder[] = [
      ...mockBoulders,
      {
        _id: "3",
        name: "Twin Boulder",
        grade: "7C",
        location: "Sektor A",
        coordinates: { lat: 57.70008, lng: 11.90006 },
        imagesUrl: "",
        author: "user3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const { container } = render(
      <BrowserRouter>
        <BoulderMap boulders={groupedBoulders} />
      </BrowserRouter>,
    );

    const markers = container.querySelectorAll(".leaflet-marker-icon");
    expect(markers.length).toBe(2);
  });

  it("should have the correct wrapper class for styling", () => {
    render(
      <BrowserRouter>
        <BoulderMap boulders={mockBoulders} />
      </BrowserRouter>,
    );

    const wrapper = screen.getByTestId("map-wrapper");
    expect(wrapper.classList.contains("boulder-map-wrapper")).toBe(true);
  });
});
