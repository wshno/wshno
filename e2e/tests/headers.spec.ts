import { parseCsp } from '@wshno/playwright-config'

import { expect, test } from './fixtures'

// static-server.json sets these on every response: the app shell, client routes and hashed assets.
const expected = {
  'cross-origin-opener-policy': 'same-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
}

test.describe('security headers', () => {
  test('are on the app shell, client routes and assets', async ({ page, request }) => {
    await page.goto('/')
    const asset = await page.locator('script[type="module"]').first().getAttribute('src')

    for (const path of ['/', '/projects', '/skylens/privacy', asset ?? '']) {
      const headers = (await request.get(path)).headers()
      expect(headers, path).toMatchObject(expected)
      expect(headers['content-security-policy'], path).toBeTruthy()
    }
  })

  test('the policy loads only from the site itself and cannot be framed', async ({ request }) => {
    const policies = parseCsp((await request.get('/')).headers()['content-security-policy'])
    expect(policies).toHaveLength(1)
    const [policy] = policies

    expect(policy?.get('default-src')).toEqual(["'self'"])
    expect(policy?.get('script-src')).toEqual(["'self'"])
    expect(policy?.get('style-src')).toEqual(["'self'"])
    expect(policy?.get('object-src')).toEqual(["'none'"])
    expect(policy?.get('base-uri')).toEqual(["'none'"])
    expect(policy?.get('frame-ancestors')).toEqual(["'none'"])
  })

  test.describe('in the browser', () => {
    test.use({ cspGuard: { mode: 'warn' } })

    test('an injected inline script is blocked and reported', async ({ cspViolations, page }) => {
      await page.goto('/')
      await page.evaluate(() => {
        const script = document.createElement('script')
        script.textContent = 'document.title = "injected"'
        document.body.append(script)
      })
      await expect.poll(() => cspViolations.map((v) => v.effectiveDirective)).toEqual(['script-src-elem'])
      await expect(page).toHaveTitle('WsHosting.Org / About')
    })
  })
})
