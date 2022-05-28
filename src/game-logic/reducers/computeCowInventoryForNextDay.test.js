import { COW_HUG_BENEFIT, MAX_DAILY_COW_HUG_BENEFITS } from '../../constants'

import { computeCowInventoryForNextDay } from './computeCowInventoryForNextDay'

describe('computeCowInventoryForNextDay', () => {
  test('ages cows', () => {
    expect(
      computeCowInventoryForNextDay({
        cowInventory: [
          { daysOld: 0 },
          { daysOld: 5, happiness: 0.5, happinessBoostsToday: 3 },
        ],
      })
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
          computeCowInventoryForNextDay({
            cowInventory: [
              {
                daysOld: 5,
                happiness: 0,
                happinessBoostsToday: 0,
                isUsingHuggingMachine: true,
              },
            ],
          })
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
