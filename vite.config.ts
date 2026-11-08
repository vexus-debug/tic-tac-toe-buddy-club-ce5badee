// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";
import path from "path";

// Load every .env key (incl. OPENROUTER_API_KEY, RESEND_API_KEY) into the server's process.env.
// Server-only: these are never bundled into browser code (only VITE_* keys are).
for (const [k, v] of Object.entries(loadEnv(process.env.NODE_ENV === "production" ? "production" : "development", process.cwd(), ""))) {
  if (process.env[k] === undefined) process.env[k] = v;
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    resolve: {
      alias: {
        // The imported app registers a service worker via vite-plugin-pwa's
        // virtual module; the stub keeps that import working without the plugin.
        "virtual:pwa-register": path.resolve(__dirname, "src/lib/pwa-register-stub.ts"),
      },
    },
  },
});
