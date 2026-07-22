import { Page } from '@playwright/test'

const gameStartTime = '2025-01-01T09:00:00'

export const openPage = async (page: Page, seed = 0.5) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3002'

  // NOTE: A consistent date for the game is set so that time-based events
  // don't interfere with the tests
  await page.clock.install({ time: gameStartTime })

  // NOTE: This is also configured via the `reducedMotion` context option in
  // playwright.config.js, but is set explicitly here as well so that it is
  // guaranteed to be applied to this page before it navigates, regardless of
  // how the page/context was constructed. AnimatedNumber relies on this to
  // short-circuit its tweening animation, which is necessary to avoid a race
  // condition with the fake clock installed above.
  await page.emulateMedia({ reducedMotion: 'reduce' })

  return page.goto(`${appUrl}?seed=${seed}`)
}
