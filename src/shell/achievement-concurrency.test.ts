import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { nextView } from '../test-utils/ui.js'

// Regression coverage for a bug introduced (and fixed) mid-refactor: the
// achievements effect in useFarmhand.ts used to update state with a
// non-functional setState computed from a stale render snapshot. When that
// update landed in the same batch as another effect-driven update (e.g. the
// todaysLosses tracking that runs in the same effect right after a money
// decrease), the non-functional update could clobber it. Buying an upgrade
// that both completes an achievement and spends money exercises both effect
// branches in a single state transition.
describe('achievement concurrency', () => {
  // NOTE: This test drives more sequential UI interactions (tab switch,
  // purchase, achievement wait, drawer, stats navigation) than most other
  // tests in this file, which has made it prone to exceeding the default
  // 5000ms timeout under CI load even though it consistently finishes in
  // well under 1s locally.
  test('completing an achievement does not clobber a same-transition money update', async () => {
    const loadedState = saveDataStubFactory({
      money: 100_000,
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key: string, data: unknown) => Promise.resolve(data),
      },
    })

    // NOTE: Navigates to Shop
    await nextView()

    await userEvent.click(await screen.findByRole('tab', { name: 'Upgrades' }))

    const cowPenRow = (await screen.findByText('Buy cow pen')).closest('li')

    if (!cowPenRow) {
      throw new Error('Could not find the cow pen purchase row')
    }

    const buyButton = within(cowPenRow as HTMLElement).getByRole('button', {
      name: 'Buy',
    })

    await userEvent.click(buyButton)

    // The achievement notification fired...
    await screen.findByText('Purchase a Cow Pen', { exact: false })

    // ...and the purchase's own $1,500 money deduction (tracked via the
    // todaysLosses branch of the same effect) was not lost. This is a fresh,
    // just-booted game with no other purchases/losses today, so the full
    // deduction should be attributed to today's losses.
    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'View your stats (s)' })
    )

    const statsContent = document.querySelector('#stats-modal-content')

    expect(statsContent).toHaveTextContent('-$1,500.00')
  }, 15_000)
})
