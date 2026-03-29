import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { noop } from '../../utils/noop.js'

import QuantityInput from './QuantityInput.js'

const defaultProps = {
  handleSubmit: noop,
  handleUpdateNumber: noop,
  maxQuantity: 10,
  setQuantity: noop,
  value: 1,
}

test('renders', () => {
  render(<QuantityInput {...defaultProps} />)
  expect(screen.getByDisplayValue('1')).toBeInTheDocument()
})

test('displays current value in text input', () => {
  render(<QuantityInput {...defaultProps} value={5} />)
  expect(screen.getByDisplayValue('5')).toBeInTheDocument()
})

test('displays max quantity in endAdornment', () => {
  render(<QuantityInput {...defaultProps} maxQuantity={25} />)
  expect(screen.getByText('25')).toBeInTheDocument()
})

test('calls handleUpdateNumber when input value changes', async () => {
  const user = userEvent.setup()
  const handleUpdateNumber = vitest.fn()

  render(
    <QuantityInput {...defaultProps} handleUpdateNumber={handleUpdateNumber} />
  )

  const input = screen.getByDisplayValue('1')
  await user.clear(input)
  await user.type(input, '7')

  expect(handleUpdateNumber).toHaveBeenCalled()
})

test('calls handleSubmit when Enter key is pressed', async () => {
  const handleSubmit = vitest.fn()

  render(<QuantityInput {...defaultProps} handleSubmit={handleSubmit} />)

  const input = screen.getByDisplayValue('1')
  fireEvent.keyUp(input, { key: 'Enter', keyCode: 13, which: 13 })

  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

test('calls setQuantity with incremented value when increment button is clicked', async () => {
  const user = userEvent.setup()
  const setQuantity = vitest.fn()

  render(
    <QuantityInput {...defaultProps} setQuantity={setQuantity} value={3} />
  )

  const incrementButton = screen.getByLabelText('Increment')
  await user.click(incrementButton)

  expect(setQuantity).toHaveBeenCalledWith(4)
})

test('calls setQuantity with decremented value when decrement button is clicked', async () => {
  const user = userEvent.setup()
  const setQuantity = vitest.fn()

  render(
    <QuantityInput {...defaultProps} setQuantity={setQuantity} value={3} />
  )

  const decrementButton = screen.getByLabelText('Decrement')
  await user.click(decrementButton)

  expect(setQuantity).toHaveBeenCalledWith(2)
})

test('wraps to maxQuantity when decrementing from 1', async () => {
  const user = userEvent.setup()
  const setQuantity = vitest.fn()

  render(
    <QuantityInput
      {...defaultProps}
      setQuantity={setQuantity}
      value={1}
      maxQuantity={5}
    />
  )

  const decrementButton = screen.getByLabelText('Decrement')
  await user.click(decrementButton)

  expect(setQuantity).toHaveBeenCalledWith(5)
})

test('wraps to 1 when incrementing beyond maxQuantity', async () => {
  const user = userEvent.setup()
  const setQuantity = vitest.fn()

  render(
    <QuantityInput
      {...defaultProps}
      setQuantity={setQuantity}
      value={5}
      maxQuantity={5}
    />
  )

  const incrementButton = screen.getByLabelText('Increment')
  await user.click(incrementButton)

  expect(setQuantity).toHaveBeenCalledWith(1)
})

test('disables buttons when value is 0', () => {
  render(<QuantityInput {...defaultProps} value={0} />)

  const incrementButton = screen.getByLabelText('Increment')
  const decrementButton = screen.getByLabelText('Decrement')

  expect(incrementButton).toBeDisabled()
  expect(decrementButton).toBeDisabled()
})

test('enables buttons when value is greater than 0', () => {
  render(<QuantityInput {...defaultProps} value={1} />)

  const incrementButton = screen.getByLabelText('Increment')
  const decrementButton = screen.getByLabelText('Decrement')

  expect(incrementButton).not.toBeDisabled()
  expect(decrementButton).not.toBeDisabled()
})

test('selects input text on focus', async () => {
  const user = userEvent.setup()

  render(<QuantityInput {...defaultProps} value={123} />)

  const input = screen.getByDisplayValue('123')
  await user.click(input)

  // After clicking, the text should be selected
  // Note: selectionStart and selectionEnd may not be available on all elements in test environment
  if ('selectionStart' in input && 'selectionEnd' in input) {
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(3)
  }
})
