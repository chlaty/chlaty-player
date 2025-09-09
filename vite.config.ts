import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import solidPlugin from "vite-plugin-solid";
import suidPlugin from "@suid/vite-plugin";
import webfontDownload from 'vite-plugin-webfont-dl';
import { vite as vidstack } from 'vidstack/plugins';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(({command}) => ({
  base: './',
  plugins: [webfontDownload(), solid(), suidPlugin(), solidPlugin(), vidstack()],
  
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  
  resolve: {
    alias: {
      "@global_scripts": resolve(__dirname, "src/app/scripts")
    }
  },
  esbuild: {
    drop: command === "build" ? ["console", "debugger"] as ("console" | "debugger")[] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vidstack: ['vidstack'],
        },
      },
    },
  },

}));