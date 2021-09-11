import React from 'react'
import { render, screen } from '@testing-library/react'

import { fieldMode, toolLevel, toolType } from '../../enums'

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

  let toolLevels = {}
  for (let type in toolType) {
    toolLevels[type] = toolLevel.DEFAULT
  }

  test('renders a button for each of the default tools', () => {
    render(<Toolbelt fieldMode={fieldMode.OBSERVE} toolLevels={toolLevels} />)
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  test('renders the shovel tool once gold digger achievement is completed', () => {
    render(
      <Toolbelt
        fieldMode={fieldMode.OBSERVE}
        completedAchievements={{ 'gold-digger': true }}
        toolLevels={toolLevels}
      />
    )
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  describe('tool selection', () => {
    test('there are no selected tools by default', () => {
      render(<Toolbelt fieldMode={fieldMode.OBSERVE} toolLevels={toolLevels} />)
      expect(getSelectedButton()).toBeUndefined()
    })

    test('marks the watering can selected for field mode WATER', () => {
      render(<Toolbelt fieldMode={fieldMode.WATER} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the watering can/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the scythe selected for field mode HARVEST', () => {
      render(<Toolbelt fieldMode={fieldMode.HARVEST} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the scythe/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the hoe selected for field mode CLEANUP', () => {
      render(<Toolbelt fieldMode={fieldMode.CLEANUP} toolLevels={toolLevels} />)
      const label = screen.getByText(/Select the hoe/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })

    test('marks the shovel selected for field mode MINE', () => {
      render(
        <Toolbelt
          fieldMode={fieldMode.MINE}
          completedAchievements={{ 'gold-digger': true }}
          toolLevels={toolLevels}
        />
      )
      const label = screen.getByText(/Select the shovel/)

      expect(label.closest('button').classList.contains('selected')).toEqual(
        true
      )
    })
  })
})
