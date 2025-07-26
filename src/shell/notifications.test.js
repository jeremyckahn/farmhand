import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { getItemByName } from '../test-utils/ui.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'

describe('notifications', () => {
  test('notification is shown when recipe is learned', async () => {
    const loadedState = saveDataStubFactory({
      inventory: [{ id: 'carrot', quantity: 10 }],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const carrotItem = await getItemByName('Carrot')
    const carrotInput = within(
      /** @type {HTMLElement} */ (carrotItem)
    ).getByDisplayValue('1')
    userEvent.type(carrotInput, '10')
    const carrotSellButton = within(
      /** @type {HTMLElement} */ (carrotItem)
    ).getByText('Sell')
    userEvent.click(carrotSellButton)
    const notification = await screen.findByRole('alert')

    expect(
      within(/** @type {HTMLElement} */ (notification)).getByText('Carrot Soup')
    ).toBeInTheDocument()
  })

  test('multiple notifications are shown when multiple recipes are learned', async () => {
    const loadedState = saveDataStubFactory({
      inventory: [
        { id: 'carrot', quantity: 10 },
        { id: 'corn', quantity: 6 },
        { id: 'spinach', quantity: 30 },
      ],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const cornItem = await getItemByName('Corn')
    const spinachItem = await getItemByName('Spinach')
    const carrotItem = await getItemByName('Carrot')

    const cornInput = within(
      /** @type {HTMLElement} */ (cornItem)
    ).getByDisplayValue('1')
    const spinachInput = within(
      /** @type {HTMLElement} */ (spinachItem)
    ).getByDisplayValue('1')
    const carrotInput = within(
      /** @type {HTMLElement} */ (carrotItem)
    ).getByDisplayValue('1')

    const cornSellButton = within(
      /** @type {HTMLElement} */ (cornItem)
    ).getByText('Sell')
    const spinachSellButton = within(
      /** @type {HTMLElement} */ (spinachItem)
    ).getByText('Sell')
    const carrotSellButton = within(
      /** @type {HTMLElement} */ (carrotItem)
    ).getByText('Sell')

    userEvent.type(cornInput, '6')
    userEvent.click(cornSellButton)

    userEvent.type(spinachInput, '30')
    userEvent.click(spinachSellButton)

    // Both Carrot Soup and Summer Salad have Carrot as an ingredient (as well
    // as various other constituent ingredients for Summer Salad). By selling
    // 10 Carrots here, both recipes are unlocked at the same time.
    userEvent.type(carrotInput, '10')
    userEvent.click(carrotSellButton)

    const notification = await screen.findByRole('alert')
    expect(
      within(/** @type {HTMLElement} */ (notification)).getByText('Carrot Soup')
    ).toBeInTheDocument()
    expect(
      within(/** @type {HTMLElement} */ (notification)).getByText(
        'Summer Salad'
      )
    ).toBeInTheDocument()
  })
})
