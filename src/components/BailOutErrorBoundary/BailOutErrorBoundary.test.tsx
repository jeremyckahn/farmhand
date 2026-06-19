import React from 'react'
import { render, screen } from '@testing-library/react'

import BailOutErrorBoundary from './BailOutErrorBoundary.js'

const ThrowError = ({ shouldThrow }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

test('renders children when there is no error', () => {
  render(
    <BailOutErrorBoundary>
      <div>Child component</div>
    </BailOutErrorBoundary>
  )
  expect(screen.getByText('Child component')).toBeInTheDocument()
})

// Suppress JSDOM uncaught error logs for intentionally thrown errors in the test boundary
const errorHandler = (e: Event) => {
  e.preventDefault()
}
beforeAll(() => {
  window.addEventListener('error', errorHandler)
})
afterAll(() => {
  window.removeEventListener('error', errorHandler)
})

test('renders nothing when there is an error', () => {
  // Suppress console.error for this test
  const consoleSpy = vitest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <BailOutErrorBoundary>
      <ThrowError shouldThrow={true} />
    </BailOutErrorBoundary>
  )

  expect(screen.queryByText('No error')).not.toBeInTheDocument()
  expect(consoleSpy).toHaveBeenCalled()

  consoleSpy.mockRestore()
})

test('logs error to console when error occurs', () => {
  const consoleSpy = vitest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <BailOutErrorBoundary>
      <ThrowError shouldThrow={true} />
    </BailOutErrorBoundary>
  )

  expect(consoleSpy).toHaveBeenCalledWith(
    expect.any(Error),
    expect.objectContaining({
      componentStack: expect.any(String),
    })
  )

  consoleSpy.mockRestore()
})
