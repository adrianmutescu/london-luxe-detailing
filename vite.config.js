import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "services.html"),
        gallery: resolve(__dirname, "gallery.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});
