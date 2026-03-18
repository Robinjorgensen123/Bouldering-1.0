import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BoulderDetailsPanel from "../BoulderDetailsPanel";
import api from "../../../services/api";
import { MemoryRouter } from "react-router-dom";

// Mocka API:et
vi.mock("../../../services/api", () => ({
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
      style: "redpoint",
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

    // 1. Vänta på att ClimberDave dyker upp (viktigt för att veta att useEffect kört)
    const climber = await screen.findByText(
      /ClimberDave/i,
      {},
      { timeout: 4000 },
    );
    expect(climber).toBeInTheDocument();

    // 2. Fyll i formuläret
    const styleSelect = screen.getByLabelText(/style/i);
    fireEvent.change(styleSelect, { target: { value: "flash" } });

    fireEvent.change(screen.getByLabelText(/attempts/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/comment/i), {
      target: { value: "Nice" },
    });

    // 3. Klicka på Spara
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // 4. Verifiera anropet
    await waitFor(
      () => {
        expect(api.post).toHaveBeenCalledWith(
          "/history",
          expect.objectContaining({ style: "flash", attempts: 3 }),
        );
        expect(window.alert).toHaveBeenCalledWith("Climb logged successfully!");
      },
      { timeout: 4000 },
    );
  }, 20000);
});
