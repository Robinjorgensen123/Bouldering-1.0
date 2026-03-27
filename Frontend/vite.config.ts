/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig as defineVitestConfig } from "vitest/config";

// Vi använder Vitests version av defineConfig som inkluderar 'test'-fältet
export default defineVitestConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Bouldering",
        short_name: "Bouldering",
        description: "Bouldering logg-app",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1976d2",
        icons: [
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      includeAssets: ["apple-touch-icon.png"],
    })
  ],
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
