import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { nextView } from '../test-utils/ui.js'

describe('item purchasing', () => {
  test('item can be purchased and added to the inventory', async () => {
    await farmhandStub()
    await nextView()

    const main = screen.getByRole('main')
    const carrotSeedShopItem = within(main)
      .getByText('Carrot Seed')
      .closest('.Item')
    // @ts-expect-error
    const buyButton = within(carrotSeedShopItem).getByText('Buy')
    userEvent.click(buyButton)

    const menu = screen.getByRole('complementary')
    expect(within(menu).getByText('Carrot Seed')).toBeInTheDocument()
  })
})
