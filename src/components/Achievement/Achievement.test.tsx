import React from 'react'
import { render, screen } from '@testing-library/react'

import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.tsx'

import Achievement from './Achievement.tsx'

describe('<Achievement />', () => {
  let achievementObject

  beforeEach(() => {
    achievementObject = {
      description: 'the best achievement',
      id: 'achievement-1',
      name: 'achievement one',
      rewardDescription: 'the greatest reward',
    }

    const farmhandContextValue = createContextData()

    render(
      <FarmhandContext.Provider value={farmhandContextValue}>
        <Achievement
          achievement={achievementObject}
          completedAchievements={{}}
        />
      </FarmhandContext.Provider>
    )
  })

  test('renders the name of the achievement', () => {
    expect(screen.getByText(achievementObject.name)).toBeInTheDocument()
  })

  test('renders the achievement description', () => {
    expect(screen.getByText(achievementObject.description)).toBeInTheDocument()
  })

  test('renders the reward description', () => {
    expect(
      screen.getByText(new RegExp(achievementObject.rewardDescription))
    ).toBeInTheDocument()
  })
})
