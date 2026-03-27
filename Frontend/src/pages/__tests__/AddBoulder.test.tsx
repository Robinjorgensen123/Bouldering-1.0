import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddBoulder from "../AddBoulder/AddBoulder";
import api from "../../services/api";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("../../services/api", () => ({
  default: { post: vi.fn() },
  setAuthToken: vi.fn(),
}));

const storageMock = () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "token") return "fake-jwt-token";
    return null;
  });
};

const renderWithRouter = () => {
  return render(
    <MemoryRouter initialEntries={["/add"]}>
      <Routes>
        <Route path="/add" element={<AddBoulder />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("AddBoulder test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.URL.createObjectURL = vi.fn(() => "mock-url");
    storageMock();

    const mockGeolocation = {
      getCurrentPosition: vi.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude: 57.7089,
            longitude: 11.9746,
          },
        }),
      ),
    };
    (globalThis.navigator as any).geolocation = mockGeolocation;
  });

  it("should render all input fields and get the coordinates button", () => {
    renderWithRouter();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/grade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select image/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get coordinates/i }),
    ).toBeInTheDocument();
  }, 10000);

  it("should fetch and display coordinates when the button is clicked", async () => {
    renderWithRouter();

    const getCoordsBtn = screen.getByRole("button", {
      name: /get coordinates/i,
    });
    fireEvent.click(getCoordsBtn);

    await waitFor(
      () => {
        expect(screen.getByText(/57.7089/)).toBeInTheDocument();
        expect(screen.getByText(/11.9746/)).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  }, 10000);

  it("should show a preview when an image is selected", async () => {
    renderWithRouter();

    const file = new File(["test"], "boulder.png", { type: "image/png" });
    const input = screen.getByLabelText(/select image/i);

    fireEvent.change(input, { target: { files: [file] } });

    const preview = screen.getByAltText(/preview/i);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute("src", "mock-url");
  }, 10000);

  it("should capture topo points when drawing on the canvas", async () => {
    renderWithRouter();

    const file = new File(["test"], "boulder.png", { type: "image/png" });
    const input = screen.getByLabelText(/select image/i);
    fireEvent.change(input, { target: { files: [file] } });

    const canvas = screen.getByLabelText("topo-canvas");

    fireEvent.touchStart(canvas, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchMove(canvas, { touches: [{ clientX: 150, clientY: 200 }] });
    fireEvent.touchEnd(canvas);

    expect(
      screen.getByRole("button", { name: /reset line/i }),
    ).toBeInTheDocument();
  }, 10000);

  it("should submit the form and include topoData in the FormData", async () => {
    (api.post as any).mockResolvedValue({
      status: 201,
      data: { success: true },
    });

    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Midnight Lightning" },
    });
    fireEvent.change(screen.getByLabelText(/grade/i), {
      target: { value: "7B" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Classic" },
    });
    fireEvent.change(screen.getByLabelText(/area \/ sector/i), {
      target: { value: "Yosemite" },
    });

    const file = new File(["image"], "boulder.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText(/select image/i), {
      target: { files: [file] },
    });

    const getCoordsBtn = screen.getByRole("button", {
      name: /get coordinates/i,
    });
    fireEvent.click(getCoordsBtn);

    await waitFor(() => {
      expect(screen.getByText(/57\.7089/)).toBeInTheDocument();
      expect(screen.getByText(/11\.9746/)).toBeInTheDocument();
    });

    const canvas = screen.getByLabelText("topo-canvas");
    fireEvent.touchStart(canvas, { touches: [{ clientX: 50, clientY: 50 }] });
    fireEvent.touchEnd(canvas);

    const submitBtn = screen.getByRole("button", { name: /upload/i });
    fireEvent.click(submitBtn);

    await waitFor(
      () => {
        expect(api.post).toHaveBeenCalled();

        const postCall = (api.post as any).mock.calls[0];
        const formData = postCall[1] as FormData;

        expect(formData.get("name")).toBe("Midnight Lightning");
        expect(formData.get("location")).toBe("Yosemite");

        const topoDataRaw = formData.get("topoData");
        expect(topoDataRaw).toBeDefined();

        const topoData = JSON.parse(topoDataRaw as string);

        expect(topoData.linePoints.length).toBeGreaterThan(0);
      },
      { timeout: 4000 },
    );
  }, 20000);
});
