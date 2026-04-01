import React from 'react'
import { render, screen } from '@testing-library/react'

import AchievementsView from './AchievementsView.js'

test('renders', () => {
  render(<AchievementsView {...{}} />)
  expect(screen.getByText('Not Completed')).toBeInTheDocument()
})
