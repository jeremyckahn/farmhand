import { findInField, getCropLifeStage, moneyString } from '../utils'

import { cropLifeStage } from '../enums'

const { SEED } = cropLifeStage

export default [
  {
    id: 'plant-crop',
    name: 'Plant a crop',
    description: 'Purchase a seed and plant it in the field.',
    rewardDescription: moneyString(150),
    condition: state =>
      findInField(state.field, plot => plot && getCropLifeStage(plot) === SEED),
    reward: state => ({ ...state, money: state.money + 150 }),
  },
  {
    id: 'water-crop',
    name: 'Water a crop',
    description: 'Water a crop that you planted.',
    rewardDescription: moneyString(150),
    condition: () => false,
    reward: state => state,
  },
  {
    id: 'harvest-crop',
    name: 'Harvest a crop',
    description: 'Harvest a crop that you planted',
    rewardDescription: moneyString(300),
    condition: () => false,
    reward: state => state,
  },
]
