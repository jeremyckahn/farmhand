/**
 * @param {import('@playwright/test').Page} page
 * @param {number=} seed
 * @returns {Promise<import('@playwright/test').Response | null>}
 */
export const openPage = async (page, seed = 0.5) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  // NOTE: A consistent date for the game is set so that time-based events
  // don't interfere with the tests
  await page.clock.install({ time: new Date('2025-01-01T09:00:00') })

  return page.goto(`${appUrl}?seed=${seed}`)
}
