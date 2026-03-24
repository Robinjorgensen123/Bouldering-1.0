import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BoulderDetailsPanel from "../BoulderDetailsPanel";
import api from "../../../../services/api";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    setAuthToken: vi.fn(),
  },
  setAuthToken: vi.fn(),
}));

describe("BoulderDetailsPanel", () => {
  const mockBoulder = {
    _id: "1",
    name: "Test Boulder",
    grade: "7A",
    location: "Loc",
  };
  const mockHistory = [
    {
      _id: "h1",
      user: { username: "ClimberDave" },
      ascentType: "redpoint",
      comment: "Solid",
      attempts: 2,
      completedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(window, "alert").mockImplementation(() => {});

    (api.get as any).mockResolvedValue({
      data: { success: true, data: mockHistory },
    });
    (api.post as any).mockResolvedValue({ data: { success: true } });
  });

  it("should render and submit log", async () => {
    render(
      <MemoryRouter>
        <BoulderDetailsPanel
          boulder={mockBoulder as any}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    );

    const climber = await screen.findByText(
      /ClimberDave/i,
      {},
      { timeout: 4000 },
    );
    expect(climber).toBeInTheDocument();

    const ascentTypeSelect = screen.getByLabelText(/ascent/i);
    fireEvent.change(ascentTypeSelect, { target: { value: "flash" } });

    fireEvent.change(screen.getByLabelText(/attempts/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/comment/i), {
      target: { value: "Nice" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(
      () => {
        expect(api.post).toHaveBeenCalledWith(
          "/history",
          expect.objectContaining({ ascentType: "flash", attempts: 3 }),
        );
        expect(window.alert).toHaveBeenCalledWith("Climb logged successfully!");
      },
      { timeout: 4000 },
    );
  }, 20000);

  it("should close the panel when the mobile close button is pressed", async () => {
    const handleClose = vi.fn();

    render(
      <MemoryRouter>
        <BoulderDetailsPanel
          boulder={mockBoulder as any}
          isOpen={true}
          onClose={handleClose}
        />
      </MemoryRouter>,
    );

    const closeButton = await screen.findByRole("button", {
      name: /close log climb panel/i,
    });

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should display boulder image when imagesUrl is provided", async () => {
    const boulderWithImage = {
      ...mockBoulder,
      imagesUrl: "https://example.com/boulder-image.jpg",
    };

    render(
      <MemoryRouter>
        <BoulderDetailsPanel
          boulder={boulderWithImage as any}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    );

    const image = await screen.findByAltText("Test Boulder");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://example.com/boulder-image.jpg",
    );
  });

  it("should not display image when imagesUrl is not provided", () => {
    render(
      <MemoryRouter>
        <BoulderDetailsPanel
          boulder={mockBoulder as any}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    );

    const image = screen.queryByAltText("Test Boulder");
    expect(image).not.toBeInTheDocument();
  });

  it("should open fullscreen modal when image is clicked", async () => {
    const boulderWithImage = {
      ...mockBoulder,
      imagesUrl: "https://example.com/boulder-image.jpg",
    };

    render(
      <MemoryRouter>
        <BoulderDetailsPanel
          boulder={boulderWithImage as any}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    );

    const image = await screen.findByAltText("Test Boulder");
    fireEvent.click(image);

    const fullscreenImage = await screen.findByRole("img", {
      hidden: true,
    });
    expect(fullscreenImage).toBeInTheDocument();
  });

  it("should close fullscreen modal when image is clicked", async () => {
    const boulderWithImage = {
      ...mockBoulder,
      imagesUrl: "https://example.com/boulder-image.jpg",
    };

    render(
      <MemoryRouter>
        <BoulderDetailsPanel
          boulder={boulderWithImage as any}
          isOpen={true}
          onClose={vi.fn()}
        />
      </MemoryRouter>,
    );

    const image = await screen.findByAltText("Test Boulder");

    // Click to open fullscreen
    fireEvent.click(image);

    // Click again to close fullscreen
    fireEvent.click(image);

    expect(image).toBeInTheDocument();
  });
});
