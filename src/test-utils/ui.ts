import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const waitForBoot = () =>
  waitFor(() => {
    // Both the AppBar's season display ("Day 1 of Spring") and the sidebar's
    // day-and-progress-container ("Day 1, level:") match this substring, so
    // assert on the (possibly plural) match rather than a single element.
    expect(
      screen.getAllByText('Day 1', { exact: false })[0]
    ).toBeInTheDocument()
  })

export const endDay = async () => {
  const endDayButton = await screen.findByLabelText(
    'End the day to save your progress and advance the game.'
  )

  await userEvent.click(endDayButton)
}

export const previousView = async () => {
  const previousViewButton = await screen.findByLabelText('Previous view')

  await userEvent.click(previousViewButton)
}

export const nextView = async () => {
  const nextViewButton = await screen.findByLabelText('Next view')

  await userEvent.click(nextViewButton)
}

export const getItemByName = async (itemName: string) => {
  const header = await screen.findByText(itemName)
  const item = header.closest('.Item')

  if (!item) {
    throw new Error(`Could not find item with name: ${itemName}`)
  }
  return item
}
