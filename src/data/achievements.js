import {
  findInField,
  getCropLifeStage,
  doesPlotContainCrop,
  dollarString,
  moneyTotal,
} from '../utils'
import { cowColors, cropLifeStage } from '../enums'
import { COW_FEED_ITEM_ID } from '../constants'
import { addItemToInventory } from '../reducers'

import { itemsMap } from './maps'

const { SEED } = cropLifeStage

const addMoney = (state, reward) => ({
  ...state,
  money: moneyTotal(state.money, reward),
})

const sumOfCropsHarvested = cropsHarvested =>
  Object.values(cropsHarvested).reduce(
    (sum, cropHarvested) => sum + cropHarvested,
    0
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

  ((goal = 15) => ({
    id: 'master-harvester',
    name: 'Master Harvester',
    description: `Harvest ${goal} crops to prove you've mastered the art of the harvest.`,
    rewardDescription: 'The "Harvest All" skill',
    condition: state => sumOfCropsHarvested(state.cropsHarvested) >= goal,
    reward: state => state,
  }))(),

  ((goal = 10000) => ({
    id: 'unlock-crop-price-guide',
    name: 'Prove Yourself as a Farmer',
    description: `Show that you can run a farm by earning at least ${dollarString(
      goal
    )}. Proven farmers get access to the Crop Price Guide, an invaluable tool for making better buying and selling decisions!`,
    rewardDescription: 'Crop Price Guide',
    condition: state => state.money >= goal,
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
      Object.values(cowColors).every(
        color => state.cowColorsPurchased[color] > 0
      ),
    reward: state => addItemToInventory(state, cowFeed, reward),
  }))(),
]

export default achievements

export const achievementsMap = achievements.reduce((acc, achievement) => {
  acc[achievement.id] = achievement

  return acc
}, {})
