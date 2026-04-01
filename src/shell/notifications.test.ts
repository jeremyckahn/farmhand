import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { getItemByName } from '../test-utils/ui.ts'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.tsx'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.ts'

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
      // @ts-expect-error
      /** @type {HTMLElement} */ carrotItem
    ).getByDisplayValue('1')
    await userEvent.type(carrotInput, '10')
    const carrotSellButton = within(
      // @ts-expect-error
      /** @type {HTMLElement} */ carrotItem
    ).getByText('Sell')
    await userEvent.click(carrotSellButton)
    const notification = await screen.findByRole('alert')

    expect(
      within(/** @type {HTMLElement} */ notification).getByText('Carrot Soup')
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
      // @ts-expect-error
      /** @type {HTMLElement} */ cornItem
    ).getByDisplayValue('1')
    const spinachInput = within(
      // @ts-expect-error
      /** @type {HTMLElement} */ spinachItem
    ).getByDisplayValue('1')
    const carrotInput = within(
      // @ts-expect-error
      /** @type {HTMLElement} */ carrotItem
    ).getByDisplayValue('1')

    const cornSellButton = within(
      // @ts-expect-error
      /** @type {HTMLElement} */ cornItem
    ).getByText('Sell')
    const spinachSellButton = within(
      // @ts-expect-error
      /** @type {HTMLElement} */ spinachItem
    ).getByText('Sell')
    const carrotSellButton = within(
      // @ts-expect-error
      /** @type {HTMLElement} */ carrotItem
    ).getByText('Sell')

    await userEvent.type(cornInput, '6')
    await userEvent.click(cornSellButton)

    await userEvent.type(spinachInput, '30')
    await userEvent.click(spinachSellButton)

    // Both Carrot Soup and Summer Salad have Carrot as an ingredient (as well
    // as various other constituent ingredients for Summer Salad). By selling
    // 10 Carrots here, both recipes are unlocked at the same time.
    await userEvent.type(carrotInput, '10')
    await userEvent.click(carrotSellButton)

    const notification = await screen.findByRole('alert')
    expect(
      within(/** @type {HTMLElement} */ notification).getByText('Carrot Soup')
    ).toBeInTheDocument()
    expect(
      within(/** @type {HTMLElement} */ notification).getByText('Summer Salad')
    ).toBeInTheDocument()
  })
})
