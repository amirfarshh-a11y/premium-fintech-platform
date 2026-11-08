import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const apiTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Bind-mounted source: poll so file events always arrive in containers.
    watch: { usePolling: true, interval: 400 },
    // The preview proxy forwards the public host / origin, so the dev server has
    // to accept both. In the sandbox the platform injects
    // __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS (Vite >= 6.1 appends it).
    allowedHosts: process.env.BASE44_PREVIEW_MODE === '1'
      ? ['.' + (process.env.BASE44_SANDBOX_HOST_DOMAIN || 'base44-preview.app')]
      : undefined,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
