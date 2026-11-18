import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defaultClientConditions } from 'vite';
import { defineConfig } from 'vitest/config';

import { runtimeConfig } from './runtime-config.plugin.js';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/client',
  resolve: {
    // Workspace libs are read from their sources.
    conditions: ['@repo/source', ...defaultClientConditions],
  },
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: { port: 4200, host: 'localhost' },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/routes',
      generatedRouteTree: './src/route-tree.gen.ts',
    }),
    react(),
    runtimeConfig(),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  test: {
    name: 'client',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    setupFiles: ['src/test-setup.tsx'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './test-output/coverage',
    },
  },
});
