import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import UserSettings from "../UserSettings/UserSettings";
import "@testing-library/jest-dom";
import { User } from "lucide-react";

describe("UserSettings Page", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, "setItem");
  });

  it("should render the grading system options", () => {
    render(<UserSettings />);

    expect(screen.getByText(/Grading System/i)).toBeInTheDocument();
    expect(screen.getByText(/Fontainbleau/i)).toBeInTheDocument();
    expect(screen.getByText(/V-Scale/i)).toBeInTheDocument();
  });

  it("should update localstorage when a scale is selected", () => {
    render(<UserSettings />);

    const vScaleButton = screen.getByLabelText(/V-Scale/i);

    fireEvent.click(vScaleButton);

    expect(localStorage.setItem).toHaveBeenCalledWith("gradeScale", "v-scale");
    expect(localStorage.getItem("gradeScale")).toBe("v-scale");
  });

  it("shold show the active class on the selected scale", () => {
    render(<UserSettings />);

    const fontButton = screen.getByText(/Fontainebleau/i);
    const vButton = screen.getByText(/V-Scale/i);

    expect(fontButton).toHaveClass("active");
    expect(vButton).not.toHaveClass("active");

    fireEvent.click(vButton);

    expect(vButton).toHaveClass("active");
    expect(fontButton).not.toHaveClass("active");
  });
});
