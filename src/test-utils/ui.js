import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const endDay = async () => {
  const endDayButton = await screen.findByLabelText(
    'End the day to save your progress and advance the game.'
  )
  userEvent.click(endDayButton)
}
