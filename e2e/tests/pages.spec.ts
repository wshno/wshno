import { expect, test } from '@playwright/test'

test.describe('pages', () => {
  test('nav links set the route and the title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle('WsHosting.Org / About')

    for (const [label, path, title] of [
      ['Projects', '/projects', 'WsHosting.Org / Projects'],
      ['Status', '/status', 'WsHosting.Org / Status'],
      ['Contact', '/contact', 'WsHosting.Org / Contact'],
      ['About Us', '/', 'WsHosting.Org / About'],
    ] as const) {
      await page.getByRole('navigation').getByRole('link', { name: label }).click()
      await expect(page).toHaveURL(path)
      await expect(page).toHaveTitle(title)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
    }
  })

  test('the price list is on the about page', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('cell', { name: 'Simplicity' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Setup fee' })).toBeVisible()
  })

  test('the project tag filter narrows the list', async ({ page }) => {
    await page.goto('/projects')
    const projects = page.locator('article.project')
    const all = await projects.count()
    expect(all).toBeGreaterThan(1)

    await page.getByRole('button', { name: 'android', exact: true }).click()
    await expect(projects).toHaveCount(1)
    await expect(projects.getByRole('heading')).toHaveText('Skylens')

    await page.getByRole('button', { name: 'all', exact: true }).click()
    await expect(projects).toHaveCount(all)
  })

  test('the unlisted Skylens legal pages load directly', async ({ page }) => {
    // Deep-linked from the Play listing, so they must work on a cold load (the server's SPA fallback).
    await page.goto('/skylens/privacy')
    await expect(page).toHaveTitle('WsHosting.Org / Skylens Privacy Policy')
    await page.goto('/skylens/delete-data')
    await expect(page).toHaveTitle('WsHosting.Org / Skylens Data Deletion')
  })

  test('an unknown route shows the about page', async ({ page }) => {
    await page.goto('/no/such/page')
    await expect(page).toHaveTitle('WsHosting.Org / About')
  })
})
