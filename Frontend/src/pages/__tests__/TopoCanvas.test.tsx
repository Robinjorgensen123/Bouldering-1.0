import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TopoCanvas from "../../features/topo/components/TopoCanvas";

Object.defineProperty(HTMLCanvasElement.prototype, "getBoundingClientRect", {
  value: () => ({
    width: 500,
    height: 500,
    top: 0,
    left: 0,
    right: 500,
    bottom: 500,
  }),
});

describe("TopoCanvas Unit Test", () => {
  const mockOnSavedPoints = vi.fn();
  const dummySrc = "mock-url";

  it("should render the image and the canvas with correct aria-label", () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />,
    );

    expect(screen.getByAltText(/preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText("topo-canvas")).toBeInTheDocument();
  });

  it("should start with no points and no reset button", () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />,
    );

    const resetBtn = screen.queryByRole("button", {
      name: /reset Line/i,
    });
    expect(resetBtn).not.toBeInTheDocument();
  });

  it("should call onSavePoints when user draws with touch events", async () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />,
    );

    const img = screen.getByAltText(/preview/i);
    Object.defineProperty(img, "naturalWidth", { value: 1000 });
    Object.defineProperty(img, "naturalHeight", { value: 1000 });
    Object.defineProperty(img, "clientWidth", { value: 1000 });
    Object.defineProperty(img, "clientHeight", { value: 1000 });
    Object.defineProperty(img, "width", { value: 1000 });
    Object.defineProperty(img, "height", { value: 1000 });
    fireEvent.load(img);

    const canvas = screen.getByLabelText("topo-canvas");

    // Rita en tydlig linje
    fireEvent.touchStart(canvas, { touches: [{ clientX: 50, clientY: 50 }] });
    fireEvent.touchMove(canvas, { touches: [{ clientX: 400, clientY: 400 }] });
    fireEvent.touchEnd(canvas);

    await waitFor(
      () => {
        expect(mockOnSavedPoints).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );

    const lastCall =
      mockOnSavedPoints.mock.calls[mockOnSavedPoints.mock.calls.length - 1][0];
    expect(lastCall.length).toBeGreaterThan(0);
  });

  it("should show the reset button after drawing and clear everything on click", async () => {
    render(
      <TopoCanvas imageSrc={dummySrc} onSavedPoints={mockOnSavedPoints} />,
    );
    const canvas = screen.getByLabelText("topo-canvas");

    fireEvent.touchStart(canvas, { touches: [{ clientX: 50, clientY: 50 }] });
    fireEvent.touchMove(canvas, { touches: [{ clientX: 400, clientY: 400 }] });
    fireEvent.touchEnd(canvas);

    const resetBtn = await screen.findByRole("button", { name: /reset line/i });
    expect(resetBtn).toBeInTheDocument();

    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(mockOnSavedPoints).toHaveBeenLastCalledWith([]);
    });
    expect(resetBtn).not.toBeInTheDocument();
  });
});
