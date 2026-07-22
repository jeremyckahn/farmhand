import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

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
  const formatter = (number: number) => `$${number.toFixed(2)}`

  render(<AnimatedNumber {...{ number: 123.45, formatter }} />)
  expect(screen.getByText('$123.45')).toBeInTheDocument()
})

test('skips animation and updates synchronously when prefers-reduced-motion is reduce', () => {
  const originalMatchMedia = window.matchMedia

  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  const { rerender } = render(<AnimatedNumber number={0} />)

  expect(screen.getByText('0')).toBeInTheDocument()

  // Re-render with a new number
  rerender(<AnimatedNumber number={100} />)

  // Should update immediately without tweening
  expect(screen.getByText('100')).toBeInTheDocument()

  window.matchMedia = originalMatchMedia
})

test('animates when prefers-reduced-motion is no-preference', async () => {
  const originalMatchMedia = window.matchMedia

  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  const { rerender } = render(<AnimatedNumber number={0} />)

  expect(screen.getByText('0')).toBeInTheDocument()

  // Re-render with a new number
  rerender(<AnimatedNumber number={100} />)

  // Because it animates, it should NOT immediately be 100
  // It should still be 0 (the initial frame of the animation)
  // Since the environment is jsdom and doesn't exactly tick rAF frame by frame on our schedule,
  // the intermediate state '0' might have already ticked to '0.266...'.
  // We mainly care that it didn't immediately jump to 100:
  expect(screen.queryByText('100')).not.toBeInTheDocument()

  // Use vitest waitFor to wait for Shifty to finish without relying on fake timers
  await waitFor(() => expect(screen.getByText('100')).toBeInTheDocument(), { timeout: 2000 });

  window.matchMedia = originalMatchMedia
})
