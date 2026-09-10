import { screen, waitFor } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { getItemByName } from '../test-utils/ui.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'

// Other notifications (e.g. an achievement) can legitimately be showing
// alongside the one under test, each in its own alert - this finds the
// specific one containing the given text rather than assuming there's
// only one alert on screen. Wrapped in waitFor (rather than a single
// findAllByRole check) because findAllByRole resolves as soon as *any*
// alert exists, which can be before the specific one being looked for has
// mounted - this keeps retrying until a match actually shows up.
const findAlertContainingText = async (text: string) => {
  return waitFor(() => {
    const alerts = screen.getAllByRole('alert')
    const match = alerts.find(alert => within(alert).queryByText(text))

    if (!match) {
      throw new Error(`No alert found containing text: ${text}`)
    }

    return match
  })
}

describe('notifications', () => {
  test('notification is shown when recipe is learned', async () => {
    const loadedState = saveDataStubFactory({
      inventory: [{ id: 'carrot', quantity: 10 }],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    const carrotItem = await getItemByName('Carrot')
    const carrotInput = within(carrotItem as HTMLElement).getByDisplayValue('1')

    await userEvent.type(carrotInput, '10')
    const carrotSellButton = within(carrotItem as HTMLElement).getByText('Sell')

    await userEvent.click(carrotSellButton)
    const notification = await findAlertContainingText('Carrot Soup')

    expect(within(notification).getByText('Carrot Soup')).toBeInTheDocument()
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
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    const cornItem = await getItemByName('Corn')
    const spinachItem = await getItemByName('Spinach')
    const carrotItem = await getItemByName('Carrot')

    const cornInput = within(cornItem as HTMLElement).getByDisplayValue('1')
    const spinachInput = within(spinachItem as HTMLElement).getByDisplayValue(
      '1'
    )
    const carrotInput = within(carrotItem as HTMLElement).getByDisplayValue('1')

    const cornSellButton = within(cornItem as HTMLElement).getByText('Sell')
    const spinachSellButton = within(spinachItem as HTMLElement).getByText(
      'Sell'
    )
    const carrotSellButton = within(carrotItem as HTMLElement).getByText('Sell')

    await userEvent.type(cornInput, '6')
    await userEvent.click(cornSellButton)

    await userEvent.type(spinachInput, '30')
    await userEvent.click(spinachSellButton)

    // Both Carrot Soup and Summer Salad have Carrot as an ingredient (as well
    // as various other constituent ingredients for Summer Salad). By selling
    // 10 Carrots here, both recipes are unlocked at the same time.
    await userEvent.type(carrotInput, '10')
    await userEvent.click(carrotSellButton)

    const notification = await findAlertContainingText('Carrot Soup')

    expect(within(notification).getByText('Carrot Soup')).toBeInTheDocument()
    expect(within(notification).getByText('Summer Salad')).toBeInTheDocument()
  })
})
