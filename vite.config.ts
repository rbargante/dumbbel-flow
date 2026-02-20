import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // ✅ Using custom domain → base MUST be "/"
  base: "/",

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // ✅ PWA (auto-update, no user prompt)
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon-192.png", "icon-512.png"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));