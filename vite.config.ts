import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import istanbul from "vite-plugin-istanbul";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    istanbul({
      cypress: true,
      requireEnv: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
