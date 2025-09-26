import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
      '/teacher': 'http://localhost:3000',
      '/parent': 'http://localhost:3000',
      '/student': 'http://localhost:3000'
    }
  },
  publicDir: 'public'
});