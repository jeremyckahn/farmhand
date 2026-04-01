import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

import Farmhand from '../../components/Farmhand/index.js'

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
}
