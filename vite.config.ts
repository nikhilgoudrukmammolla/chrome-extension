import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'), // Entry for the popup
        background: resolve(__dirname, 'src/background.ts') // Entry for the background script
      },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name === 'background' ? '[name].js' : 'assets/[name].[hash].js';
        }
      }
    }
  }
});
