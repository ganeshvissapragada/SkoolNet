import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: '0.0.0.0', // Allow access from network devices
    open: true,
    strictPort: true, // Force port 5174 specifically
    proxy: {
      '/auth': 'http://localhost:3001',
      '/admin': 'http://localhost:3001',
      '/teacher': 'http://localhost:3001',
      '/parent': 'http://localhost:3001',
      '/student': 'http://localhost:3001'
    }
  },
  publicDir: 'public'
});