import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { getItemByName } from '../test-utils/ui'
import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory'

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
    const carrotInput = within(carrotItem).getByDisplayValue('1')
    userEvent.type(carrotInput, '10')
    const carrotSellButton = within(carrotItem).getByText('Sell')
    userEvent.click(carrotSellButton)
    const notification = await screen.findByRole('alert')

    within(notification).getByText('Carrot Soup')
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

    const cornInput = within(cornItem).getByDisplayValue('1')
    const spinachInput = within(spinachItem).getByDisplayValue('1')
    const carrotInput = within(carrotItem).getByDisplayValue('1')

    const cornSellButton = within(cornItem).getByText('Sell')
    const spinachSellButton = within(spinachItem).getByText('Sell')
    const carrotSellButton = within(carrotItem).getByText('Sell')

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
    within(notification).getByText('Carrot Soup')
    within(notification).getByText('Summer Salad')
  })
})
