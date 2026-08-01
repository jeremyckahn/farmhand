import { addItemToInventory } from '../game-logic/reducers/index.js'
import { doesPlotContainCrop } from '../utils/doesPlotContainCrop.js'
import { dollarString } from '../utils/dollarString.js'
import { getCropLifeStage } from '../utils/getCropLifeStage.js'
import { getProfitRecord } from '../utils/getProfitRecord.js'
import { integerString } from '../utils/integerString.js'
import { isOctober } from '../utils/isOctober.js'
import { moneyTotal } from '../utils/moneyTotal.js'
import { percentageString } from '../utils/percentageString.js'
import { memoize } from '../utils/memoize.js'
import { findInField } from '../utils/findInField.js'
import { addExperience } from '../game-logic/reducers/index.js'
import { cropLifeStage, standardCowColors } from '../enums.js'
import {
  COW_FEED_ITEM_ID,
  EXPERIENCE_VALUES,
  I_AM_RICH_BONUSES,
} from '../constants.js'

import { itemsMap, recipesMap } from './maps.js'

const { SEED } = cropLifeStage

const addMoney = (state: farmhand.state, reward: number) => ({
  ...state,
  money: moneyTotal(state.money, reward),
})

const sumOfCropsHarvested = memoize(
  (cropsHarvested: Record<string, number>) =>
    Object.values(cropsHarvested).reduce(
      (sum: number, cropHarvested: number) => sum + cropHarvested,
      0
    ),
  {}
)

const sumOfPartialRecordValues = memoize(
  (record: Partial<Record<string, number>>) =>
    Object.values(record).reduce(
      (sum: number, value: number | undefined) => sum + (value || 0),
      0
    ),
  {}
)

const PIE_RECIPE_IDS = Object.values(recipesMap)
  .filter(recipe => recipe.isPie)
  .map(recipe => recipe.id)

const sumOfPiesMade = memoize(
  (recipesMade: Partial<Record<string, number>>) =>
    PIE_RECIPE_IDS.reduce((sum, id) => sum + (recipesMade[id] || 0), 0),
  {}
)

const cowFeed = itemsMap[COW_FEED_ITEM_ID]

// Derives condition and getProgress from a single source of truth so that an
// achievement's "complete" state and its progress bar can never disagree.
export const progressAchievement = (
  goal: number,
  getCurrentValue: (state: farmhand.state) => number
): Pick<farmhand.achievement, 'condition' | 'getProgress'> => ({
  condition: state => getCurrentValue(state) >= goal,
  getProgress: state => ({ currentValue: getCurrentValue(state), goal }),
})

