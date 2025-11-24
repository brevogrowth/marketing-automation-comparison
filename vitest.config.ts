import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'], // Only include unit test files
    exclude: ['**/*.spec.ts', 'node_modules/**'], // Exclude Playwright specs
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
