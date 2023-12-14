import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { farmhandStub } from '../test-utils/stubs/farmhandStub'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory'
import { nextView } from '../test-utils/ui'

describe('field expansion purchasing', () => {
  test('field expansion can be purchased', async () => {
    const loadedState = saveDataStubFactory({
      money: 1000,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    await nextView()

    const upgradesTab = screen.getByText('Upgrades')
    userEvent.click(upgradesTab)

    const expandFieldContainer = screen
      .getByText('Expand field')
      .closest('.TierPurchase')

    // Open the list of field options
    userEvent.click(within(expandFieldContainer).getByRole('combobox'))

    userEvent.click(screen.getByRole('option', { name: '$1,000: 8 x 12' }))

    // Make the purchase
    userEvent.click(within(expandFieldContainer).getByRole('button'))

    await nextView()

    const emptyPlots = screen.getAllByAltText('Empty plot')
    expect(emptyPlots).toHaveLength(96)
  })
})
