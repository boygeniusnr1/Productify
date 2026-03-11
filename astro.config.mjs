import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Force Astro to ignore the old 'dist' folder logic
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
    // This ensures Vercel treats the build as a modern Vercel Build Output
    deploymentStrategy: "serverless",
  }),
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Ensure Vite doesn't try to externalize the entry point
      ssr: true,
    },
  },
});
