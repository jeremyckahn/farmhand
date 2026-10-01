import { fireEvent, waitFor } from '@testing-library/react'

import { BREAKPOINTS } from '../../constants.js'
import { farmhandStub } from '../../test-utils/stubs/farmhandStub.js'
import { waitForBoot } from '../../test-utils/ui.js'

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

const setWindowHeight = (height: number) => {
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
}

const getIsMenuOpen = () =>
  ((window as unknown) as { farmhand: { state: farmhand.state } }).farmhand
    .state.isMenuOpen

const setIsMenuOpen = (isMenuOpen: boolean) =>
  ((window as unknown) as {
    farmhand: { setState: (state: Partial<farmhand.state>) => void }
  }).farmhand.setState({ isMenuOpen })

// Simulates a sidebar input having focus, e.g. mid-typing, without depending
// on any particular Farmhand-rendered input existing in the current view.
// Note: the resize guard under test is purely width-based and never checks
// focus - this just documents the real-world trigger (a focused input is
// what causes a mobile on-screen keyboard to open/close and fire a
// height-only resize).
const focusAnInput = () => {
  const input = document.createElement('input')

  document.body.appendChild(input)
  input.focus()
  return input
}

describe('sidebar resize handling', () => {
  test('a height-only resize while a field is focused (e.g. a mobile on-screen keyboard) does not touch the sidebar', async () => {
    // A width below the breakpoint means the sidebar would naturally be
    // closed. It's forced open below to simulate a player having manually
    // opened it - that's what makes this test able to detect a regression:
    // without the width-change guard, the resize handler recomputes
    // isMenuOpen from the viewport and would clobber this manually-opened
    // state even though the width hasn't changed.
    setWindowWidth(BREAKPOINTS.MD - 100)
    setWindowHeight(800)

    await farmhandStub()
    await waitForBoot()

    setIsMenuOpen(true)
    focusAnInput()
    expect(getIsMenuOpen()).toBe(true)

    // Height shrinks, as when a mobile on-screen keyboard opens, while
    // width stays the same.
    setWindowHeight(500)
    fireEvent(window, new Event('resize'))

    expect(getIsMenuOpen()).toBe(true)
  })

  test('a resize that crosses the width breakpoint still updates the sidebar, even while a field is focused', async () => {
    setWindowWidth(BREAKPOINTS.MD + 100)

    await farmhandStub()
    await waitForBoot()

    focusAnInput()
    expect(getIsMenuOpen()).toBe(true)

    setWindowWidth(BREAKPOINTS.MD - 100)
    fireEvent(window, new Event('resize'))

    await waitFor(() => {
      expect(getIsMenuOpen()).toBe(false)
    })
  })
})
