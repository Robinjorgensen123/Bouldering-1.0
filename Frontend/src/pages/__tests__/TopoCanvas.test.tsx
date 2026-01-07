import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopoCanvas from "../AddBoulder/TopoCanvas";

describe("TopoCanvas Unit Test", () => {
  const mockOnSavedPoints = vi.fn();
  const dummySrc = "mock-url";

  it("should render the image and the canvas with correct aria-label", () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />
    );

    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText("topo-canvas")).toBeInTheDocument();
  });

  it("should start with no points and no reset button", () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />
    );

    const resetBtn = screen.queryByRole("button", {
      name: /reset Line/i,
    });
    expect(resetBtn).not.toBeInTheDocument();
  });

  it("should call onSavePoints when user draws with touch events", () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />
    );
    const canvas = screen.getByLabelText("topo-canvas");

    fireEvent.touchStart(canvas, { touches: [{ clientX: 10, clientY: 10 }] });
    fireEvent.touchEnd(canvas, { touches: [{ clientX: 20, clientY: 20 }] });
    fireEvent.touchEnd(canvas);

    expect(mockOnSavedPoints).toHaveBeenCalled();
    const lastCall = mockOnSavedPoints.mock.calls[0][0];
    expect(lastCall.length).toBeGreaterThan(0);
    expect(lastCall[0]).toHaveProperty("x");
    expect(lastCall[0]).toHaveProperty("y");
  });

  it("should show the reset button after drawing and clear everything on click", () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />
    );
    const canvas = screen.getByLabelText("topo-canvas");

    fireEvent.touchStart(canvas, { touches: [{ clientX: 50, clientY: 50 }] });
    fireEvent.touchEnd(canvas);

    const resetBtn = screen.getByRole("button", { name: /reset line/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);

    expect(mockOnSavedPoints).toHaveBeenLastCalledWith([]);
    expect(resetBtn).not.toBeInTheDocument();
  });
});
