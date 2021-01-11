import {
  doesPlotContainCrop,
  dollarString,
  findInField,
  getCropLifeStage,
  getProfit,
  memoize,
  moneyTotal,
} from '../utils'
import { cropLifeStage, standardCowColors } from '../enums'
import { COW_FEED_ITEM_ID } from '../constants'
import { addItemToInventory } from '../reducers'

import { itemsMap } from './maps'

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
    reward: state => addItemToInventory(state, cowFeed, reward),
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
    reward: state => addItemToInventory(state, cowFeed, reward),
  }))(),

  ((goal = 5000, reward = 25) => ({
    id: 'daily-profit-1',
    name: `Daily profit: ${dollarString(goal)}`,
    description: `Earn ${dollarString(goal)} of profit in a single day.`,
    rewardDescription: `${reward} units of ${itemsMap.fertilizer.name}`,

    // TODO: Change this to use the daily profit record stat once it exists.
    condition: state =>
      getProfit(state.todaysRevenue, state.todaysLosses) >= goal,
    reward: state => addItemToInventory(state, itemsMap.fertilizer, reward),
  }))(),
]

export default achievements

export const achievementsMap = achievements.reduce((acc, achievement) => {
  acc[achievement.id] = achievement

  return acc
}, {})
