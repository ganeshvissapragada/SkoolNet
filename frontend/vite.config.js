import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow access from network devices
    open: true,
    proxy: {
      '/auth': 'http://172.20.10.3:3001',
      '/admin': 'http://172.20.10.3:3001',
      '/teacher': 'http://172.20.10.3:3001',
      '/parent': 'http://172.20.10.3:3001',
      '/student': 'http://172.20.10.3:3001'
    }
  },
  publicDir: 'public'
});