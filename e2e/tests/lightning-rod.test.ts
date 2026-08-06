import { test, expect } from '@playwright/test'

import { loadFixture } from '../test-utils/load-fixture.js'

test('should craft each Lightning Rod tier in the Workshop', async ({
  page,
}) => {
  await loadFixture(page, 'lightning-rod-craftable')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Workshop' }).click()
  await page.getByRole('tab', { name: 'Forge' }).click()

  for (const name of [
    'Basic Lightning Rod',
    'Superior Lightning Rod',
    'Ultimate Lightning Rod',
  ]) {
    // Scope to the card's own title, since ingredient lists in other cards
    // (e.g. Superior/Ultimate both list "Iron Ingot") also contain this
    // text.
    const card = page.locator('.Recipe').filter({
      has: page.locator('.MuiCardHeader-title', {
        hasText: new RegExp(`^${name}$`),
      }),
    })

    await card.getByRole('button', { name: 'Make' }).click()

    await expect(
      page.locator('.ContextPane').getByText(name, { exact: true })
    ).toBeVisible()
  }
})

test('should place a Lightning Rod in an empty field plot', async ({
  page,
}) => {
  await loadFixture(page, 'lightning-rod-craftable')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Workshop' }).click()
  await page.getByRole('tab', { name: 'Forge' }).click()

  const basicLightningRodCard = page.locator('.Recipe').filter({
    has: page.locator('.MuiCardHeader-title', {
      hasText: /^Basic Lightning Rod$/,
    }),
  })
  await basicLightningRodCard.getByRole('button', { name: 'Make' }).click()

  await page.getByText(': Workshop').click()
  await page.getByRole('option', { name: ': Field' }).click()

  const targetPlot = page.locator('.Plot').first()
  await expect(targetPlot).toHaveClass(/is-empty/)

  await page.getByRole('button', { name: /Basic Lightning Rod/ }).click()
  await targetPlot.click()

  await expect(targetPlot).not.toHaveClass(/is-empty/)

  // The rod was the player's only one, so it's gone from inventory and the
  // toolbelt no longer offers it.
  await expect(
    page.getByRole('button', { name: /Basic Lightning Rod/ })
  ).not.toBeVisible()
})

test('should not allow a placed Lightning Rod to be removed with the Hoe', async ({
  page,
}) => {
  await loadFixture(page, 'lightning-rod-craftable')

  await page.getByText(': Home').click()
  await page.getByRole('option', { name: ': Workshop' }).click()
  await page.getByRole('tab', { name: 'Forge' }).click()

  const basicLightningRodCard = page.locator('.Recipe').filter({
    has: page.locator('.MuiCardHeader-title', {
      hasText: /^Basic Lightning Rod$/,
    }),
  })
  await basicLightningRodCard.getByRole('button', { name: 'Make' }).click()

  await page.getByText(': Workshop').click()
  await page.getByRole('option', { name: ': Field' }).click()

  const targetPlot = page.locator('.Plot').first()
  await page.getByRole('button', { name: /Basic Lightning Rod/ }).click()
  await targetPlot.click()
  await expect(targetPlot).not.toHaveClass(/is-empty/)

  await page.getByRole('button', { name: /Select the hoe/ }).click()
  await targetPlot.click()

  // The Hoe cannot clear a Lightning Rod plot - it's a non-removable
  // fixture until it's destroyed by a lightning strike.
  await expect(targetPlot).not.toHaveClass(/is-empty/)
})
