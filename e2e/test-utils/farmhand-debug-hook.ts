import { Page } from '@playwright/test'

// window.farmhand is a real, supported debug hook (documented in
// README.md's "Debugging" section) but its ambient type declaration lives
// in src/react-app-env.d.ts, which isn't part of this project's
// TypeScript scope - so it's redeclared here, once, with the shape the
// e2e tests actually rely on.
declare global {
  interface Window {
    farmhand?: {
      setState: (partialState: Record<string, unknown>) => void
      queueRandomNumbers: (stream: string, numbers: number[]) => void
    }
  }
}

export const setFarmhandState = (
  page: Page,
  partialState: Record<string, unknown>
) => page.evaluate(state => window.farmhand?.setState(state), partialState)

/**
 * Forces the next values drawn from a named random number stream (see
 * RandomNumberService in src/common/services/randomNumber.ts), so a test
 * can make a random outcome happen without relying on a particular seed.
 */
export const queueRandomNumbers = async (
  page: Page,
  stream: string,
  numbers: number[]
) => {
  await page.waitForFunction(() => window.farmhand !== undefined)
  await page.evaluate(
    ([stream, numbers]) => window.farmhand?.queueRandomNumbers(stream, numbers),
    [stream, numbers] as const
  )
}
