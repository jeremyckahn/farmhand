import React from 'react'
import { render, screen } from '@testing-library/react'

import { fieldMode } from '../../enums'

import { Toolbelt } from './Toolbelt'

describe('<ToolBelt />', () => {
  const getSelectedButton = () => {
    return screen
      .getAllByRole('button')
      .find(b => b.classList.contains('selected'))
  }

  test('renders a button for each tool', () => {
    render(<Toolbelt fieldMode={fieldMode.OBSERVE} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  describe('tool selection', () => {
    test('there are no selected tools by default', () => {
      render(<Toolbelt fieldMode={fieldMode.OBSERVE} />)
      expect(getSelectedButton()).toBeUndefined()
    })

    test('marks the watering can selected for field mode WATER', async () => {
      render(<Toolbelt fieldMode={fieldMode.WATER} />)
      const span = screen.getByText(/Select the watering can/)

      expect(span.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the scythe selected for field mode HARVEST', async () => {
      render(<Toolbelt fieldMode={fieldMode.HARVEST} />)
      const span = screen.getByText(/Select the scythe/)

      expect(span.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the hoe selected for field mode CLEANUP', async () => {
      render(<Toolbelt fieldMode={fieldMode.CLEANUP} />)
      const span = screen.getByText(/Select the hoe/)

      expect(span.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })
  })
})
