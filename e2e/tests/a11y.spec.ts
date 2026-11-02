import { expectAccessible } from '@wshno/playwright-config'

import { expect, test } from './fixtures'

// axe on every route: serious and critical WCAG 2.x A/AA violations fail.
const paths = ['/', '/projects', '/status', '/contact', '/skylens/privacy', '/skylens/delete-data']

test.describe('accessibility', () => {
  for (const path of paths) {
    test(`${path} has no serious or critical violations`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expectAccessible(page)
    })
  }
})
