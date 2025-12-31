import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddBoulder from "../AddBoulder/AddBoulder";
import { BrowserRouter } from "react-router-dom";

const storageMock = () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "token") return "fake-jwt-token";
    return null;
  });
};

describe("AddBoulder test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = vi.fn();
    globalThis.URL.createObjectURL = vi.fn(() => "mock-url");
    storageMock();
  });

  it("should render all input fields required bu the backend controller", () => {
    render(
      <BrowserRouter>
        <AddBoulder />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/grade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select image/i)).toBeInTheDocument();
  });

  it("should show a preview when an image is selected", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AddBoulder />
      </BrowserRouter>
    );

    const file = new File(["test"], "boulder.png", { type: "image/png" });
    const input = screen.getByLabelText(/select image/i);

    await user.upload(input, file);

    const preview = screen.getByAltText(/preview/i);
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute("src", "mock-url");
  });

  it("should submit the form with FormData matching the backend requirements", async () => {
    const user = userEvent.setup();

    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "Boulder created successfully",
      }),
    });

    render(
      <BrowserRouter>
        <AddBoulder />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/name/i), "Midnight Lightning");
    await user.type(screen.getByLabelText(/grade/i), "7B");
    await user.type(screen.getByLabelText(/description/i), "Classic highball");

    const file = new File(["image"], "bouldering.png", { type: "image/png" });
    await user.upload(screen.getByLabelText(/select image/i), file);

    const submitBtn = screen.getByRole("button", { name: /upload/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: expect.stringContaining("Bearer "),
          }),
        })
      );
    });
  });
});
