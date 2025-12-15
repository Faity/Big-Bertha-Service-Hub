import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
    proxy: {
      // Proxy configuration for iLO Redfish
      // Note: In a real dynamic IP scenario, this proxy is static. 
      // The frontend code allows switching between direct connection and proxy.
      '/redfish': {
        target: 'https://192.168.1.100', // Default Placeholder
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});