import "@testing-library/jest-dom";
import { vi } from "vitest";

// 1. Fix för scrollIntoView
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

// 2. Global MUI Mock
vi.mock("@mui/material", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mui/material")>();
  return {
    ...actual,
    // Vi mappar om MUI-namnen (Stora bokstäver) till HTML-taggar (små bokstäver)
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
