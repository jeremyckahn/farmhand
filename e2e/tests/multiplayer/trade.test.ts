import { test, expect } from '@playwright/test'
import { loadFixture } from '../../test-utils/load-fixture.js'
import { openPage } from '../../test-utils/open-page.js'
import { Monitor } from '../../test-utils/monitor.js'

test('players can trade cows', async ({ browser }) => {
  test.setTimeout(60_000)
  // Create two separate contexts to simulate two different browsers/players
  const context1 = await browser.newContext()
  const context2 = await browser.newContext()

  const page1 = await context1.newPage()
  const page2 = await context2.newPage()

  Monitor.logs(page1)
  Monitor.logs(page2)

  await openPage(page1)
  await openPage(page2)

  await loadFixture(page1, 'trade-player-1')
  await loadFixture(page2, 'trade-player-2')

  // Both go online
  await page1
    .getByRole('checkbox', { name: 'Play online' })
    .check({ force: true })
  await page2
    .getByRole('checkbox', { name: 'Play online' })
    .check({ force: true })

  // Wait for connections (they should connect to the global room)
  await expect(page1.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })
  await expect(page2.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })

  // Wait for the peer connection to establish (active players count should be 2)
  await expect(
    page1.getByRole('button', { name: 'Connected players: 2' })
  ).toBeVisible({
    timeout: 30_000,
  })
  await expect(
    page2.getByRole('button', { name: 'Connected players: 2' })
  ).toBeVisible({
    timeout: 30_000,
  })

  // Player 1 offers their cow
  await page1.getByText(': Home').click()
  await page1.getByRole('option', { name: ': Cows' }).click()
  await page1.getByRole('button', { name: 'Offer' }).click()

  // Player 2 also offers their cow (must offer a cow to be eligible to trade)
  await page2.getByText(': Home').click()
  await page2.getByRole('option', { name: ': Cows' }).click()
  await page2.getByRole('button', { name: 'Offer' }).click()

  // Wait for the throttled metadata to sync on both sides!
  // On Page 1, open the Active Players dialog and wait for Player 2's cow offer to appear
  await page1.getByRole('button', { name: /Connected players/i }).click()
  await expect(
    page1.getByRole('button', {
      name: 'The game will be saved when the trade is completed.',
      exact: true,
    })
  ).toBeVisible({ timeout: 10_000 })
  await page1.getByRole('button', { name: 'Close' }).click()

  // Player 2 initiates trade
  // The UI button says "Connected players: X", but to open it we click the button containing "Connected players"
  await page2.getByRole('button', { name: /Connected players/i }).click()

  // Wait for Player 1's cow offer to appear on Player 2's screen (in the dialog) and click Trade
  await expect(
    page2.getByRole('button', {
      name: 'The game will be saved when the trade is completed.',
      exact: true,
    })
  ).toBeVisible({ timeout: 10_000 })
  await page2
    .getByRole('button', {
      name: 'The game will be saved when the trade is completed.',
      exact: true,
    })
    .click()

  // Wait a moment for state to sync (the trade is accepted automatically by page1)
  await page1.waitForTimeout(2000)
  await page2.waitForTimeout(2000)

  // Verify the swap happened
  // Player 1 should now have MooMoo (Player 2's original cow)
  await expect(page1.getByText('MooMoo', { exact: true })).toBeVisible()

  // Player 2 should now have Bessie (Player 1's original cow)
  await expect(page2.getByText('Bessie', { exact: true })).toBeVisible()

  await context1.close()
  await context2.close()
})
