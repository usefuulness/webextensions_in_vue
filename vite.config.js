import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// Import webExtension from the local path
import webExtension from 'vite-plugin-web-extension';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  
  return {
    plugins: [
      vue(),
      webExtension({
        manifest: isDevelopment 
          ? './public/manifest.dev.json' 
          : './public/manifest.json',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      emptyOutDir: !isDevelopment, // Don't empty the output directory in development mode
      outDir: 'dist',
      sourcemap: isDevelopment ? 'inline' : false,
      // In development mode, don't minify the code for better debugging
      minify: !isDevelopment,
      rollupOptions: {
        input: {
          popup: 'src/pages/popup/index.html',
          options: 'src/pages/options/index.html',
          background: 'src/pages/background/index.ts',
          'content-script': 'src/pages/content/index.ts',
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
    },
    // Enable hot module replacement for development
    server: {
      hmr: isDevelopment,
      watch: {
        usePolling: true,
      },
    },
    optimizeDeps: {
      // Force include these dependencies to avoid ESM/CommonJS conflicts
      include: ['vue', 'vue-router', 'pinia'],
    },
  };
});
