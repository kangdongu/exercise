import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/exercise/',
  server: {
    port: 3001, // 원하는 포트 번호로 변경
  },
});
