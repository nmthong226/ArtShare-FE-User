import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import istanbul from "vite-plugin-istanbul";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env file tương ứng với mode (ví dụ: .env.test)
  const env = loadEnv(process.env.MODE || mode, process.cwd(), '');


  // Log thử để chắc chắn biến được load (có thể xoá sau khi kiểm tra)
  console.log("🧪 Loaded VITE_FIREBASE_API_KEY:", env.VITE_FIREBASE_API_KEY);

  return {
    plugins: [
      react(),
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
    define: {
      // Ép biến env dùng được trong import.meta.env
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
    },
  };
});
