import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    svelte(),
    glsl(),
  ],
  publicDir: "assets",
});
