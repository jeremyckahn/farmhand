import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Bloodline from './Bloodline.js'

const defaultProps = {
  colorsInBloodline: {},
}

test('renders', () => {
  render(<Bloodline {...defaultProps} />)
  expect(document.querySelector('.Bloodline')).toBeInTheDocument()
})

test('renders empty bloodline when no colors provided', () => {
  render(<Bloodline {...defaultProps} />)

  const bloodlineList = document.querySelector('.Bloodline')
  expect(bloodlineList).toBeInTheDocument()
  expect(bloodlineList?.children).toHaveLength(0)
})

test('renders color indicators for each color in bloodline', () => {
  const colorsInBloodline = {
    BROWN: true,
    WHITE: true,
    BLUE: true,
  }

  render(<Bloodline colorsInBloodline={colorsInBloodline} />)

  const colorElements = document.querySelectorAll('.Bloodline li')
  expect(colorElements).toHaveLength(3)
})

test('applies correct CSS classes for colors', () => {
  const colorsInBloodline = {
    BROWN: true,
    WHITE: true,
  }

  render(<Bloodline colorsInBloodline={colorsInBloodline} />)

  expect(document.querySelector('.brown')).toBeInTheDocument()
  expect(document.querySelector('.white')).toBeInTheDocument()
})

test('sorts colors alphabetically', () => {
  const colorsInBloodline = {
    WHITE: true,
    BLUE: true,
    BROWN: true,
  }

  render(<Bloodline colorsInBloodline={colorsInBloodline} />)

  const colorElements = document.querySelectorAll('.Bloodline li')
  expect(colorElements[0]).toHaveClass('blue')
  expect(colorElements[1]).toHaveClass('brown')
  expect(colorElements[2]).toHaveClass('white')
})

test('displays tooltips on hover', async () => {
  const colorsInBloodline = {
    BROWN: true,
  }

  render(<Bloodline colorsInBloodline={colorsInBloodline} />)

  const brownElement = document.querySelector('.brown')
  expect(brownElement).toBeInTheDocument()
  await userEvent.hover(/** @type {Element} */ (brownElement))

  expect(await screen.findByText('Brown')).toBeInTheDocument()
})

test('handles multiple color tooltips', async () => {
  const colorsInBloodline = {
    BROWN: true,
    WHITE: true,
    BLUE: true,
  }

  render(<Bloodline colorsInBloodline={colorsInBloodline} />)

  const blueElement = document.querySelector('.blue')
  expect(blueElement).toBeInTheDocument()
  await userEvent.hover(/** @type {Element} */ (blueElement))
  expect(await screen.findByText('Blue')).toBeInTheDocument()

  const whiteElement = document.querySelector('.white')
  expect(whiteElement).toBeInTheDocument()
  await userEvent.hover(/** @type {Element} */ (whiteElement))
  expect(await screen.findByText('White')).toBeInTheDocument()
})

test('renders correct structure with list and list items', () => {
  const colorsInBloodline = {
    BROWN: true,
    WHITE: true,
  }

  render(<Bloodline colorsInBloodline={colorsInBloodline} />)

  const bloodlineList = document.querySelector('ul.Bloodline')
  expect(bloodlineList).toBeInTheDocument()

  const listItems = bloodlineList?.querySelectorAll('li')
  expect(listItems).toHaveLength(2)
})
