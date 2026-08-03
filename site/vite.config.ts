import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.VITE_BASE_URL || './',
  build: {
    outDir: 'dist',
    sourcemap: false, // Disabilitata in produzione per sicurezza
    minify: 'terser',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tessera: resolve(__dirname, 'tessera/index.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    host: '127.0.0.1',
    watch: {
      ignored: [
        /(^|[\/\\])(\.git|node_modules|\.private|dist|shared-public-test-vectors)($|[\/\\])/
      ],
    },
  },
});
