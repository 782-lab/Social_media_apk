// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Proxy setup
  server: {
    proxy: {
      // Jab bhi /api call ho...
      '/api': {
        // ...use is address par bhej do
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});