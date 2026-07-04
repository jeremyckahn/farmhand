import { test, expect } from '@playwright/test'
import { loadFixture } from '../../test-utils/load-fixture.js'
import { openPage } from '../../test-utils/open-page.js'

test('players can trade cows', async ({ browser }) => {
  // Create two separate contexts to simulate two different browsers/players
  const context1 = await browser.newContext()
  const context2 = await browser.newContext()

  const page1 = await context1.newPage()
  const page2 = await context2.newPage()

  await openPage(page1)
  await openPage(page2)

  await loadFixture(page1, 'trade-player-1')
  await loadFixture(page2, 'trade-player-2')

  // Both go online
  await page1.getByRole('checkbox', { name: 'Play online' }).check({ force: true })
  await page2.getByRole('checkbox', { name: 'Play online' }).check({ force: true })

  // Wait for connections (they should connect to the global room)
  await expect(page1.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })
  await expect(page2.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })

  // Player 1 offers their cow
  await page1.getByText(': Home').click()
  await page1.getByRole('option', { name: ': Cows' }).click()
  await page1.getByRole('button', { name: 'Offer' }).click()

  // Player 2 initiates trade
  // The UI button says "Connected players: X", but to open it we click the button containing "Connected players"
  await page2.getByRole('button', { name: /Connected players/i }).click()

  // Wait for Player 1's cow offer to appear on Player 2's screen (in the dialog)
  await expect(page2.getByRole('button', { name: 'Trade' })).toBeVisible()
  await page2.getByRole('button', { name: 'Trade' }).click()

  // Player 1 receives trade request and accepts
  // Accept might be in a prompt or standard dialog, usually "Trade request from X", verify standard Accept button
  await expect(page1.getByRole('button', { name: 'Accept' })).toBeVisible()
  await page1.getByRole('button', { name: 'Accept' }).click()

  // Wait a moment for state to sync and dialog to close
  await page1.waitForTimeout(500)
  await page2.waitForTimeout(500)

  // Verify the swap happened
  // Player 1 should now have MooMoo (Player 2's original cow)
  await expect(page1.getByText('MooMoo')).toBeVisible()

  // Player 2 goes to their cow pen
  // The trade was made from the Active Players dialog, they can go check their pen to see Bessie
  // Close dialog first if needed, though clicking options may still work or dialog may auto-close
  await page2.getByRole('button', { name: 'Close' }).click()
  await page2.getByText(': Home').click()
  await page2.getByRole('option', { name: ': Cows' }).click()
  // Player 2 should now have Bessie (Player 1's original cow)
  await expect(page2.getByText('Bessie')).toBeVisible()

  await context1.close()
  await context2.close()
})
