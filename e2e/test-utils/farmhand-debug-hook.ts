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
    }
  }
}

export const setFarmhandState = (
  page: Page,
  partialState: Record<string, unknown>
) => page.evaluate(state => window.farmhand?.setState(state), partialState)
