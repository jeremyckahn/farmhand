import { Page } from '@playwright/test'

const gameStartTime = '2025-01-01T09:00:00'

export const openPage = async (page: Page, seed = 0.5) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3002'

  // NOTE: A consistent date for the game is set so that time-based events
  // don't interfere with the tests
  await page.clock.install({ time: gameStartTime })

  return page.goto(`${appUrl}?seed=${seed}`)
}
