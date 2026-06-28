const gameStartTime = '2025-01-01T09:00:00'

/**
 * @param {import('@playwright/test').Page} page
 * @param {number=} seed
 * @returns {Promise<import('@playwright/test').Response | null>}
 */
export const openPage = async (page, seed = 0.5) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3002'

  // NOTE: A consistent date for the game is set so that time-based events
  // don't interfere with the tests
  await page.clock.install({ time: gameStartTime })

  await page.route('**/api/*', async route => {
    const isOnline = await page
      .evaluate(() => navigator.onLine)
      .catch(() => true)
    if (!isOnline) {
      await route.abort('internetdisconnected')
      return
    }
    if (
      route
        .request()
        .url()
        .includes('get-market-data')
    ) {
      return route.fulfill({ json: { valueAdjustments: { carrot: 1.25 } } })
    }
    if (
      route
        .request()
        .url()
        .includes('post-day-results')
    ) {
      return route.fulfill({ json: { valueAdjustments: {} } })
    }
    return route.continue()
  })

  const response = await page.goto(`${appUrl}?seed=${seed}`, {
    waitUntil: 'domcontentloaded',
  })
  await page.waitForSelector('.farmhand-root.has-booted')
  return response
}
