import React from 'react'
import { render, screen } from '@testing-library/react'

import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'

import Achievement from './Achievement.js'

describe('<Achievement />', () => {
  let achievementObject: farmhand.achievement

  beforeEach(() => {
    achievementObject = {
      description: 'the best achievement',
      id: 'achievement-1',
      name: 'achievement one',
      rewardDescription: 'the greatest reward',
    } as farmhand.achievement

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

  test('does not render a progress bar when the achievement has no getProgress', () => {
    expect(document.querySelector('.ProgressBar')).not.toBeInTheDocument()
  })
})

describe('<Achievement /> with getProgress', () => {
  let achievementObject: farmhand.achievement

  beforeEach(() => {
    achievementObject = {
      description: 'the best achievement',
      id: 'achievement-1',
      name: 'achievement one',
      rewardDescription: 'the greatest reward',
      condition: () => false,
      reward: state => state,
      getProgress: () => ({ currentValue: 25, goal: 100 }),
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

  test('renders a progress bar', () => {
    expect(document.querySelector('.ProgressBar')).toBeInTheDocument()
  })
})

describe('<Achievement /> with getProgress and isComplete', () => {
  let achievementObject: farmhand.achievement

  beforeEach(() => {
    achievementObject = {
      description: 'the best achievement',
      id: 'achievement-1',
      name: 'achievement one',
      rewardDescription: 'the greatest reward',
      condition: () => false,
      reward: state => state,
      getProgress: () => ({ currentValue: 100, goal: 100 }),
    }

    const farmhandContextValue = createContextData()

    render(
      <FarmhandContext.Provider value={farmhandContextValue}>
        <Achievement
          achievement={achievementObject}
          completedAchievements={{ 'achievement-1': true }}
        />
      </FarmhandContext.Provider>
    )
  })

  test('does not render a progress bar once the achievement is complete', () => {
    expect(document.querySelector('.ProgressBar')).not.toBeInTheDocument()
  })
})
