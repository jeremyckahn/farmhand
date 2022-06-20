import React from 'react'

import { screen, render } from '@testing-library/react'

import FarmhandContext from '../Farmhand/Farmhand.context'

import Home from './Home'

beforeEach(() => {
  const gameState = {
    completedAchievements: {},
  }

  render(
    <FarmhandContext.Provider value={{ gameState, handlers: {} }}>
      <Home
        {...{
          completedAchievements: {},
          handleViewChangeButtonClick: () => {},
        }}
      />
    </FarmhandContext.Provider>
  )
})

test('renders', () => {
  expect(screen.getByText('Welcome!')).toBeInTheDocument()
})
