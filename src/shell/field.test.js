import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { saveDataStubFactory } from '../test-utils/stubs/saveDataStubFactory.js'
import { farmhandStub } from '../test-utils/stubs/farmhandStub.js'
import { nextView } from '../test-utils/ui.js'
import {
  HOE_ALT_TEXT,
  SCYTHE_ALT_TEXT,
  WATERING_CAN_ALT_TEXT,
} from '../strings.js'
import { carrotSeed } from '../data/crops/index.js'
import { fertilizer } from '../data/recipes.js'

describe('field interaction', () => {
  beforeEach(async () => {
    const loadedState = saveDataStubFactory({
      purchasedCowPen: 1,
      inventory: [
        { id: carrotSeed.id, quantity: 1 },
        { id: fertilizer.id, quantity: 1 },
      ],
    })

    await farmhandStub({
      localforage: {
        getItem: () => Promise.resolve(loadedState),
        setItem: (_key, data) => Promise.resolve(data),
      },
    })

    // NOTE: Navigates to Field
    await nextView()
    await nextView()
  })

  test('can enable water mode', async () => {
    const field = screen.getByTestId('field')
    const wateringCanButton = screen.getByAltText(WATERING_CAN_ALT_TEXT)

    expect(field).not.toHaveClass('water-mode')
    await userEvent.click(wateringCanButton)
    expect(field).toHaveClass('water-mode')
  })

  test('can enable cleanup mode', async () => {
    const field = screen.getByTestId('field')
    const hoeButton = screen.getByAltText(HOE_ALT_TEXT)

    expect(field).not.toHaveClass('cleanup-mode')
    await userEvent.click(hoeButton)
    expect(field).toHaveClass('cleanup-mode')
  })

  test('can enable harvest mode', async () => {
    const field = screen.getByTestId('field')
    const scytheButton = screen.getByAltText(SCYTHE_ALT_TEXT)

    expect(field).not.toHaveClass('harvest-mode')
    await userEvent.click(scytheButton)
    expect(field).toHaveClass('harvest-mode')
  })

  test('can enable plant mode', async () => {
    const field = screen.getByTestId('field')
    const [, carrotSeedButton] = screen.getAllByAltText(carrotSeed.name)

    expect(field).not.toHaveClass('plant-mode')
    await userEvent.click(carrotSeedButton)
    expect(field).toHaveClass('plant-mode')
  })

  test('can enable fertilize mode', async () => {
    const field = screen.getByTestId('field')
    const [, fertilizerButton] = screen.getAllByAltText(fertilizer.name)

    expect(field).not.toHaveClass('fertilize-mode')
    await userEvent.click(fertilizerButton)
    expect(field).toHaveClass('fertilize-mode')
  })
})
