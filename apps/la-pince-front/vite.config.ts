// vite.config.ts
import { configDefaults, defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [...configDefaults.exclude, 'custom-exclude-dir/**'],
    coverage: {
      provider: 'v8',                 // utilise @vitest/coverage-v8
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,                      // inclure les fichiers non testés
      include: ['actions/**/*.{ts,tsx}'], // adapte si besoin
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'next.config.*',
        'vite.config.*',
        'cypress/**'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
