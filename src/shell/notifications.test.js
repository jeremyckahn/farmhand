import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { STORM_MESSAGE } from '../strings'

import { farmhandStub } from '../test-utils/stubs/farmhandStub'

describe('notifications', () => {
  test('pending notifications are shown when a day starts', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)

    await farmhandStub()

    const endDayButton = await screen.findByLabelText(
      'End the day to save your progress and advance the game.'
    )

    userEvent.click(endDayButton)

    await waitFor(() => {
      // STORM_MESSAGE message is a sample pending day notification that is
      // known to show upon starting a new day when Math.random() is locked to
      // 0.
      expect(screen.queryByText(STORM_MESSAGE)).toBeInTheDocument()
    })
  })
})
