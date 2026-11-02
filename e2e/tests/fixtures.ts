// Specs import test from here, not from @playwright/test: cspTest fails any test in which the page
// breaks its Content-Security-Policy (see @wshno/playwright-config).
export { expect } from '@playwright/test'
export { cspTest as test } from '@wshno/playwright-config'
