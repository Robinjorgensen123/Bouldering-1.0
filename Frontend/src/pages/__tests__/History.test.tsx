import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import History from "../History/History";
import api from "../../services/api";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";

vi.mock("../../services/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  setAuthToken: vi.fn(),
}));

const renderHistory = () => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <History />
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe("History Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "token") return "fake-jwt-token";
      return null;
    });
  });

  it("should show loading state initially", () => {
    (api.get as any).mockReturnValue(new Promise(() => {}));
    renderHistory();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render history records correctly", async () => {
    const mockResponse = {
      data: {
        success: true,
        data: [
          {
            _id: "h1",
            style: "flash",
            attempts: 1,
            comment: "Felt great!",
            createdAt: "2024-06-01T12:00:00Z",
            boulder: {
              name: "The Slab",
              grade: "V2",
            },
          },
        ],
      },
    };

    (api.get as any).mockResolvedValueOnce(mockResponse);
    renderHistory();

    await waitFor(() => {
      expect(screen.getByText(/the slab/i)).toBeInTheDocument();
      expect(screen.getByText(/v2/i)).toBeInTheDocument();
      expect(screen.getByText(/flash/i)).toBeInTheDocument();
      expect(screen.getByText(/felt great/i)).toBeInTheDocument();
    });
  });

  it("should show empty state when no history is returned", async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        success: true,
        data: [],
      },
    });
    renderHistory();

    await waitFor(() => {
      expect(screen.getByText(/no history records found/i)).toBeInTheDocument();
    });
  });
});
