import { render, screen } from '@testing-library/react'
import React from 'react'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { RandomSeedInput } from './RandomSeedInput'

const mockHandleRNGSeedChange = jest.fn()

const MockRandomSeedInput = props => (
  <FarmhandContext.Provider
    value={{ handlers: { handleRNGSeedChange: mockHandleRNGSeedChange } }}
  >
    <RandomSeedInput {...props} />
  </FarmhandContext.Provider>
)

describe('RandomSeedInput', () => {
  test('gets initial value from query param', () => {
    render(<MockRandomSeedInput search="?seed=123" />)

    expect(screen.getByDisplayValue('123')).toBeInTheDocument()
  })

  xtest('updates query param', () => {
    // TODO
  })

  xtest('submits seed change', () => {
    // TODO
  })
})
