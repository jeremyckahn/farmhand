import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { RandomSeedInput } from './RandomSeedInput.js'

const mockHandleRNGSeedChange = vitest.fn()

const MockRandomSeedInput = props => (
  <FarmhandContext.Provider
    // @ts-expect-error
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

  test('updates query param', async () => {
    render(<MockRandomSeedInput search="?seed=123" />)

    const input = screen.getByDisplayValue('123')

    await userEvent.type(input, '[Backspace][Backspace][Backspace]456[Enter]')

    expect(mockHandleRNGSeedChange).toHaveBeenCalledWith('456')
  })
})
