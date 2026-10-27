import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'renderer',
  base: process.env.VITE_STATIC_DEMO === 'true' ? '/Duncan-Pro/platform/' : '/',
  // The local public folder can contain a generated source archive; publish only selected demo assets.
  publicDir: process.env.VITE_STATIC_DEMO === 'true' ? false : 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './renderer/src'),
    },
  },
  server: {
    port: 15168,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:18000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: process.env.VITE_STATIC_DEMO === 'true' ? path.resolve(__dirname, '../../docs/platform') : path.resolve(__dirname, './dist'),
    emptyOutDir: true,
  },
});
