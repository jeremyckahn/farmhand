import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

import Farmhand from '../../components/Farmhand'

/**
 * @param {Object} [initialState] State to start the Farmhand instance with for
 * testing.
 */
export const farmhandStub = async (initialState = {}) => {
  const FarmhandRoute = routeProps => (
    <Farmhand {...{ ...routeProps, initialState }} />
  )

  render(
    <MemoryRouter>
      <Route
        {...{
          path: ['/online/:room', '/online', '/'],
          component: FarmhandRoute,
        }}
      />
    </MemoryRouter>
  )

  // Wait for the notification that is shown when the game has finished booting
  await screen.findByText('You took out a new loan', { exact: false })
}
