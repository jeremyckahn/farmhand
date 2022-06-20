import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { endDay } from '../test-utils/ui'
import { STORM_MESSAGE } from '../strings'
import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { saveFileStubFactory } from '../test-utils/stubs/saveFileStubFactory'

describe('notifications', () => {
  test('pending notifications are shown when a day starts', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)

    await farmhandStub()
    await endDay()

    // STORM_MESSAGE message is a sample pending day notification that is known
    // to show upon starting a new day when Math.random() is locked to 0.
    await screen.findByText(STORM_MESSAGE)
  })

  test('notification is shown when recipe is learned', async () => {
    const loadedState = saveFileStubFactory({
      inventory: [{ id: 'carrot', quantity: 10 }],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const carrotHeader = await screen.findByText('Carrot')
    const carrotItem = carrotHeader.closest('.Item')
    const input = within(carrotItem).getByDisplayValue('1')
    userEvent.type(input, '10')
    const sellButton = within(carrotItem).getByText('Sell')
    userEvent.click(sellButton)
    await screen.findByText('You learned a new recipe', { exact: false })
  })
})
