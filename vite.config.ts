import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const here = path.dirname(fileURLToPath(import.meta.url));
const pages = Boolean(process.env.GITHUB_PAGES);

export default defineConfig({
  base: pages ? "/kayo-catalog/" : "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "spa-github-pages-fallback",
      closeBundle() {
        const dist = path.resolve(here, "dist");
        const index = path.join(dist, "index.html");
        if (fs.existsSync(index)) {
          fs.copyFileSync(index, path.join(dist, "404.html"));
        }
        fs.writeFileSync(path.join(dist, ".nojekyll"), "");
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(here, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
