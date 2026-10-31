import { expect, test } from '@playwright/test'

// The /api/<game>/status.json snapshots come from cluster services, not the image, so each test
// serves its own. An unrouted game gets index.html (the SPA fallback), which the page shows as
// Unknown.
const now = () => Math.floor(Date.now() / 1000)

test.describe('status', () => {
  test('shows online, stale and unknown servers', async ({ page }) => {
    await page.route('**/api/valheim/status.json', (route) =>
      route.fulfill({
        json: {
          server: 'Valheim e2e',
          up: 1,
          updated: now() - 30,
          players: 3,
          maxPlayers: 10,
          history: {
            players: [
              [now() - 3600, 1],
              [now() - 1800, 4],
              [now(), 3],
            ],
          },
        },
      }),
    )
    await page.route('**/api/satisfactory/status.json', (route) =>
      route.fulfill({ json: { up: 1, updated: now() - 600, players: 0, techTier: 5 } }),
    )
    await page.goto('/status')

    const valheim = page.locator('article.project', { hasText: 'Valheim e2e' })
    await expect(valheim.locator('.status-pill')).toHaveText('Online')
    await expect(valheim).toContainText('Players: 3 / 10')
    await expect(valheim.getByRole('img', { name: 'Players online over the last 24 hours' })).toBeVisible()

    // A snapshot older than STALE_AFTER (180s) is not trusted as "up".
    const satisfactory = page.locator('article.project', { hasText: 'Satisfactory' })
    await expect(satisfactory.locator('.status-pill')).toHaveText('Stale')
    await expect(satisfactory).toContainText('tech tier 5')

    const enshrouded = page.locator('article.project', { hasText: 'Enshrouded' })
    await expect(enshrouded.locator('.status-pill')).toHaveText('Unknown')
    await expect(enshrouded).toContainText('Could not load status right now.')
  })

  test('shows a server that is down', async ({ page }) => {
    await page.route('**/api/spaceengineers/status.json', (route) =>
      route.fulfill({ json: { up: 0, updated: now() - 10, players: 0 } }),
    )
    await page.goto('/status')
    const card = page.locator('article.project', { hasText: 'Space Engineers' })
    await expect(card.locator('.status-pill')).toHaveText('Offline')
  })
})
