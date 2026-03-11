import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Astro 6 handles the 'server' vs 'static' logic automatically
  // via the adapter. Just ensure the adapter is called.
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
