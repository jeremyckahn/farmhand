import { addItemToInventory } from '../game-logic/reducers/index.js'
import {
  doesPlotContainCrop,
  dollarString,
  getCropLifeStage,
  getProfitRecord,
  integerString,
  isOctober,
  moneyTotal,
  percentageString,
} from '../utils/index.js'
import { memoize } from '../utils/memoize.js'
import { findInField } from '../utils/findInField.js'
import { addExperience } from '../game-logic/reducers/index.js'
import { cropLifeStage, standardCowColors } from '../enums.js'
import {
  COW_FEED_ITEM_ID,
  EXPERIENCE_VALUES,
  I_AM_RICH_BONUSES,
} from '../constants.js'

import { itemsMap } from './maps.js'

const { SEED } = cropLifeStage

const addMoney = (state, reward) => ({
  ...state,
  money: moneyTotal(state.money, reward),
})

const sumOfCropsHarvested = memoize(cropsHarvested =>
  Object.values(cropsHarvested).reduce(
    (sum, cropHarvested) => sum + cropHarvested,
    0
  )
)

const cowFeed = itemsMap[COW_FEED_ITEM_ID]

const achievements = [
  ((reward = 100) => ({
    id: 'plant-crop',
    name: 'Plant a Crop',
    description: 'Purchase a seed and plant it in the field.',
    rewardDescription: dollarString(reward),
    condition: state =>
      findInField(
        state.field,
        plot => doesPlotContainCrop(plot) && getCropLifeStage(plot) === SEED
      ),
    reward: state => addMoney(state, reward),
  }))(),

  ((reward = 150) => ({
    id: 'water-crop',
    name: 'Water a Crop',
    description: 'Water a crop that you planted.',
    rewardDescription: dollarString(reward),
    condition: state =>
      findInField(
        state.field,
        plot => doesPlotContainCrop(plot) && plot.wasWateredToday
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
    condition: state => state.revenue >= goal,
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

  ((reward = 100) => ({
    id: 'purchase-all-cow-colors',
    name: 'Cows of Many Colors',
    description: 'Show that you love all cows and purchase one of every color.',
    rewardDescription: `${reward} units of ${cowFeed.name}`,
    condition: state =>
      Object.values(standardCowColors).every(
        color => state.cowColorsPurchased[color] > 0
      ),
    reward: state => addItemToInventory(state, cowFeed, reward, true),
  }))(),

  ((reward = 150) => ({
    id: 'play-during-october',
    name: 'Halloween Harvest',
    description: 'Play Farmhand in October and get the gift of the season.',
    rewardDescription: `${reward} units of ${itemsMap.jackolantern.name}`,
    condition: () => isOctober(),
    reward: state =>
      addItemToInventory(state, itemsMap.jackolantern, reward, true),
  }))(),

  ((reward = 100, goal = 10_000) => ({
    id: 'sell-10000-jack-o-lanterns',
    name: 'Spooky Pumpkin Patch',
    description: `Sell ${integerString(goal)} units of ${
      itemsMap.jackolantern.name
    }. That's enough to fill a whole pumpkin patch!`,
    rewardDescription: `${reward} units of ${itemsMap.scarecrow.name}`,
    condition: state => state.itemsSold.jackolantern >= goal,
    reward: state =>
      addItemToInventory(state, itemsMap.scarecrow, reward, true),
  }))(),

  ((goal = 5000, reward = 25) => ({
    id: 'daily-profit-1',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap.fertilizer.name}`,
    condition: state =>
      getProfitRecord(
        state.recordSingleDayProfit,
        state.todaysRevenue,
        state.todaysLosses
      ) >= goal,
    reward: state =>
      addItemToInventory(state, itemsMap.fertilizer, reward, true),
  }))(),

  ((goal = 15000, reward = 50) => ({
    id: 'daily-profit-2',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap['onion-seed'].name}`,
    condition: state =>
      getProfitRecord(
        state.recordSingleDayProfit,
        state.todaysRevenue,
        state.todaysLosses
      ) >= goal,
    reward: state =>
      addItemToInventory(state, itemsMap['onion-seed'], reward, true),
  }))(),

  ((goal = 50000, reward = 100) => ({
    id: 'daily-profit-3',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap['tomato-seed'].name}`,
    condition: state =>
      getProfitRecord(
        state.recordSingleDayProfit,
        state.todaysRevenue,
        state.todaysLosses
      ) >= goal,
    reward: state =>
      addItemToInventory(state, itemsMap['tomato-seed'], reward, true),
  }))(),

  ((goal = 2500, reward = 35, rewardItem = itemsMap['pumpkin-seed']) => ({
    id: 'profit-average-1',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    condition: state => state.record7dayProfitAverage >= goal,
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 10000, reward = 100, rewardItem = itemsMap['potato-seed']) => ({
    id: 'profit-average-2',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    condition: state => state.record7dayProfitAverage >= goal,
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 25000, reward = 250, rewardItem = itemsMap['soybean-seed']) => ({
    id: 'profit-average-3',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    condition: state => state.record7dayProfitAverage >= goal,
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 50000, reward = 300, rewardItem = itemsMap['chocolate-milk']) => ({
    id: 'profit-average-4',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    condition: state => state.record7dayProfitAverage >= goal,
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 150000, reward = 500, rewardItem = itemsMap['rainbow-milk-3']) => ({
    id: 'profit-average-5',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    condition: state => state.record7dayProfitAverage >= goal,
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 1000000, reward = 1000, rewardItem = itemsMap['rainbowCheese']) => ({
    id: 'profit-average-6',
    name: `7-day profit average: ${dollarString(goal)}`,
    description: `Reach a 7-day profit average of ${dollarString(goal)}.`,
    rewardDescription: `${reward} units of ${rewardItem.name}`,
    condition: state => state.record7dayProfitAverage >= goal,
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
    condition: state => state.itemsSold[goalItem.id] >= goal,
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
    condition: state => state.itemsSold[goalItem.id] >= goal,
    reward: state => addItemToInventory(state, rewardItem, reward, true),
  }))(),

  ((goal = 10000, goalItem = itemsMap['burger'], reward = 5000) => ({
    id: 'sale-goal-3',
    name: `Burger Master`,
    description: `Sell ${integerString(goal)} ${goalItem.name} units.`,
    rewardDescription: `${integerString(reward)} additional inventory spaces`,
    condition: state => state.itemsSold[goalItem.id] >= goal,
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
    condition: state => state.revenue >= goal,
    reward: state => state,
  }))(),

  ((goal = 1000000) => ({
    id: 'i-am-rich-2',
    name: 'Millionaire',
    description: `Earn ${dollarString(goal)}.`,
    rewardDescription: `All sales receive a ${percentageString(
      I_AM_RICH_BONUSES[1]
    )} bonus`,
    condition: state => state.revenue >= goal,
    reward: state => state,
  }))(),

  ((goal = 1000000000) => ({
    id: 'i-am-rich-3',
    name: 'Billionaire',
    description: `Earn ${dollarString(goal)}.`,
    rewardDescription: `All sales receive a ${percentageString(
      I_AM_RICH_BONUSES[2]
    )} bonus`,
    condition: state => state.revenue >= goal,
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
]

export default achievements

export const achievementsMap = achievements.reduce((acc, achievement) => {
  acc[achievement.id] = achievement

  return acc
}, {})
