import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import AnimatedNumber from './AnimatedNumber.js'

vi.mock('../../config.js', () => ({
  features: {},
}))

test('renders', () => {
  render(<AnimatedNumber {...{ number: 0 }} />)
  expect(screen.getByText('0')).toBeInTheDocument()
})

test('displays the provided number', () => {
  render(<AnimatedNumber {...{ number: 42 }} />)
  expect(screen.getByText('42')).toBeInTheDocument()
})

test('uses custom formatter when provided', () => {
  const formatter = (number: number) => `$${number.toFixed(2)}`

  render(<AnimatedNumber {...{ number: 123.45, formatter }} />)
  expect(screen.getByText('$123.45')).toBeInTheDocument()
})

test('skips animation and updates synchronously when SKIP_ANIMATIONS is true', async () => {
  const { features } = await import('../../config.js')

  features.SKIP_ANIMATIONS = true

  const { rerender } = render(<AnimatedNumber number={0} />)

  expect(screen.getByText('0')).toBeInTheDocument()

  // Re-render with a new number
  rerender(<AnimatedNumber number={100} />)

  // Should update immediately without tweening
  expect(screen.getByText('100')).toBeInTheDocument()

  features.SKIP_ANIMATIONS = false
})

test('animates when SKIP_ANIMATIONS is false', async () => {
  const { features } = await import('../../config.js')

  features.SKIP_ANIMATIONS = false

  const { rerender } = render(<AnimatedNumber number={0} />)

  expect(screen.getByText('0')).toBeInTheDocument()

  // Re-render with a new number
  rerender(<AnimatedNumber number={100} />)

  // Because it animates, it should NOT immediately be 100
  // It should still be 0 (the initial frame of the animation)
  expect(screen.getByText('0')).toBeInTheDocument()
})
