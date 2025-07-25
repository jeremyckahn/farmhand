import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'
import { nextView } from '../test-utils/ui.js'

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
    await userEvent.click(upgradesTab)

    const expandFieldContainer = screen
      .getByText('Expand field')
      .closest('.TierPurchase')

    // Open the list of field options
    await userEvent.click(
      within(/** @type {HTMLElement} */ (expandFieldContainer)).getByRole(
        'combobox'
      )
    )

    await userEvent.click(
      screen.getByRole('option', { name: '$1,000: 8 x 12' })
    )

    // Make the purchase
    await userEvent.click(
      within(/** @type {HTMLElement} */ (expandFieldContainer)).getByRole(
        'button'
      )
    )

    await nextView()

    const emptyPlots = screen.getAllByAltText('Empty plot')
    expect(emptyPlots).toHaveLength(96)
  })
})
