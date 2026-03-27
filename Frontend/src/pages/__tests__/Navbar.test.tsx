import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "../../components/Navbar/Navbar";

describe("Navbar Component", () => {
  it("should have functional links to all main pages", () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    const homeLink = container.querySelector('a[href="/"]');
    const mapLink = container.querySelector('a[href="/map"]');
    const historyLink = container.querySelector('a[href="/history"]');
    const addLink = container.querySelector('a[href="/add"]');

    expect(homeLink).not.toBeNull();
    expect(mapLink).not.toBeNull();
    expect(historyLink).not.toBeNull();
    expect(addLink).not.toBeNull();
  }, 10000);
});
