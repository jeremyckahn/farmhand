import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory'

describe('item selling', () => {
  test('item in inventory can be sold', async () => {
    const loadedState = saveDataStubFactory({
      inventory: [{ id: 'carrot-seed', quantity: 1 }],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    const menu = screen.getByRole('complementary')
    const carrotSeedMenuItem = within(menu)
      .getByText('Carrot Seed')
      .closest('.Item')
    const sellButton = within(carrotSeedMenuItem).getByText('Sell')
    userEvent.click(sellButton)

    expect(within(menu).queryByText('Carrot Seed')).not.toBeInTheDocument()
  })
})
