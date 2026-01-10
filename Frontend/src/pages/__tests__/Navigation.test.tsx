import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import App from "../../App";
import Map from "../Map/Map";

it("should navigate to the full map page via URL", async () => {
  render(
    <MemoryRouter initialEntries={["/map"]}>
      <App />
    </MemoryRouter>
  );
  const map = await screen.findByTestId("map-wrapper");
  expect(map).toBeInTheDocument();
});
