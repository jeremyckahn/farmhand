import { act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { farmhandStub } from '../../test-utils/stubs/farmhandStub'
import { generateCow, getCowDisplayName } from '../../utils'
import { stageFocusType } from '../../enums'

describe('cow selection', () => {
  const cowId1 = 'foo'
  const cowId2 = 'bar'
  const cowStub1 = generateCow({ id: cowId1 })
  const cowStub2 = generateCow({ id: cowId2 })
  let cow1 = null
  let cow2 = null

  const getCowStub1 = async () => {
    return (
      await screen.findByAltText(getCowDisplayName(cowStub1, cowId1, false))
    ).closest('.cow')
  }

  const getCowStub2 = async () => {
    return (
      await screen.findByAltText(getCowDisplayName(cowStub2, cowId2, false))
    ).closest('.cow')
  }

  beforeEach(async () => {
    jest.useFakeTimers()

    cow1 = null
    cow2 = null

    await farmhandStub({
      cowInventory: [cowStub1, cowStub2],
      stageFocus: stageFocusType.COW_PEN,
      purchasedCowPen: 1,

      // Usually this gets initialized during the boot process, but it needs to
      // be stubbed to prevent a spurious crash
      cowForSale: generateCow(),
      hasBooted: true,
    })

    cow1 = await getCowStub1()
    cow2 = await getCowStub2()
  })

  afterEach(() => {
    // Allow all cow movement timers to expire
    act(() => {
      jest.advanceTimersByTime(2000)
    })
  })

  test('no cows are selected by default', () => {
    expect(cow1.classList).not.toContain('is-selected')
    expect(cow2.classList).not.toContain('is-selected')
  })

  test('a cow can be selected', () => {
    userEvent.click(cow1)

    act(() => {
      // Prevent async update warning from Popper.js (used by Material UI
      // tooltips). See "Case 2" here:
      // https://davidwcai.medium.com/react-testing-library-and-the-not-wrapped-in-act-errors-491a5629193b
      jest.advanceTimersByTime(500)
    })

    expect(cow1.classList).toContain('is-selected')
    expect(cow2.classList).not.toContain('is-selected')
  })

  test('selecting another cow deselects the first one', () => {
    userEvent.click(cow1)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    userEvent.click(cow2)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(cow1.classList).not.toContain('is-selected')
    expect(cow2.classList).toContain('is-selected')
  })

  test('changing views deselects all cows', async () => {
    userEvent.click(cow1)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    const previousViewButton = await screen.findByLabelText('Previous view')
    const nextViewButton = await screen.findByLabelText('Next view')

    userEvent.click(previousViewButton)

    act(() => {
      jest.advanceTimersByTime(500)
    })

    userEvent.click(nextViewButton)

    // The old stubs unmounted when the view changed, so they need to be
    // re-queried from the page
    cow1 = await getCowStub1()
    cow2 = await getCowStub2()

    expect(cow1.classList).not.toContain('is-selected')
    expect(cow2.classList).not.toContain('is-selected')
  })
})
