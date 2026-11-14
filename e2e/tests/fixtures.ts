// Specs import test from here, not from @playwright/test. guardsTest (see @wshno/playwright-config) fails
// any test in which the page breaks its Content-Security-Policy, logs a console error or warning, throws
// uncaught, or gets a 4xx/5xx or network error for a request. coverageTest records the page's V8
// coverage for monocart-reporter when the CI config has it (playwright.config.ts).
import { mergeTests } from '@playwright/test'
import { coverageTest, guardsTest } from '@wshno/playwright-config'

export { expect } from '@playwright/test'
export const test = mergeTests(guardsTest, coverageTest)
