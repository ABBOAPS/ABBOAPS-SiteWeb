import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const pollingWatch = process.env.VITE_USE_POLLING !== 'false';

  return {
    base: './', // Universal path resolve for Github Pages and Custom Domains
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'serve-tessera-and-nfc-dev',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url) {
              const urlPath = req.url.split('?')[0].split('#')[0];
              if (urlPath === '/tessera' || urlPath === '/tessera/') {
                req.url = '/site/tessera/index.html';
              } else if (urlPath === '/nfc' || urlPath === '/nfc/') {
                req.url = '/site/index.html';
              } else if (urlPath === '/abbiamo' || urlPath === '/abbiamo/') {
                req.url = '/index.html';
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Extract recharts and d3 (only used in BalanceViewer)
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-charts';
              }
              // Extract react-markdown and related parsing libraries (only used in news articles)
              if (
                id.includes('react-markdown') ||
                id.includes('remark') ||
                id.includes('rehype') ||
                id.includes('unified') ||
                id.includes('micromark') ||
                id.includes('unist') ||
                id.includes('vfile') ||
                id.includes('decode-named-character-reference') ||
                id.includes('mdast') ||
                id.includes('property-information') ||
                id.includes('space-separated-tokens') ||
                id.includes('comma-separated-tokens')
              ) {
                return 'vendor-markdown';
              }
              // Extract icons
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
            }
          }
        }
      }
    },
    server: {
      // HMR resta attivo, ma il polling evita EMFILE sui sistemi con molti watcher aperti.
      // Per usare il watcher nativo: VITE_USE_POLLING=false npm run dev
      hmr: process.env.DISABLE_HMR !== 'true',
      // Ignore directory pesanti e usa un solo ciclo di polling invece di un watcher per file.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        usePolling: pollingWatch,
        interval: 1000,
        ignored: [
          /(^|[\/\\])(\.git|node_modules|\.private|dist|shared-public-test-vectors)($|[\/\\])/
        ],
      },
    },
  };
});
