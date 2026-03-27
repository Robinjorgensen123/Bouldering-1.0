/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig as defineVitestConfig } from "vitest/config";

// Vi använder Vitests version av defineConfig som inkluderar 'test'-fältet
export default defineVitestConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.tsx",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/*.d.ts",
        "src/**/types/*.ts",
        "src/vite-env.d.ts",
        "src/vitest.d.ts",
        "src/main.tsx",
        "src/theme.ts",
        "src/**/__tests__/**",
        "src/**/test/**",
      ],
    },
  },
});
