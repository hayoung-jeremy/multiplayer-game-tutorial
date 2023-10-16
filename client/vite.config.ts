import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 내 로컬에 회사내부 다른 컴퓨터에서 접속 가능
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 지정한 별칭으로 경로 수정하는 설정
    },
  },
});
