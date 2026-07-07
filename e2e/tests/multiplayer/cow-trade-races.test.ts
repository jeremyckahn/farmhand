import { test, expect } from '@playwright/test'

import { loadFixture } from '../../test-utils/load-fixture.js'
import { openPage } from '../../test-utils/open-page.js'
import { Monitor } from '../../test-utils/monitor.js'

const TRADE_BUTTON_NAME = 'The game will be saved when the trade is completed.'

test("trading uses the requester's latest offered cow, not a stale one", async ({
  browser,
}) => {
  test.setTimeout(60_000)

  // Player 1 (the requester in this test) has two cows so their own offer
  // can be switched right before initiating a trade. This is a regression
  // check for a fixed bug where tradeForPeerCow read a stale closed-over
  // `state` instead of the latest instanceProxy state, which could send a
  // peer a trade offer for a cow that was no longer the one actually
  // offered.
  const context1 = await browser.newContext()
  const context2 = await browser.newContext()

  const page1 = await context1.newPage()
  const page2 = await context2.newPage()

  Monitor.logs(page1)
  Monitor.logs(page2)

  await openPage(page1)
  await openPage(page2)

  // Player 1 uses a dedicated two-cow fixture here (rather than the shared
  // trade-player-1 fixture used by other multiplayer tests) so switching
  // their own offered cow doesn't change the single-"Offer"-button
  // assumption those other tests rely on.
  await loadFixture(page1, 'trade-player-1-two-cows')
  await loadFixture(page2, 'trade-player-2')

  await page1
    .getByRole('checkbox', { name: 'Play online' })
    .check({ force: true })
  await page2
    .getByRole('checkbox', { name: 'Play online' })
    .check({ force: true })

  await expect(page1.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })
  await expect(page2.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })

  await expect(
    page1.getByRole('button', { name: 'Connected players: 2' })
  ).toBeVisible({ timeout: 30_000 })
  await expect(
    page2.getByRole('button', { name: 'Connected players: 2' })
  ).toBeVisible({ timeout: 30_000 })

  // Player 2 offers their only cow (MooMoo).
  await page2.getByText(': Home').click()
  await page2.getByRole('option', { name: ': Cows' }).click()
  await page2.getByRole('button', { name: 'Offer' }).click()

  // Player 1 offers Bessie first... (cow names render as editable <input>
  // values, not text nodes, so scope by the input's value rather than
  // hasText, which only matches rendered text content)
  await page1.getByText(': Home').click()
  await page1.getByRole('option', { name: ': Cows' }).click()
  await page1
    .locator('.CowCard')
    .filter({ has: page1.locator('input[value="Bessie"]') })
    .getByRole('button', { name: 'Offer' })
    .click()

  // Wait for Player 1 to see Player 2's (throttled) offer before trading.
  await page1.getByRole('button', { name: /Connected players/i }).click()
  await expect(
    page1.getByRole('button', { name: TRADE_BUTTON_NAME, exact: true })
  ).toBeVisible({ timeout: 20_000 })
  await page1.getByRole('button', { name: 'Close' }).click()

  // ...then switches to offering Daisy immediately before initiating the
  // trade. This is Player 1's own local state - it doesn't depend on the
  // peer-metadata throttle, since it's read directly at click-time.
  await page1
    .locator('.CowCard')
    .filter({ has: page1.locator('input[value="Daisy"]') })
    .getByRole('button', { name: 'Offer' })
    .click()

  await page1.getByRole('button', { name: /Connected players/i }).click()
  await expect(
    page1.getByRole('button', { name: TRADE_BUTTON_NAME, exact: true })
  ).toBeVisible({ timeout: 20_000 })
  await page1
    .getByRole('button', { name: TRADE_BUTTON_NAME, exact: true })
    .click()

  await page1.waitForTimeout(2000)
  await page2.waitForTimeout(2000)

  // Player 1 should have received MooMoo in exchange.
  await expect(page1.getByText('MooMoo', { exact: true })).toBeVisible()

  // Player 2 should have received Daisy (the cow actually offered at the
  // moment of the trade), not Bessie (the stale, previously-offered cow).
  await expect(page2.getByText('Daisy', { exact: true })).toBeVisible()
  await expect(page2.getByText('Bessie', { exact: true })).not.toBeVisible()

  await context1.close()
  await context2.close()
})

test('a trade request for a cow that is no longer offered is rejected and unblocks the requester', async ({
  browser,
}) => {
  test.setTimeout(45_000)

  // Forcing the *client-side 10s COW_TRADE_TIMEOUT* specifically would mean
  // racing a peer disconnect against in-flight WebRTC delivery, which is
  // inherently flaky under load (the request can be processed before the
  // teardown completes). withdrawCow's auto-reject path
  // (handleCowTradeRequestReject in peer-events.ts) clears the exact same
  // state (cowTradeTimeoutId, isAwaitingCowTradeRequest) and shows the same
  // REQUESTED_COW_TRADE_UNAVAILABLE notification as the timeout path, so
  // this reliably exercises the same requester-side unblocking behavior
  // without the timing race.
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

  await page1
    .getByRole('checkbox', { name: 'Play online' })
    .check({ force: true })
  await page2
    .getByRole('checkbox', { name: 'Play online' })
    .check({ force: true })

  await expect(page1.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })
  await expect(page2.getByText('Connected to room global!')).toBeInViewport({
    timeout: 30_000,
  })

  await expect(
    page1.getByRole('button', { name: 'Connected players: 2' })
  ).toBeVisible({ timeout: 30_000 })

  // Player 1 offers a cow (the trade target); Player 2 will be the
  // requester whose request ends up unavailable.
  await page1.getByText(': Home').click()
  await page1.getByRole('option', { name: ': Cows' }).click()
  const bessieCard = page1
    .locator('.CowCard')
    .filter({ has: page1.locator('input[value="Bessie"]') })
  await bessieCard.getByRole('button', { name: 'Offer' }).click()

  await page2.getByText(': Home').click()
  await page2.getByRole('option', { name: ': Cows' }).click()
  await page2.getByRole('button', { name: 'Offer' }).click()

  await page2.getByRole('button', { name: /Connected players/i }).click()
  const tradeButton = page2.getByRole('button', {
    name: TRADE_BUTTON_NAME,
    exact: true,
  })
  await expect(tradeButton).toBeVisible({ timeout: 20_000 })

  // Player 1 withdraws Bessie's offer, so by the time the request arrives,
  // it no longer matches player 1's cowIdOfferedForTrade. Scoped by CSS
  // class rather than accessible name/text: MUI's Tooltip injects an
  // aria-label ("Keep Bessie from being traded") onto this button because
  // its tooltip title is a plain string (unlike the Offer button's, which
  // is a Typography node and isn't auto-labeled), so name: 'Withdraw' never
  // matches.
  await bessieCard.locator('button.offer').click()

  // Player 2 requests the now-withdrawn cow anyway (their cached button
  // still references it, since peer-metadata sync is throttled). The
  // reject round-trip over WebRTC on localhost is too fast to reliably
  // observe the transient block-input state mid-poll, so this only asserts
  // the app ends up unblocked with an error notification, not stuck.
  await tradeButton.click()

  await expect(
    page2.getByText('The requested cow is no longer available.')
  ).toBeVisible({ timeout: 15_000 })
  await expect(page2.locator('.farmhand-root')).not.toHaveClass(/block-input/)

  await context1.close()
  await context2.close()
})
