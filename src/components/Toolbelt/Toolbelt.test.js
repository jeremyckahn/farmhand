import React from 'react'
import { render, screen } from '@testing-library/react'

import { fieldMode } from '../../enums'

import { Toolbelt } from './Toolbelt'

jest.mock('../../config', () => ({
  ...jest.requireActual('../../config'),
  features: {
    MINING: true,
  },
}))

describe('<ToolBelt />', () => {
  const getSelectedButton = () => {
    return screen
      .getAllByRole('button')
      .find(b => b.classList.contains('selected'))
  }

  test('renders a button for each of the default tools', () => {
    render(<Toolbelt fieldMode={fieldMode.OBSERVE} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  test('renders the shovel tool once unlocked', () => {
    render(<Toolbelt fieldMode={fieldMode.OBSERVE} shovelUnlocked={true} />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  describe('tool selection', () => {
    test('there are no selected tools by default', () => {
      render(<Toolbelt fieldMode={fieldMode.OBSERVE} />)
      expect(getSelectedButton()).toBeUndefined()
    })

    test('marks the watering can selected for field mode WATER', () => {
      render(<Toolbelt fieldMode={fieldMode.WATER} />)
      const label = screen.getByText(/Select the watering can/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the scythe selected for field mode HARVEST', () => {
      render(<Toolbelt fieldMode={fieldMode.HARVEST} />)
      const label = screen.getByText(/Select the scythe/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the hoe selected for field mode CLEANUP', () => {
      render(<Toolbelt fieldMode={fieldMode.CLEANUP} />)
      const label = screen.getByText(/Select the hoe/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the shovel selected for field mode MINE', () => {
      render(<Toolbelt fieldMode={fieldMode.MINE} shovelUnlocked={true} />)
      const label = screen.getByText(/Select the shovel/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })
  })
})
