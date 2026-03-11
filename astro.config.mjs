import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Switch output to 'server' to ensure the entry.mjs is generated correctly
  output: "server",
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