const achievements: farmhand.achievement[] = [
  ((reward = 100) => ({
    id: 'plant-crop',
    name: 'Plant a Crop',
    description: 'Purchase a seed and plant it in the field.',
    rewardDescription: dollarString(reward),
    condition: state =>
      Boolean(
        findInField(
          state.field,
          plotContent =>
            plotContent !== null &&
            doesPlotContainCrop(plotContent) &&
            getCropLifeStage(plotContent) === SEED
        )
      ),
    reward: state => addMoney(state, reward),
  }))(),

  ((reward = 150) => ({
    id: 'water-crop',
    name: 'Water a Crop',
    description: 'Water a crop that you planted.',
    rewardDescription: dollarString(reward),
    condition: state =>
      Boolean(
        findInField(
          state.field,
          plot => doesPlotContainCrop(plot) && Boolean(plot.wasWateredToday)
        )
      ),
    reward: state => addMoney(state, reward),
  }))(),

  ((reward = 200) => ({
    id: 'harvest-crop',
    name: 'Harvest a Crop',
    description: 'Harvest a crop that you planted.',
    rewardDescription: dollarString(reward),
    condition: state => sumOfCropsHarvested(state.cropsHarvested) >= 1,
    reward: state => addMoney(state, reward),
  }))(),

  ((reward = EXPERIENCE_VALUES.LOAN_PAID_OFF) => ({
    id: 'financial-freedom',
    name: 'Financial Freedom',
    description: 'Pay off your initial loan from the bank.',
    rewardDescription: `${reward} experience points`,
    condition: state => state.loanBalance === 0,
    reward: state => addExperience(state, reward),
  }))(),

  ((goal = 10000) => ({
    id: 'unlock-crop-price-guide',
    name: 'Prove Yourself as a Farmer',
    description: `Show that you can run a farm by earning at least ${dollarString(
      goal
    )}. Proven farmers get access to the Crop Price Guide, an invaluable tool for making better buying and selling decisions!`,
    rewardDescription: 'Crop Price Guide',
    ...progressAchievement(goal, state => state.revenue),
    // Reward is a no-op for this achievement. The value of
    // state.completedAchievements['unlock-crop-price-guide'] (which is
    // automatically set to `true` in the achievement processing logic) is used
    // to gate the price guides.
    reward: state => state,
  }))(),

  ((reward = 15) => ({
    id: 'purchase-cow-pen',
    name: 'Purchase a Cow Pen',
    description:
      'Construct any size cow pen to let your bovine buddies moo-ve on in!',
    rewardDescription: `${reward} units of ${cowFeed.name}`,
    condition: state => state.purchasedCowPen > 0,
    reward: state => addItemToInventory(state, cowFeed, reward, true),
  }))(),

  ((reward = 100, goal = Object.keys(standardCowColors).length) => ({
    id: 'purchase-all-cow-colors',
    name: 'Cows of Many Colors',
    description: 'Show that you love all cows and purchase one of every color.',
    rewardDescription: `${reward} units of ${cowFeed.name}`,
    ...progressAchievement(
      goal,
      state =>
        Object.values(standardCowColors).filter(
          color => (state.cowColorsPurchased[color] || 0) > 0
        ).length
    ),
    reward: state => addItemToInventory(state, cowFeed, reward, true),
  }))(),

  ((reward = 150) => ({
    id: 'play-during-october',
    name: 'Halloween Harvest',
    description: 'Play Farmhand in October and get the gift of the season.',
    rewardDescription: `${reward} units of ${itemsMap['jackolantern'].name}`,
    condition: () => isOctober(),
    reward: state =>
      addItemToInventory(state, itemsMap['jackolantern'], reward, true),
  }))(),

  ((reward = 100, goal = 10_000) => ({
    id: 'sell-10000-jack-o-lanterns',
    name: 'Spooky Pumpkin Patch',
    description: `Sell ${integerString(goal)} units of ${
      itemsMap['jackolantern'].name
    }. That's enough to fill a whole pumpkin patch!`,
    rewardDescription: `${reward} units of ${itemsMap['scarecrow'].name}`,
    ...progressAchievement(goal, state => state.itemsSold.jackolantern || 0),
    reward: state =>
      addItemToInventory(state, itemsMap['scarecrow'], reward, true),
  }))(),

  ((goal = 5000, reward = 25) => ({
    id: 'daily-profit-1',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap['fertilizer'].name}`,
    ...progressAchievement(goal, state =>
      getProfitRecord(
        state.recordSingleDayProfit,
        state.todaysRevenue,
        state.todaysLosses
      )
    ),
    reward: state =>
      addItemToInventory(state, itemsMap['fertilizer'], reward, true),
  }))(),

  ((goal = 15000, reward = 50) => ({
    id: 'daily-profit-2',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap['onion-seed'].name}`,
    ...progressAchievement(goal, state =>
      getProfitRecord(
        state.recordSingleDayProfit,
        state.todaysRevenue,
        state.todaysLosses
      )
    ),
    reward: state =>
      addItemToInventory(state, itemsMap['onion-seed'], reward, true),
  }))(),

  ((goal = 50000, reward = 100) => ({
    id: 'daily-profit-3',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap['tomato-seed'].name}`,
    ...progressAchievement(goal, state =>
      getProfitRecord(
        state.recordSingleDayProfit,
        state.todaysRevenue,
        state.todaysLosses
      )
    ),
    reward: state =>
      addItemToInventory(state, itemsMap['tomato-seed'], reward, true),
  }))(),

  ((goal = 2500, reward = 35, rewardItem = itemsMap['pumpkin-seed']) => ({
    id: 'profit-average-1',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    ...progressAchievement(goal, state => state.record7dayProfitAverage),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 10000, reward = 100, rewardItem = itemsMap['potato-seed']) => ({
    id: 'profit-average-2',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    ...progressAchievement(goal, state => state.record7dayProfitAverage),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 25000, reward = 250, rewardItem = itemsMap['soybean-seed']) => ({
    id: 'profit-average-3',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    ...progressAchievement(goal, state => state.record7dayProfitAverage),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 50000, reward = 300, rewardItem = itemsMap['chocolate-milk']) => ({
    id: 'profit-average-4',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    ...progressAchievement(goal, state => state.record7dayProfitAverage),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 150000, reward = 500, rewardItem = itemsMap['rainbow-milk-3']) => ({
    id: 'profit-average-5',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    ...progressAchievement(goal, state => state.record7dayProfitAverage),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 1000000, reward = 1000, rewardItem = itemsMap['rainbowCheese']) => ({
    id: 'profit-average-6',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    ...progressAchievement(goal, state => state.record7dayProfitAverage),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((
    goal = 10000,
    goalItem = itemsMap['milk-3'],
    reward = 5000,
    rewardItem = itemsMap['fertilizer']
  ) => ({
    id: 'sale-goal-1',
    name: `Dairy Master`,
    description: `Sell ${integerString(goal)} units of ${goalItem.name}.`,
    rewardDescription: `${integerString(reward)} ${rewardItem.name} units`,
    ...progressAchievement(goal, state => state.itemsSold[goalItem.id] || 0),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((
    goal = 1000,
    goalItem = itemsMap['rainbow-milk-2'],
    reward = 500,
    rewardItem = itemsMap['scarecrow']
  ) => ({
    id: 'sale-goal-2',
    name: `A Big Average Rainbow`,
    description: `Sell ${integerString(goal)} units of ${goalItem.name}.`,
    rewardDescription: `${integerString(reward)} ${rewardItem.name} units`,
    ...progressAchievement(goal, state => state.itemsSold[goalItem.id] || 0),
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 10000, goalItem = itemsMap['burger'], reward = 5000) => ({
    id: 'sale-goal-3',
    name: `Burger Master`,
    description: `Sell ${integerString(goal)} ${goalItem.name} units.`,
    rewardDescription: `${integerString(reward)} additional inventory spaces`,
    ...progressAchievement(goal, state => state.itemsSold[goalItem.id] || 0),
    reward: state => ({
      ...state,
      inventoryLimit: state.inventoryLimit + reward,
    }),
  }))(),

  ((goal = 500000) => ({
    id: 'i-am-rich-1',
    name: 'I am Rich!',
    description: `Earn ${dollarString(goal)}.`,
    rewardDescription: `All sales receive a ${percentageString(
      I_AM_RICH_BONUSES[0]
    )} bonus`,
    ...progressAchievement(goal, state => state.revenue),
    reward: state => state,
  }))(),

  ((goal = 1000000) => ({
    id: 'i-am-rich-2',
    name: 'Millionaire',
    description: `Earn ${dollarString(goal)}.`,
    rewardDescription: `All sales receive a ${percentageString(
      I_AM_RICH_BONUSES[1]
    )} bonus`,
    ...progressAchievement(goal, state => state.revenue),
    reward: state => state,
  }))(),

  ((goal = 1000000000) => ({
    id: 'i-am-rich-3',
    name: 'Billionaire',
    description: `Earn ${dollarString(goal)}.`,
    rewardDescription: `All sales receive a ${percentageString(
      I_AM_RICH_BONUSES[2]
    )} bonus`,
    ...progressAchievement(goal, state => state.revenue),
    reward: state => state,
  }))(),

  ((goal = Math.floor(Math.PI * 1_000_000), reward = 1000) => ({
    id: 'lord-of-the-pies',
    name: 'Lord of the Pies',
    description: `Have ${dollarString(goal)} on hand.`,
    rewardDescription: `${integerString(reward)} units of ${
      itemsMap['pumpkin-pie'].name
    }`,
    condition: state => Math.floor(state.money) === goal,
    reward: state =>
      addItemToInventory(state, itemsMap['pumpkin-pie'], reward, true),
  }))(),

  (() => ({
    id: 'gold-digger',
    name: 'Gold Digger',
    description: `Dig up your first piece of gold.`,
    rewardDescription: `A Gold Ingot`,
    condition: state => !!state.inventory.find(i => i.id === 'gold-ore'),
    reward: state => {
      return addItemToInventory(state, itemsMap['gold-ingot'], 1, true)
    },
  }))(),

  ((goal = 1000, reward = 50) => ({
    id: 'orchardist',
    name: 'Orchardist',
    description: `Pick ${integerString(goal)} fruits from trees in the Forest.`,
    rewardDescription: `${reward} units of ${itemsMap['apple-sapling'].name}`,
    ...progressAchievement(goal, state =>
      sumOfPartialRecordValues(state.treeFruitsHarvested)
    ),
    reward: state =>
      addItemToInventory(state, itemsMap['apple-sapling'], reward, true),
  }))(),

  ((goal = 100, reward = 100_000) => ({
    id: 'piemaker',
    name: 'Piemaker',
    description: `Make ${integerString(goal)} pies.`,
    rewardDescription: dollarString(reward),
    ...progressAchievement(goal, state => sumOfPiesMade(state.recipesMade)),
    reward: state => addMoney(state, reward),
  }))(),

  ((goal = 250, reward = 500) => ({
    id: 'deforestation',
    name: 'Deforestation',
    description: `Chop down ${integerString(goal)} trees in the Forest.`,
    rewardDescription: `${reward} units of ${itemsMap['wood'].name}`,
    ...progressAchievement(goal, state => state.treesChopped),
    reward: state => addItemToInventory(state, itemsMap['wood'], reward, true),
  }))(),

  ((goal = 100, reward = 25) => ({
    id: 'landscaper',
    name: 'Landscaper',
    description: `Spread ${integerString(
      goal
    )} bags of mulch (of any type) on trees in the Forest.`,
    rewardDescription: `${reward} units of ${itemsMap['rainbow-mulch'].name}`,
    ...progressAchievement(goal, state =>
      sumOfPartialRecordValues(state.mulchApplied)
    ),
    reward: state =>
      addItemToInventory(state, itemsMap['rainbow-mulch'], reward, true),
  }))(),
]

export default achievements

export const achievementsMap = achievements.reduce(
  (acc: Record<string, farmhand.achievement>, achievement) => {
    acc[achievement.id] = achievement

    return acc
  },
  {} as Record<string, farmhand.achievement>
)
