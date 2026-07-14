import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Pure-logic specs run in Node; component specs opt into jsdom via a
    // `// @vitest-environment jsdom` docblock so they stay fast by default.
    environment: "node"
  }
});
