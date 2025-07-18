import { COW_HUG_BENEFIT, MAX_DAILY_COW_HUG_BENEFITS } from '../../constants.js'
import { generateCow } from '../../utils/index.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { computeCowInventoryForNextDay } from './computeCowInventoryForNextDay.js'

describe('computeCowInventoryForNextDay', () => {
  test('ages cows', () => {
    expect(
      computeCowInventoryForNextDay(
        saveDataStubFactory({
          cowInventory: [
            generateCow({ daysOld: 0 }),
            generateCow({
              daysOld: 5,
              happiness: 0.5,
              happinessBoostsToday: 3,
            }),
          ],
        })
      )
    ).toMatchObject({
      cowInventory: [
        { daysOld: 1, happinessBoostsToday: 0 },
        {
          daysOld: 6,
          happiness: 0.5 - COW_HUG_BENEFIT,
          happinessBoostsToday: 0,
        },
      ],
    })
  })

  describe('happiness', () => {
    describe('has a hugging machine', () => {
      test('happiness is pre-maxed for the day', () => {
        expect(
          computeCowInventoryForNextDay(
            saveDataStubFactory({
              cowInventory: [
                generateCow({
                  daysOld: 5,
                  happiness: 0,
                  happinessBoostsToday: 0,
                  isUsingHuggingMachine: true,
                }),
              ],
            })
          )
        ).toMatchObject({
          cowInventory: [
            {
              daysOld: 6,
              happiness: COW_HUG_BENEFIT * (MAX_DAILY_COW_HUG_BENEFITS - 1),
              happinessBoostsToday: MAX_DAILY_COW_HUG_BENEFITS,
              isUsingHuggingMachine: true,
            },
          ],
        })
      })
    })
  })
})
