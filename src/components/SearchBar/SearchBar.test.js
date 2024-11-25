import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event' // Правильный импорт
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

  it('calls onSearch with correct value when typing', async () => {
    const onSearchMock = vi.fn()
    render(<SearchBar placeholder="Type here" onSearch={onSearchMock} />)

    const inputElement = screen.getByPlaceholderText('Type here')
    await userEvent.type(inputElement, 'test query') // Используем userEvent

    // Проверяем debounce
    await waitFor(() => {
      expect(onSearchMock).toHaveBeenCalledTimes(1)
      expect(onSearchMock).toHaveBeenCalledWith('test query')
    })
  })
})
