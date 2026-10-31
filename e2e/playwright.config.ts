/**
 * Drives an already-running site: the image from docker-compose.e2e.yml on CI, or locally that
 * stack or `npm run preview` in the repo root (BASE_URL=http://localhost:4173). The specs that
 * check the server's cache headers only hold against the image.
 */
import { devices } from '@playwright/test'
import { definePlaywrightConfig } from '@wshno/playwright-config'

// Shared defaults (testDir ./tests, forbidOnly, retries, the github/html/json CI reporters at the
// paths the reusable reads, trace, screenshot and video on failure) come from @wshno/playwright-config.
export default definePlaywrightConfig({
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8080',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
