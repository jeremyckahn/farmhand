import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { stageFocusType } from '../../enums.js'

import { BottomControls } from './BottomControls.js'

describe('<BottomControls />', () => {
  const { COW_PEN, FIELD, FOREST, SHOP, WORKSHOP } = stageFocusType

  const noop = () => {}

  const renderBottomControls = (
    props: Partial<Parameters<typeof BottomControls>[0]> = {}
  ) =>
    render(
      <BottomControls
        {...{
          focusNextView: noop,
          focusPreviousView: noop,
          handleMenuToggle: noop,
          handleViewChangeButtonClick: noop,
          isMenuOpen: false,
          stageFocus: SHOP,
          viewList: [SHOP, FIELD, WORKSHOP],
          ...props,
        }}
      />
    )

  test('renders a view button for each entry in viewList, in order', () => {
    renderBottomControls({ viewList: [SHOP, FIELD, WORKSHOP] })

    const viewButtons = screen
      .getAllByRole('button')
      .filter(button => button.getAttribute('aria-label')?.startsWith('Go to'))

    expect(
      viewButtons.map(button => button.getAttribute('aria-label'))
    ).toEqual(['Go to Shop', 'Go to Field', 'Go to Workshop'])
  })

  test('does not render a button for a view missing from viewList', () => {
    renderBottomControls({ viewList: [SHOP, FIELD] })

    expect(
      screen.queryByRole('button', { name: 'Go to Forest' })
    ).not.toBeInTheDocument()
  })

  test('clicking a view button calls handleViewChangeButtonClick with that view', async () => {
    const handleViewChangeButtonClick = vitest.fn()

    renderBottomControls({
      handleViewChangeButtonClick,
      viewList: [SHOP, FIELD, WORKSHOP],
    })

    await userEvent.click(
      screen.getByRole('button', { name: 'Go to Workshop' })
    )

    expect(handleViewChangeButtonClick).toHaveBeenCalledWith(WORKSHOP)
  })

  test('marks the button matching stageFocus as active, and no others', () => {
    renderBottomControls({
      stageFocus: FIELD,
      viewList: [SHOP, FIELD, WORKSHOP],
    })

    const activeButton = screen.getByRole('button', { name: 'Go to Field' })
    const inactiveButton = screen.getByRole('button', { name: 'Go to Shop' })

    expect(activeButton).toHaveAttribute('aria-current', 'true')
    expect(activeButton.classList.contains('selected')).toEqual(true)

    expect(inactiveButton).not.toHaveAttribute('aria-current')
    expect(inactiveButton.classList.contains('selected')).toEqual(false)
  })

  test('the previous/menu/next buttons still call their handlers', async () => {
    const focusPreviousView = vitest.fn()
    const focusNextView = vitest.fn()
    const handleMenuToggle = vitest.fn()

    renderBottomControls({
      focusPreviousView,
      focusNextView,
      handleMenuToggle,
    })

    await userEvent.click(screen.getByRole('button', { name: 'Previous view' }))
    await userEvent.click(screen.getByRole('button', { name: 'Open drawer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next view' }))

    expect(focusPreviousView).toHaveBeenCalled()
    expect(handleMenuToggle).toHaveBeenCalled()
    expect(focusNextView).toHaveBeenCalled()
  })

  test('shows a tooltip naming the view when a button is hovered', async () => {
    renderBottomControls({ viewList: [SHOP, FIELD, WORKSHOP] })

    await userEvent.hover(screen.getByRole('button', { name: 'Go to Field' }))

    expect(
      await screen.findByRole('tooltip', { name: 'Field' })
    ).toBeInTheDocument()
  })
})
