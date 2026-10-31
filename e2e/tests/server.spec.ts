import { expect, test } from '@playwright/test'

// server/server.go: hashed assets are cached for a year, the app shell is always revalidated, and
// unknown paths fall back to index.html so client routes work on a cold load.
test.describe('static server', () => {
  test('serves the app shell with no-cache, including for client routes', async ({ request }) => {
    for (const path of ['/', '/projects', '/skylens/privacy']) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      expect(response.headers()['cache-control'], path).toBe('no-cache')
      expect(await response.text(), path).toContain('<div id="root">')
    }
  })

  test('caches hashed assets immutably', async ({ page, request }) => {
    await page.goto('/')
    const src = await page.locator('script[type="module"]').first().getAttribute('src')
    expect(src).toMatch(/^\/assets\//)

    const response = await request.get(src ?? '')
    expect(response.status()).toBe(200)
    expect(response.headers()['cache-control']).toBe('public, max-age=31536000, immutable')
  })

  test('does not serve files outside the web root', async ({ request }) => {
    // path.Clean collapses the "..", so this resolves inside /public and falls back to the app shell.
    const response = await request.get('/%2e%2e/server.go')
    expect(response.status()).toBe(200)
    expect(await response.text()).toContain('<div id="root">')
  })
})
