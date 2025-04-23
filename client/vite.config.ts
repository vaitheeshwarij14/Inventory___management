import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: "::",
      port: 8080,
      https: {
        key: fs.readFileSync(path.resolve(__dirname, "certs/localhost-key.pem")),
        cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
      },
    },
    plugins: [
      react(),
      isDev && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
