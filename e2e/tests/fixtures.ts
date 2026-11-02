// Specs import test from here, not from @playwright/test. guardsTest (see @wshno/playwright-config) fails
// any test in which the page breaks its Content-Security-Policy, logs a console error or warning, throws
// uncaught, or gets a 4xx/5xx or network error for a request.
export { expect } from '@playwright/test'
export { guardsTest as test } from '@wshno/playwright-config'
