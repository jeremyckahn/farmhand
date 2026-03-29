import React from 'react'
import { render, screen } from '@testing-library/react'

import { testState } from '../../test-utils/index.js'

import { StatsView } from './StatsView.js'

vitest.mock('../../data/maps.js')

const defaultProps = testState({
  cowsTraded: 5,
  experience: 1500,
  farmName: 'Test Farm',
  historicalDailyLosses: [-100, -200, -50],
  historicalDailyRevenue: [500, 600, 300],
  itemsSold: {
    carrot: 25,
    corn: 15,
    potato: 10,
  },
  loansTakenOut: 2,
  profitabilityStreak: 3,
  record7dayProfitAverage: 250,
  recordProfitabilityStreak: 7,
  recordSingleDayProfit: 500,
  revenue: 10000,
  todaysLosses: -150,
  todaysRevenue: 400,
})

test('renders', () => {
  render(<StatsView {...defaultProps} />)
  expect(screen.getByText('Test Farm Farm')).toBeInTheDocument()
})

test('displays farmer information correctly', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Test Farm Farm')).toBeInTheDocument()
  expect(screen.getByText('Farm Name')).toBeInTheDocument()
  expect(screen.getByText('Farmer Level')).toBeInTheDocument()
  expect(screen.getByText('Farm Products Sold')).toBeInTheDocument()
})

test('displays financial records section', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Financial Records')).toBeInTheDocument()
  expect(screen.getByText("Today's Revenue")).toBeInTheDocument()
  expect(screen.getByText("Today's Losses")).toBeInTheDocument()
  expect(screen.getByText("Today's Profit")).toBeInTheDocument()
})

test('displays correct revenue and loss values', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('$400.00')).toBeInTheDocument() // todaysRevenue
  expect(screen.getByText('$150.00')).toBeInTheDocument() // todaysLosses (absolute value)
})

test('calculates and displays correct profit', () => {
  render(<StatsView {...defaultProps} />)

  // Today's profit should be revenue - losses = 400 - (-150) = 250
  // Find the row with "Today's Profit" and check its value
  const profitRow = screen.getByText("Today's Profit").closest('tr')
  expect(profitRow).toHaveTextContent('$250.00')
})

test('displays profitability streak with correct singular/plural', () => {
  render(
    <StatsView {...testState({ ...defaultProps, profitabilityStreak: 1 })} />
  )
  expect(screen.getByText('1 day')).toBeInTheDocument()

  render(
    <StatsView {...testState({ ...defaultProps, profitabilityStreak: 5 })} />
  )
  expect(screen.getByText('5 days')).toBeInTheDocument()
})

test('displays record profitability streak with correct singular/plural', () => {
  render(
    <StatsView
      {...testState({ ...defaultProps, recordProfitabilityStreak: 1 })}
    />
  )
  expect(screen.getByText('1 day')).toBeInTheDocument()

  render(
    <StatsView
      {...testState({ ...defaultProps, recordProfitabilityStreak: 10 })}
    />
  )
  expect(screen.getByText('10 days')).toBeInTheDocument()
})

test('displays cows traded count', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Cows traded')).toBeInTheDocument()
  expect(screen.getByText('5')).toBeInTheDocument()
})

test('displays loans taken out', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Loans Taken Out')).toBeInTheDocument()
  expect(screen.getByText('2')).toBeInTheDocument()
})

test('displays all-time total revenue', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('All-Time Total Revenue')).toBeInTheDocument()
  expect(screen.getByText('$10,000.00')).toBeInTheDocument()
})

test('displays items sold section when items exist', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Items Sold')).toBeInTheDocument()
  expect(screen.getByText('Carrot')).toBeInTheDocument()
  expect(screen.getByText('25')).toBeInTheDocument()
  expect(screen.getByText('Corn')).toBeInTheDocument()
  expect(screen.getByText('15')).toBeInTheDocument()
})

test('does not display items sold section when no items sold', () => {
  render(<StatsView {...testState({ ...defaultProps, itemsSold: {} })} />)

  expect(screen.queryByText('Items Sold')).not.toBeInTheDocument()
})

test('applies danger text styling when losses exceed revenue', () => {
  render(
    <StatsView
      {...testState({
        ...defaultProps,
        todaysRevenue: 100,
        todaysLosses: -200,
      })}
    />
  )

  const profitCell = screen.getByText('-$100.00').closest('td')
  expect(profitCell).toHaveClass('danger-text')
})

test('does not apply danger text styling when revenue exceeds losses', () => {
  render(
    <StatsView
      {...testState({
        ...defaultProps,
        todaysRevenue: 500,
        todaysLosses: -100,
      })}
    />
  )

  const profitCell = screen.getByText('$400.00').closest('td')
  expect(profitCell).not.toHaveClass('danger-text')
})

test('displays record single day profit', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Record Single Day Profit')).toBeInTheDocument()
  expect(screen.getByText('$500.00')).toBeInTheDocument()
})

test('displays 7-day profit average', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('7-day Profit Average')).toBeInTheDocument()
})

test('displays record 7-day profit average', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByText('Record 7-day Profit Average')).toBeInTheDocument()
  // Find the row with "Record 7-day Profit Average" and check its value
  const recordProfitRow = screen
    .getByText('Record 7-day Profit Average')
    .closest('tr')
  expect(recordProfitRow).toHaveTextContent('$250.00')
})

test('renders tables with proper accessibility labels', () => {
  render(<StatsView {...defaultProps} />)

  expect(screen.getByLabelText('Farmer Stats')).toBeInTheDocument()
  expect(screen.getAllByLabelText('Profit and Loss Stats')).toHaveLength(2)
})

test('displays experience needed for next level', () => {
  render(<StatsView {...defaultProps} />)

  expect(
    screen.getByText('Experience Points Needed for Next Level')
  ).toBeInTheDocument()
})

test('formats money quantities', () => {
  render(
    <StatsView
      {...testState({
        ...defaultProps,
        revenue: 1234567,
        todaysRevenue: 12345,
      })}
    />
  )

  expect(screen.getByText('$1,234,567.00')).toBeInTheDocument()
  expect(screen.getByText('$12,345.00')).toBeInTheDocument()
})
