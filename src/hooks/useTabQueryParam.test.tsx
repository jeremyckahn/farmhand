import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useTabQueryParam } from './useTabQueryParam.js'

const TestComponent = ({ tabLabels }: { tabLabels: string[] }) => {
  const [currentTab, setCurrentTab] = useTabQueryParam(tabLabels)

  return (
    <div>
      <span data-testid="current-tab">{currentTab}</span>
      {tabLabels.map((label, index) => (
        <button key={label} onClick={() => setCurrentTab(index)}>
          {label}
        </button>
      ))}
    </div>
  )
}

describe('useTabQueryParam', () => {
  afterEach(() => {
    window.history.replaceState({}, '', `${window.location.pathname}`)
  })

  test('defaults to tab 0 when the hash has no tab param', () => {
    render(<TestComponent tabLabels={['Seeds', 'Supplies', 'Upgrades']} />)

    expect(screen.getByTestId('current-tab')).toHaveTextContent('0')
  })

  test('restores the tab index matching the hash tab param', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?tab=Upgrades`
    )

    render(<TestComponent tabLabels={['Seeds', 'Supplies', 'Upgrades']} />)

    expect(screen.getByTestId('current-tab')).toHaveTextContent('2')
  })

  test('falls back to tab 0 when the hash tab param does not match any label', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?tab=NotARealTab`
    )

    render(<TestComponent tabLabels={['Seeds', 'Supplies', 'Upgrades']} />)

    expect(screen.getByTestId('current-tab')).toHaveTextContent('0')
  })

  test('changing tabs updates both the rendered state and the hash', async () => {
    render(<TestComponent tabLabels={['Seeds', 'Supplies', 'Upgrades']} />)

    await userEvent.click(screen.getByRole('button', { name: 'Upgrades' }))

    expect(screen.getByTestId('current-tab')).toHaveTextContent('2')
    expect(window.location.hash).toEqual('#?tab=Upgrades')
  })

  test('re-derives the tab index when a tab is inserted after mount (e.g. save data loading asynchronously adds a tab)', () => {
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}#?tab=Upgrades`
    )

    const { rerender } = render(
      <TestComponent tabLabels={['Seeds', 'Supplies', 'Upgrades']} />
    )

    // Upgrades starts at index 2, matching the initial (pre-load) label list.
    expect(screen.getByTestId('current-tab')).toHaveTextContent('2')

    // A "Saplings" tab appears after unlock-dependent save data loads,
    // shifting Upgrades from index 2 to index 3.
    rerender(
      <TestComponent
        tabLabels={['Seeds', 'Saplings', 'Supplies', 'Upgrades']}
      />
    )

    expect(screen.getByTestId('current-tab')).toHaveTextContent('3')
  })
})
