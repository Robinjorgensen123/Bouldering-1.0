import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "../../components/Navbar/Navbar";

describe("Navbar Component", () => {
  it("should have functional links to all main pages", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", { name: /home/i });
    const mapLink = screen.getByRole("link", { name: /map/i });
    const addLink = screen.getByRole("link", { name: /add/i });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(mapLink).toHaveAttribute("href", "/map");
    expect(addLink).toHaveAttribute("href", "/add");
  });
});
