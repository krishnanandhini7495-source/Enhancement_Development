import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: Point to the existing React TypeScript source code in ../src
  // This allows the desktop app to use the same codebase as the web app
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },

  // Tauri uses a localhost development server, but in production,
  // it loads files directly from the filesystem
  clearScreen: false,
  
  // Tauri expects a specific port in dev mode
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // Watch the parent src folder for changes
      ignored: ["**/src-tauri/**"],
    },
  },

  // Environment prefix for Tauri
  envPrefix: ["VITE_", "TAURI_"],

  build: {
    // Tauri uses Chromium on Windows, so we can target modern browsers
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    
    // Don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    
    // Produce sourcemaps for debugging
    sourcemap: !!process.env.TAURI_DEBUG,
    
    // Output directory
    outDir: "dist",
  },
});
