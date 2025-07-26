import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

export const getItemByName = async itemName => {
  const header = await screen.findByText(itemName)
  const item = header.closest('.Item')
  if (!item) {
    throw new Error(`Could not find item with name: ${itemName}`)
  }
  return item
}
