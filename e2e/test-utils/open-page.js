/**
 * @param {import('@playwright/test').Page} page
 * @param {number=} seed
 * @returns {Promise<import('@playwright/test').Response | null>}
 */
export const openPage = (page, seed = 0.5) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000'

  return page.goto(`${appUrl}?seed=${seed}`)
}
