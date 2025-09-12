import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    include: [
      'components/__tests__/**/*.test.ts?(x)',
      'hooks/__tests__/**/*.test.ts?(x)'
    ],
    css: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
