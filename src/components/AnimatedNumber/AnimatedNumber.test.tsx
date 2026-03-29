import React from 'react'
import { render, screen } from '@testing-library/react'

import AnimatedNumber from './AnimatedNumber.js'

test('renders', () => {
  render(<AnimatedNumber {...{ number: 0 }} />)
  expect(screen.getByText('0')).toBeInTheDocument()
})

test('displays the provided number', () => {
  render(<AnimatedNumber {...{ number: 42 }} />)
  expect(screen.getByText('42')).toBeInTheDocument()
})

test('uses custom formatter when provided', () => {
  const formatter = number => `$${number.toFixed(2)}`
  render(<AnimatedNumber {...{ number: 123.45, formatter }} />)
  expect(screen.getByText('$123.45')).toBeInTheDocument()
})
