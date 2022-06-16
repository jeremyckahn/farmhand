import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { PROGRESS_SAVED_MESSAGE } from '../strings'

import { farmhandStub } from '../test-utils/stubs/farmhandStub'

describe('game saving', () => {
  test('saves the game when the day is ended', async () => {
    await farmhandStub()

    const endDayButton = await screen.findByLabelText(
      'End the day to save your progress and advance the game.'
    )

    userEvent.click(endDayButton)

    const savedNotification = await screen.findByText(PROGRESS_SAVED_MESSAGE)
    expect(savedNotification).toBeInTheDocument()
  })
})
