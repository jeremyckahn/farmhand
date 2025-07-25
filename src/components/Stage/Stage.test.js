import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { stageFocusType } from '../../../src/enums.js'
import { testState } from '../../test-utils/index.js'
import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'

import { Stage } from './Stage.js'

// Mock child components to avoid their complex dependencies
vi.mock('../Field/index.js', () => ({
  default: () => <div className="Field">Field</div>,
}))

vi.mock('../Forest/index.js', () => ({
  Forest: () => <div className="Forest">Forest</div>,
}))

vi.mock('../Home/index.js', () => ({
  default: () => <div className="Home">Home</div>,
}))

vi.mock('../CowPen/index.js', () => ({
  default: () => <div className="CowPen">CowPen</div>,
}))

vi.mock('../Shop/index.js', () => ({
  default: () => <div className="Shop">Shop</div>,
}))

vi.mock('../Workshop/index.js', () => ({
  default: () => <div className="Workshop">Workshop</div>,
}))

vi.mock('../Cellar/index.js', () => ({
  Cellar: () => <div className="Cellar">Cellar</div>,
}))

const defaultProps = {
  field: [[]],
  stageFocus: stageFocusType.FIELD,
  viewTitle: 'Test View',
}

const renderWithContext = (props = {}, gameState = {}, handlers = {}) => {
  const contextValue = createContextData()
  contextValue.gameState = {
    ...contextValue.gameState,
    ...testState(gameState),
  }
  contextValue.handlers = { ...contextValue.handlers, ...handlers }

  return render(
    <FarmhandContext.Provider value={contextValue}>
      <Stage {...defaultProps} {...props} />
    </FarmhandContext.Provider>
  )
}

describe('Stage', () => {
  test('renders', () => {
    renderWithContext()
    expect(screen.getByText('Field')).toBeInTheDocument()
  })

  test('displays view title', () => {
    renderWithContext({ viewTitle: 'Farm View' })
    expect(screen.getByText('Farm View')).toBeInTheDocument()
  })

  describe('stage focus rendering', () => {
    test('shows the field when stageFocus is FIELD', () => {
      renderWithContext(
        { stageFocus: stageFocusType.FIELD },
        {
          field: [
            [null, null],
            [null, null],
          ],
        }
      )

      expect(screen.getByText('Field')).toBeInTheDocument()
    })

    test('shows the shop when stageFocus is SHOP', () => {
      renderWithContext({ stageFocus: stageFocusType.SHOP })

      expect(screen.getByText('Shop')).toBeInTheDocument()
    })

    test('shows the cow pen when stageFocus is COW_PEN', () => {
      renderWithContext(
        { stageFocus: stageFocusType.COW_PEN },
        { purchasedCowPen: 1 }
      )

      expect(screen.getByText('CowPen')).toBeInTheDocument()
    })

    test('shows the workshop when stageFocus is WORKSHOP', () => {
      renderWithContext({ stageFocus: stageFocusType.WORKSHOP })

      expect(screen.getByText('Workshop')).toBeInTheDocument()
    })

    test('shows the forest when stageFocus is FOREST', () => {
      renderWithContext(
        { stageFocus: stageFocusType.FOREST },
        {
          purchasedForest: 1,
          forest: [
            [null, null],
            [null, null],
          ],
        }
      )

      expect(screen.getByText('Forest')).toBeInTheDocument()
    })

    test('shows the cellar when stageFocus is CELLAR', () => {
      renderWithContext(
        { stageFocus: stageFocusType.CELLAR },
        { purchasedCellar: 1 }
      )

      expect(screen.getByText('Cellar')).toBeInTheDocument()
    })

    test('shows the home screen when stageFocus is HOME', () => {
      renderWithContext({ stageFocus: stageFocusType.HOME })

      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  test('applies correct data attribute based on stage focus', () => {
    renderWithContext({ stageFocus: stageFocusType.SHOP })

    const stage = document.querySelector('.Stage')
    expect(stage).toHaveAttribute('data-stage-focus', stageFocusType.SHOP)
  })

  test('handles unknown stage focus gracefully', () => {
    renderWithContext({ stageFocus: 'UNKNOWN_STAGE' })

    expect(document.querySelector('.Stage')).toBeInTheDocument()
  })

  test('passes props to child components', () => {
    renderWithContext(
      { stageFocus: stageFocusType.FIELD },
      {
        field: [
          [null, null],
          [null, null],
        ],
      }
    )

    expect(screen.getByText('Field')).toBeInTheDocument()
  })
})
