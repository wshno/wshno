/**
 * Drives an already-running site: the image from docker-compose.e2e.yml on CI, or locally that
 * stack or `npm run preview` in the repo root (BASE_URL=http://localhost:4173). The specs that
 * check the server's cache headers only hold against the image.
 */
import { devices } from '@playwright/test'
import { ciReporters, definePlaywrightConfig, isCI, localReporters, monocartReporter } from '@wshno/playwright-config'

const baseURL = process.env.BASE_URL ?? 'http://localhost:8080'

/**
 * A source-map path as repo-relative `src/...`. The SPA sits at the repo root, which
 * @wshno/playwright-config's `layout` can't express (its root is an app directory), so the
 * normalising is done here: Vite's maps name sources relative to dist/assets (`../../src/App.tsx`).
 */
const repoPath = (sourcePath: string) => sourcePath.replaceAll('\\', '/').replace(/^.*?(?:^|\/)(src\/)/, '$1')
// Counted: the TypeScript under src/ except the entry point (it only mounts <App/>).
const counted = (path: string) => /^src\/.*\.tsx?$/.test(path) && path !== 'src/main.tsx'

// Shared defaults (testDir ./tests, forbidOnly, retries, the github/html/json CI reporters at the
// paths the reusable reads, trace, screenshot and video on failure) come from @wshno/playwright-config.
export default definePlaywrightConfig({
  reporter: isCI
    ? [
        ...ciReporters,
        // The SPA's browser coverage (coverageTest in tests/fixtures.ts records it): v8 html,
        // Cobertura and lcov in monocart-coverage/, uploaded by pr-e2e.yml as e2e-coverage and
        // counted in the quality artifact.
        monocartReporter({
          name: 'wsh.no E2E',
          coverage: {
            origin: baseURL,
            sourcePath: repoPath,
            sourceFilter: (sourcePath: string) => counted(repoPath(sourcePath)),
          },
        }),
      ]
    : localReporters,
  use: {
    baseURL,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
