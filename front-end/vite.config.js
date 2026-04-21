import { defineConfig } from 'vite'

import { fileURLToPath, URL } from 'url'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig(async ({ command }) => {
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        types: fileURLToPath(new URL('../types/index.ts', import.meta.url)),
      },
    },
    test: {
      projects: [
        {
          extends: true,
          test: {
            browser: {
              enabled: true,
              headless: true,
              instances: [{ browser: 'chromium' }],
              provider: playwright(),
              viewport: { width: 500, height: 500 },
            },
            include: ['src/**/*.browser.ts'],
            name: 'browser',
            setupFiles: ['./vitest/setup-file.browser.ts'],
          },
        },
        {
          extends: true,
          test: {
            environment: 'jsdom',
            include: ['src/**/*.spec.ts'],
            name: 'unit',
          },
        },
      ],
    },
  }
})
