import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import tsPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 5173,
    https: true,
  },
  plugins: [react(), mkcert(), tsPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});
