import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import SearchBar from './SearchBar.js'

describe('SearchBar Component', () => {
  it('renders correctly with placeholder', () => {
    render(<SearchBar placeholder="Search for items" onSearch={() => {}} />)

    const inputElement = screen.getByPlaceholderText('Search for items')
    expect(inputElement).toBeInTheDocument()
  })

  it('renders with default placeholder if none provided', () => {
    render(<SearchBar onSearch={() => {}} />)

    const inputElement = screen.getByPlaceholderText('Search...')
    expect(inputElement).toBeInTheDocument()
  })

  it('calls onSearch with correct value when typing', () => {
    const onSearchMock = vi.fn()
    render(<SearchBar placeholder="Type here" onSearch={onSearchMock} />)

    const inputElement = screen.getByPlaceholderText('Type here')
    fireEvent.change(inputElement, { target: { value: 'test query' } })

    expect(onSearchMock).toHaveBeenCalledTimes(1)
    expect(onSearchMock).toHaveBeenCalledWith('test query')
  })
})
