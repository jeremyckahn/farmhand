import React from 'react'
import { render, screen } from '@testing-library/react'

import KeybindingsView from './KeybindingsView.js'

test('renders', () => {
  render(<KeybindingsView />)
  expect(
    screen.getByText('Show Keyboard Shortcuts (this screen)')
  ).toBeInTheDocument()
})

test('displays keyboard shortcuts table', () => {
  render(<KeybindingsView />)

  // Check for main keyboard shortcuts
  expect(screen.getByText('Toggle menu')).toBeInTheDocument()
  expect(screen.getByText('M')).toBeInTheDocument()
  expect(screen.getByText('End the day')).toBeInTheDocument()
  expect(screen.getByText('Shift + C')).toBeInTheDocument()
})

test('displays field-specific shortcuts section', () => {
  render(<KeybindingsView />)

  expect(
    screen.getByText('Field-specific keyboard shortcuts')
  ).toBeInTheDocument()
  expect(screen.getByText('Zoom in')).toBeInTheDocument()
  expect(screen.getByText('=')).toBeInTheDocument()
  expect(screen.getByText('Zoom out')).toBeInTheDocument()
  expect(screen.getByText('-')).toBeInTheDocument()
})

test('renders tables with proper accessibility labels', () => {
  render(<KeybindingsView />)

  const tables = screen.getAllByLabelText('Keyboard Shortcuts')
  expect(tables).toHaveLength(2)
})
