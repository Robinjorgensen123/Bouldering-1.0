import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MobileBottomNav from "../MobileNavBar/MobileBottomNav";

const renderWithRoute = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <MobileBottomNav />
              <div data-testid="current-path">{window.location.pathname}</div>
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
};

describe("MobileBottomNav", () => {
  it("should not render on hidden auth routes", () => {
    renderWithRoute("/login");

    expect(screen.queryByText("Map")).not.toBeInTheDocument();
    expect(screen.queryByText("History")).not.toBeInTheDocument();
    expect(screen.queryByText("Add New Boulder")).not.toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("should render all bottom navigation items on app routes", () => {
    renderWithRoute("/map");

    expect(screen.getByText("Map")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Add New Boulder")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("should navigate to the selected route when an item is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/map"]}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <MobileBottomNav />
                <Routes>
                  <Route path="/map" element={<div>Map page</div>} />
                  <Route path="/history" element={<div>History page</div>} />
                </Routes>
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Map page")).toBeInTheDocument();
    await user.click(screen.getByText("History"));
    expect(screen.getByText("History page")).toBeInTheDocument();
  });
});
