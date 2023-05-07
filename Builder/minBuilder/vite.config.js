import { resolve } from "path";
import { defineConfig } from "vite";
export default defineConfig({
  modulePreload: {
    polyfill: false,
  },
  build: {
    minify: "esbuild",
    lib: {
      name: "Xip",
      entry: resolve(__dirname, "main.ts"),
      fileName: "x",
      formats: ["cjs", "es", "umd","iife"],
    },
  },
});
