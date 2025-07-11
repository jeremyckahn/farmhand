import React from 'react'

import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import Home from './Home.js'

describe('<Home />', () => {
  let handleViewChangeButtonClick

  beforeEach(() => {
    const gameState = {
      completedAchievements: {},
    }

    handleViewChangeButtonClick = vitest.fn()

    render(
      <FarmhandContext.Provider
        // @ts-expect-error
        value={{ gameState, handlers: {} }}
      >
        <Home handleViewChangeButtonClick={handleViewChangeButtonClick} />
      </FarmhandContext.Provider>
    )
  })

  test('rendered welcome message', () => {
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
  })

  describe('go to shop', () => {
    const shopButton = () =>
      screen.getByRole('button', { name: 'Go to the shop' })

    test('contains an action to go to the shop', () => {
      expect(shopButton()).toBeInTheDocument()
    })

    test('calls to change view when shop button is clicked', () => {
      userEvent.click(shopButton())

      expect(handleViewChangeButtonClick).toHaveBeenCalledWith('SHOP')
    })
  })
})
