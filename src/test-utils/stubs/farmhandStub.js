import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'

import Farmhand from '../../Farmhand'

export const farmhandStub = async (initialState = {}) => {
  const FarmhandRoute = routeProps => (
    <Farmhand {...{ features: {}, ...routeProps, initialState }} />
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
