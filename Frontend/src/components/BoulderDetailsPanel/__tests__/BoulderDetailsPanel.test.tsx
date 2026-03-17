import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BoulderDetailsPanel from "../BoulderDetailsPanel";
import api from "../../../services/api";

vi.mock("../../../services/api", () => ({
  default: { post: vi.fn() },
  setAuthToken: vi.fn(),
}));

describe("BoulderDetailsPanel", () => {
  const mockBoulder = {
    _id: "1",
    name: "Test Boulder",
    grade: "7A",
    location: "Test Location",
  };

  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn();
  });

  it("should render boulder info and submit a log", async () => {
    (api.post as any).mockResolvedValue({ data: { success: true } });

    render(
      <BoulderDetailsPanel boulder={mockBoulder as any} isOpen={true} onClose={onClose} />,
    );

    expect(screen.getByText(/Test Boulder/i)).toBeInTheDocument();
    expect(screen.getByText(/7A - Test Location/i)).toBeInTheDocument();

    const styleSelect = screen.getByLabelText(/style/i);
    userEvent.click(styleSelect);
    const flashOption = await screen.findByRole("option", { name: /flash/i });
    userEvent.click(flashOption);

    const attemptsInput = screen.getByLabelText(/attempts/i);
    userEvent.clear(attemptsInput);
    userEvent.type(attemptsInput, "3");

    const commentInput = screen.getByLabelText(/comment/i);
    userEvent.type(commentInput, "Nice climb");

    const saveButton = screen.getByRole("button", { name: /save/i });
    userEvent.click(saveButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/history", {
        boulder: mockBoulder._id,
        style: "flash",
        attempts: 3,
        comment: "Nice climb",
      });
      expect(onClose).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Climb logged successfully!");
    });
  });
});
