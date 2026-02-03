import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@ui": path.resolve(__dirname, "src/components/ui"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core libraries
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // React Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Radix UI components
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-ui";
          }
          // Icons
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          // Charts and date pickers
          if (
            id.includes("node_modules/recharts") ||
            id.includes("node_modules/react-day-picker") ||
            id.includes("node_modules/dayjs")
          ) {
            return "vendor-charts";
          }
          // Form libraries
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform") ||
            id.includes("node_modules/zod")
          ) {
            return "vendor-forms";
          }
          // State management
          if (id.includes("node_modules/zustand")) {
            return "vendor-state";
          }
          // Other node_modules
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    // Adjust chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
});
