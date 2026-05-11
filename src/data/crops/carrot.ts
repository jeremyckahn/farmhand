import { crop, fromSeed } from '../crop.js'
import { cropType } from '../../enums.js'

export const carrotSeed: farmhand.item = crop({
  cropType: cropType.CARROT,
  cropTimeline: [2, 1, 1, 1],
  growsInto: 'carrot',
  id: 'carrot-seed',
  name: 'Carrot Seed',
  tier: 1,
})

export const carrot: farmhand.item = crop({
  ...fromSeed(carrotSeed, {
    canBeFermented: true,
  }),
  name: 'Carrot',
})
