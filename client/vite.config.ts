import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "index.html",
        dashboard: "src/pages/Dashboard.tsx",
        table: "src/pages/TaskTable.tsx",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@store": "/src/store",
      "@config": "/src/config",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@assets": "/src/assets",
      "@services": "/src/services",
      "@types": "/src/types",
      "@context": "/src/context",
      "@styles": "/src/styles",
    },
  },
});
