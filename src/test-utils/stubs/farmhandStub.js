import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

import Farmhand from '../../components/Farmhand'

/**
 * @param {Object} [props] props to start the Farmhand instance with for
 * testing.
 */
export const farmhandStub = async (props = {}) => {
  const FarmhandRoute = routeProps => (
    <Farmhand {...{ ...routeProps, ...props }} />
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

  if (!props.localforage) {
    // Wait for the notification that is shown when a new game has finished booting
    await screen.findByText('You took out a new loan', { exact: false })
  }
}
