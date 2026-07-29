import { defineConfig } from 'vite';

export default defineConfig({
  // Base path relativa/configurabile per il verificatore (default /nfc/ per www.abboaps.org/nfc/)
  base: process.env.VITE_BASE_URL || '/nfc/',
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabilitata in produzione per sicurezza
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    host: '127.0.0.1',
  },
});
