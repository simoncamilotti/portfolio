import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../../node_modules/.vite/libs/web/ui',
  plugins: [react()],
  test: {
    name: '@repo/ui',
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './test-output/coverage',
    },
  },
});
