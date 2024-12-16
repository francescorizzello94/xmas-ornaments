import restart from "vite-plugin-restart";

export default {
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Auto-open in browser
  },
  build: {
    outDir: "dist", // Output to dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    restart({ restart: ["src/assets/**"] }), // Restart server on asset file change
  ],
};
