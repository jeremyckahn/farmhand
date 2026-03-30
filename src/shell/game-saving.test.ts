import { screen } from '@testing-library/react'

import { endDay } from '../test-utils/ui.ts'
import { PROGRESS_SAVED_MESSAGE } from '../strings.ts'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.tsx'

describe('game saving', () => {
  test('saves the game when the day is ended', async () => {
    await farmhandStub()
    await endDay()

    const savedNotification = await screen.findByText(PROGRESS_SAVED_MESSAGE)
    expect(savedNotification).toBeInTheDocument()
  })
})
