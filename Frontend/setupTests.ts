import "@testing-library/jest-dom";
import "jest-canvas-mock";
import { vi } from "vitest";

window.URL.createObjectURL = vi.fn(() => "mock-url");

window.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;
