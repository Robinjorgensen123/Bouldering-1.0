// Mocka heic2any globalt för tester
vi.mock('heic2any', () => ({
  __esModule: true,
  default: async () => new Blob(["dummy"], { type: "image/jpeg" })
}));
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// 1. Fix för scrollIntoView
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.URL.createObjectURL = vi.fn(() => "mock-url");

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });

  window.cancelAnimationFrame = vi.fn();
}

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class IntersectionObserverMock {
  root = null;
  rootMargin = "0px";
  thresholds = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  writable: true,
  value: vi.fn(() => ({
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
  })),
});

// 2. Global MUI Mock
vi.mock("@mui/material", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mui/material")>();
  return {
    ...actual,
    // mappar om MUI-namnen (Stora bokstäver) till HTML-taggar (små bokstäver)
    Drawer: ({ children, open }: any) =>
      open ? <div data-testid="mock-drawer">{children}</div> : null,

    Select: ({ children, value, onChange, label, labelId }: any) => (
      <select
        aria-labelledby={labelId}
        aria-label={label}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange({ target: { value: e.target.value } } as any);
          }
        }}
      >
        {children}
      </select>
    ),

    // HÄR VAR FELET: Vi mappar MenuItem till en vanlig <option>
    MenuItem: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),

    Modal: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  };
});
