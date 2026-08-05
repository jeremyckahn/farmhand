import { screen, waitFor, fireEvent } from '@testing-library/react'

import { BREAKPOINTS } from '../../constants.js'
import { farmhandStub } from '../../test-utils/stubs/farmhandStub.js'

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

const getIsMenuOpen = () =>
  ((window as unknown) as { farmhand: { state: farmhand.state } }).farmhand
    .state.isMenuOpen

// Simulates a sidebar input having focus, e.g. mid-typing, without depending
// on any particular Farmhand-rendered input existing in the current view.
const focusAnInput = () => {
  const input = document.createElement('input')

  document.body.appendChild(input)
  input.focus()
  return input
}

describe('sidebar resize handling', () => {
  test('a height-only resize while a field is focused (e.g. a mobile on-screen keyboard) does not touch the sidebar', async () => {
    setWindowWidth(BREAKPOINTS.MD + 100)

    await farmhandStub()

    await waitFor(() => {
      expect(screen.getByText('Day 1', { exact: false })).toBeInTheDocument()
    })

    focusAnInput()
    expect(getIsMenuOpen()).toBe(true)

    // Width is unchanged, simulating a resize caused only by the on-screen
    // keyboard opening/closing.
    fireEvent(window, new Event('resize'))

    expect(getIsMenuOpen()).toBe(true)
  })

  test('a resize that crosses the width breakpoint still updates the sidebar, even while a field is focused', async () => {
    setWindowWidth(BREAKPOINTS.MD + 100)

    await farmhandStub()

    await waitFor(() => {
      expect(screen.getByText('Day 1', { exact: false })).toBeInTheDocument()
    })

    focusAnInput()
    expect(getIsMenuOpen()).toBe(true)

    setWindowWidth(BREAKPOINTS.MD - 100)
    fireEvent(window, new Event('resize'))

    await waitFor(() => {
      expect(getIsMenuOpen()).toBe(false)
    })
  })
})
