import { findInField, getCropLifeStage, moneyString } from '../utils'

import { cropLifeStage } from '../enums'

const { SEED } = cropLifeStage

const addMoney = (state, reward) => ({ ...state, money: state.money + reward })

export default [
  ((reward = 150) => ({
    id: 'plant-crop',
    name: 'Plant a crop',
    description: 'Purchase a seed and plant it in the field.',
    rewardDescription: moneyString(reward),
    condition: state =>
      findInField(state.field, plot => plot && getCropLifeStage(plot) === SEED),
    reward: state => addMoney(state, reward),
  }))(),
  ((reward = 150) => ({
    id: 'water-crop',
    name: 'Water a crop',
    description: 'Water a crop that you planted.',
    rewardDescription: moneyString(reward),
    condition: state =>
      findInField(state.field, plot => plot && plot.wasWateredToday),
    reward: state => addMoney(state, reward),
  }))(),
  {
    id: 'harvest-crop',
    name: 'Harvest a crop',
    description: 'Harvest a crop that you planted',
    rewardDescription: moneyString(300),
    condition: () => false,
    reward: state => state,
  },
]
