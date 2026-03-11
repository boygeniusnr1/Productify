import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // In Astro 5, 'static' is the default.
  // We keep it this way and use 'export const prerender = false'
  // in your [userId].ics.ts file to make that specific route dynamic.
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
