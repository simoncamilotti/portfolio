import react from '@vitejs/plugin-react';
import { defaultClientConditions } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/studio',
  resolve: {
    // Workspace libs are read from their sources.
    conditions: ['@repo/source', ...defaultClientConditions],
  },
  server: {
    port: 4201,
    host: 'localhost',
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  preview: { port: 4201, host: 'localhost' },
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  test: {
    name: 'studio',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './test-output/coverage',
    },
  },
});
