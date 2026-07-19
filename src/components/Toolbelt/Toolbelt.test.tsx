import React from 'react'
import { render, screen } from '@testing-library/react'

import { fieldMode, stageFocusType, toolLevel, toolType } from '../../enums.js'

import { Toolbelt } from './Toolbelt.js'

vitest.mock('../../utils/memoize.js', () => ({
  memoize: vitest.fn(callback => {
    return (...args: any[]) => {
      return callback(...args)
    }
  }),
}))

describe('<ToolBelt />', () => {
  const getSelectedButton = () => {
    return screen
      .getAllByRole('button')
      .find(b => b.classList.contains('selected'))
  }

  const getToolLevels = () => {
    let toolLevels: Record<string, string> = {}

    for (let type in toolType) {
      toolLevels[type] = toolLevel.DEFAULT
    }

    return toolLevels as any
  }

  test('renders a button for each tool that has a level set', () => {
    render(
      <Toolbelt fieldMode={fieldMode.OBSERVE} toolLevels={getToolLevels()} />
    )
    expect(screen.getAllByRole('button')).toHaveLength(6)
  })

  test('does not render a tool that does not have a level set', () => {
    let toolLevels = getToolLevels()

    toolLevels[toolType.SHOVEL] = toolLevel.UNAVAILABLE

    render(<Toolbelt fieldMode={fieldMode.OBSERVE} toolLevels={toolLevels} />)

    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  describe('stageFocus filtering', () => {
    test('only shows Field tools when stageFocus is FIELD', () => {
      render(
        <Toolbelt
          fieldMode={fieldMode.OBSERVE}
          stageFocus={stageFocusType.FIELD}
          toolLevels={getToolLevels()}
        />
      )

      expect(screen.getAllByRole('button')).toHaveLength(4)
      expect(screen.getByText(/Select the watering can/)).toBeInTheDocument()
      expect(screen.getByText(/Select the scythe/)).toBeInTheDocument()
      expect(screen.getByText(/Select the hoe/)).toBeInTheDocument()
      expect(screen.getByText(/Select the shovel/)).toBeInTheDocument()
      expect(screen.queryByText(/Select the axe/)).not.toBeInTheDocument()
      expect(
        screen.queryByText(/Select the picker pole/)
      ).not.toBeInTheDocument()
    })

    test('only shows Forest tools when stageFocus is FOREST', () => {
      render(
        <Toolbelt
          fieldMode={fieldMode.OBSERVE}
          stageFocus={stageFocusType.FOREST}
          toolLevels={getToolLevels()}
        />
      )

      expect(screen.getAllByRole('button')).toHaveLength(2)
      expect(screen.getByText(/Select the axe/)).toBeInTheDocument()
      expect(screen.getByText(/Select the picker pole/)).toBeInTheDocument()
      expect(
        screen.queryByText(/Select the watering can/)
      ).not.toBeInTheDocument()
    })
  })

  describe('tool selection', () => {
    let toolLevels = getToolLevels()

    test('there are no selected tools by default', () => {
      render(<Toolbelt fieldMode={fieldMode.OBSERVE} toolLevels={toolLevels} />)
      expect(getSelectedButton()).toBeUndefined()
    })

    test('marks the watering can selected for field mode WATER', () => {
      render(<Toolbelt fieldMode={fieldMode.WATER} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the watering can/)

      expect(label.closest('button')?.classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the scythe selected for field mode HARVEST', () => {
      render(<Toolbelt fieldMode={fieldMode.HARVEST} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the scythe/)

      expect(label.closest('button')?.classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the hoe selected for field mode CLEANUP', () => {
      render(<Toolbelt fieldMode={fieldMode.CLEANUP} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the hoe/)

      expect(label.closest('button')?.classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the shovel selected for field mode MINE', () => {
      render(<Toolbelt fieldMode={fieldMode.MINE} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the shovel/)

      expect(label.closest('button')?.classList.contains('selected')).toEqual(
        true
      )
    })
  })
})
